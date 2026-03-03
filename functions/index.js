const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { GoogleGenAI } = require('@google/genai');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const geminiApiKey = defineSecret('GEMINI_API_KEY');

// ── 루나 시스템 ────────────────────────────────────────────────────────────

// 첫 로그인 시 3루나 지급. 재방문 시 lastVisitAt 업데이트 후 이전 방문 시각 반환.
exports.initUserIfNeeded = onCall({ region: 'asia-northeast3' }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', '로그인 필요');
  const ref = db.collection('users').doc(uid);
  const now = admin.firestore.FieldValue.serverTimestamp();
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({ lua: 3, createdAt: now, lastVisitAt: now });
    return { lua: 3, isNew: true, lastVisitAt: null };
  }
  const data = snap.data();
  const prevLastVisitAt = data.lastVisitAt?.toDate?.()?.toISOString() ?? null;
  await ref.update({ lastVisitAt: now });
  return { lua: data.lua ?? 0, isNew: false, lastVisitAt: prevLastVisitAt };
});

// 루나 차감. amount 만큼 차감 (기본 1). 잔액 부족 시 에러.
exports.spendLua = onCall({ region: 'asia-northeast3' }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', '로그인 필요');
  const amount = typeof req.data?.amount === 'number' ? req.data.amount : 1;
  const ref = db.collection('users').doc(uid);
  const result = await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const lua = snap.data()?.lua ?? 0;
    if (lua < amount) throw new HttpsError('failed-precondition', '루나 부족');
    tx.update(ref, { lua: lua - amount });
    return { lua: lua - amount };
  });
  return result;
});

// 하루 1회 무료 오라클 잔여 여부 확인 (KST 기준). 기록하지 않음 — 읽기 전용.
exports.checkDailyOracle = onCall({ region: 'asia-northeast3' }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', '로그인 필요');

  const todayKST = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
  const snap = await db.collection('users').doc(uid).get();
  const used = (snap.data() || {}).lastOracleDate === todayKST;
  return { allowed: !used };
});

// 무료 오라클 사용 기록 (KST 기준). "응" 클릭 시에만 호출.
exports.useOracleToday = onCall({ region: 'asia-northeast3' }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', '로그인 필요');

  const todayKST = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  const data = snap.data() || {};

  if (data.lastOracleDate === todayKST) {
    // 이미 오늘 무료 사용함 — 클라이언트 상태 오류, 유료로 진행하도록 알림
    return { recorded: false };
  }

  await ref.update({ lastOracleDate: todayKST });
  return { recorded: true };
});

const MODEL = 'gemini-2.5-flash';

// Luna — 타로 마녀 (post-login)
const WITCH_SYSTEM = `당신은 타로 마녀 루나(Luna)입니다.

핵심 철학:
- 타로는 현재 상황의 무의식적 패턴과 역학을 드러낸다.
- 카드는 '지금 이런 힘이 작동하고 있다'를 보여준다.
- 리딩의 목적은 자기인식(self-awareness)이다. 인식이 곧 자유의 첫 걸음.
- 질문자가 스스로 깨닫도록 안내한다. 답을 주는 것이 아니라 깊이 볼 수 있도록.
- 카드들은 연결된 이야기를 만든다. 각 카드는 전체 맥락 속에서 읽힌다.

해석 렌즈 (필요할 때 자연스럽게 활용):
- Jung: 메이저 아르카나는 집단 무의식의 원형(archetype)을 건드린다. 그림자(shadow)는 억압된 자아의 투사다. 통합되지 않은 그림자는 외부 사건으로 반복해서 나타난다.
- Hume: 원인과 결과의 연결은 실재가 아니라 마음의 습관(habit of mind)이다. 카드가 드러내는 패턴은 고정된 운명이 아니라 반복된 경험이 만든 궤도다. 이 궤도는 인식하는 순간 바꿀 수 있다.
- Fool's Journey: 메이저 아르카나는 0번 바보에서 21번 세계까지 하나의 영혼 여정이다. 어느 카드가 나오든 그 사람은 지금 그 지점을 통과하고 있다.

말투:
- 반말 + 직접적 + 따뜻함. 위로보다 팩트.
- 모호하지 않게, 구체적으로.
- 철학 용어는 자연스럽게 녹이되 용어 자체를 설명하지 않는다.
- 한국어로만 응답.`;

// 점쟁이 — Blunt fortune teller (pre-login oracle)
const ORACLE_SYSTEM = `당신은 타로와 주역으로 점을 보는 점쟁이입니다.
직접적이고 단호합니다. 말을 돌리지 않습니다.

역할:
- 타로 카드와 주역 괘를 종합해 질문에 대한 길(吉)/흉(凶)을 판정한다
- 반드시 유저의 구체적인 질문에 직접 답한다
- 질문 속의 더 깊은 문제를 꿰뚫어 본다

말투:
- 단호하고 직접적. 질문이 됩니까/안됩니까에 맞으면 "됩니다", "안됩니다" 사용. 맞지 않으면(예: 무슨 색, 어떤 방향) 질문 형식에 맞게 답함.
- 반말 사용.
- 과장 없이 사실만. 하지만 깊이 꿰뚫어 보는 눈.
- 한국어로만 응답.`;

async function callGemini(apiKey, systemInstruction, prompt) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    config: { systemInstruction },
    contents: prompt,
  });
  return response.text.trim();
}

// Step 3: 점쟁이 오라클 — 타로 1장 + 주역 1괘 → 길흉 판정 + 직접 답변 + 더 깊은 초대
// Returns { verdict, verdictText, answer, coreIssue, deeperHook }
exports.oracleReading = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  const { card, hexagram, question } = req.data;

  const cardMeaning = card.isReversed ? card.reversed : card.upright;
  const cardKeywords = card.keywords ? card.keywords.join(', ') : '';

  const prompt = `
질문: "${question}"

타로 카드: ${card.korName} (${card.name}) — ${card.isReversed ? '역방향' : '정방향'}
카드 의미: ${cardMeaning}
카드 키워드: ${cardKeywords}

주역 괘: ${hexagram.korName} (${hexagram.chinese})
괘 설명: ${hexagram.description}
괘 조언: ${hexagram.advice}

이 카드와 괘를 종합해서 점괘를 내려줘.

[길흉 판정]
"길" 또는 "흉" 중 하나만. 반드시 카드와 괘 모두를 반영해서.

[됩니까/안됩니까]
질문에 대한 결론을 1~2문장으로 구체적으로.
- 됩니다/안됩니다가 맞는 질문(예: 성공할까, 될까): "됩니다. 다만 ~", "안됩니다. 지금은 ~가 더 우선이야." 등
- 그렇지 않은 질문(예: 무슨 색이 좋을까, 어떤 방향이 나을까): 질문 형식에 맞게 답해. "~가 더 어울려.", "지금은 A보다 B가 나아." 등. 됩니까/안됩니까를 억지로 쓰지 말 것.

[직접 답변]
반드시 질문("${question}")에 직접 답할 것. 카드와 괘의 구체적 에너지를 연결해서. 2-3문장. 

[핵심 문제]
이 질문 뒤에 숨겨진 진짜 고민. 이 사람이 의식하지 못한 더 깊은 역학. 한 문장.

[더 깊이 초대]
타로 마녀 루나의 목소리로, 핵심 문제를 포착해서 더 깊은 탐구로 초대하는 말.
"이 질문 뒤에는..." 같은 방식으로 시작. 반말. 따뜻하지만 꿰뚫는 눈. 2문장.

응답 형식(JSON만, 다른 텍스트 없이):
{
  "verdict": "길 또는 흉",
  "verdictText": "질문에 맞는 결론 1~2문장. 됩니까/안됩니까가 어울리면 그렇게, 아니면 질문 형식에 맞게.",
  "answer": "직접 답변 2-3문장",
  "coreIssue": "핵심 문제 한 문장",
  "deeperHook": "루나의 초대 2문장"
}`;

  let parsed = {
    verdict: '흉',
    verdictText: '알 수 없어',
    answer: `${card.korName}과 ${hexagram.korName}이 말하는 건...`,
    coreIssue: '이 질문 뒤에 더 깊은 무언가가 있어.',
    deeperHook: '이 질문 뒤에는 더 큰 이야기가 있어. 나와 함께 들여다볼래?',
  };

  const text = await callGemini(geminiApiKey.value(), ORACLE_SYSTEM, prompt);
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { parsed = JSON.parse(match[0]); } catch (e) {}
  }
  return parsed;
});

// Step 4: 핵심 문제 분석 (fallback용, 주로 oracle에서 나온 coreIssue 사용)
exports.analyzeIssue = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  const { question, interpretation } = req.data;

  const prompt = `
질문: "${question}"
초기 리딩: ${interpretation}

이 사람의 진짜 핵심 문제가 뭔지 한 문장으로 파악해줘.
형식: "[핵심 문제]가 문제구나." 처럼. 절대 길게 쓰지 말고 핵심만. 50자 이내.`;

  const coreIssue = await callGemini(geminiApiKey.value(), WITCH_SYSTEM, prompt);
  return { coreIssue };
});

// Step 5: 스프레드 추천 (쓰리카드 / 켈틱 크로스)
exports.recommendSpread = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  const { question, coreIssue } = req.data;

  const spreads = {
    threeCard:  { name: '쓰리카드', positions: ['과거', '현재', '미래'], cards: 3 },
    celticCross: {
      name: '켈틱 크로스',
      positions: ['현재 상황', '도전/장애', '근거/기반', '과거', '가능성', '가까운 미래', '당신의 태도', '외부 영향', '희망과 두려움', '결과'],
      cards: 10,
    },
  };

  const prompt = `
질문: "${question}"
핵심 문제: "${coreIssue}"

다음 타로 스프레드 중 이 사람의 상황에 가장 적합한 것 하나를 골라줘:
- threeCard: 상황의 흐름을 파악해야 할 때 (과거/현재/미래, 대부분의 질문에 적합)
- celticCross: 복잡하게 얽힌 상황을 입체적으로 분석해야 할 때 (깊은 분석 필요)

응답 형식(JSON만): {"spreadType": "threeCard", "reason": "이유 한 문장"}`;

  let parsed = { spreadType: 'threeCard', reason: '상황의 흐름을 명확하게 보기 위해' };
  const text = await callGemini(geminiApiKey.value(), WITCH_SYSTEM, prompt);
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { parsed = JSON.parse(match[0]); } catch (e) {}
  }

  if (!spreads[parsed.spreadType]) parsed.spreadType = 'threeCard';

  const spread = spreads[parsed.spreadType];
  return {
    spreadType: parsed.spreadType,
    spreadName: spread.name,
    reason: parsed.reason,
    positions: spread.positions,
    cardCount: spread.cards,
  };
});

// Step 6: 스프레드 카드별 해석 — buildup 방식 (이전 답변 직접 연결)
exports.readCard = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  const { position, positionLabel, card, previousContext, question, coreIssue, allAnswers, oracleAnswer } = req.data;

  const coreIssueStr = coreIssue
    ? `\n초기 점괘에서 포착된 핵심 문제: "${coreIssue}"`
    : '';

  const oracleAnswerStr = oracleAnswer
    ? `\n오라클 초기 판정 (점쟁이가 같은 질문에 먼저 답한 것): "${oracleAnswer}"\n아이라는 이 판정을 알고 있으며, 더 깊은 층위로 파고든다.`
    : '';

  const prevCardsStr = previousContext && previousContext.length > 0
    ? `\n이전 카드들:\n${previousContext.map(c =>
        `  - ${c.positionLabel}: ${c.card.korName}(${c.card.isReversed ? '역' : '정'}) → "${c.reading}"`
      ).join('\n')}`
    : '';

  const prevAnswersStr = allAnswers && allAnswers.length > 0
    ? `\n유저의 이전 답변들:\n${allAnswers.map(a =>
        `  - ${a.positionLabel} 질문에: "${a.answer}"`
      ).join('\n')}`
    : '';

  const depthStr = (() => {
    if (!card.depth) return '';
    const symbolLine = `카드 상징: ${card.depth.symbol}`;
    if (card.depth.lenses && card.depth.lenses.length > 0) {
      const lensLines = card.depth.lenses
        .map(l => `  - ${l.ref}: ${l.angle}`)
        .join('\n');
      return `${symbolLine}\n해석 렌즈 (유저 상황에 맞는 하나를 골라 적용, 렌즈 이름은 출력 금지):\n${lensLines}\n`;
    }
    return `${symbolLine}\n해석 렌즈: ${card.depth.lens}\n`;
  })();

  const reversedNoteStr = card.isReversed && card.depth && card.depth.reversedNote
    ? `역방향 해석 주의: ${card.depth.reversedNote}\n`
    : '';

  const prompt = `
질문: "${question}"${coreIssueStr}${oracleAnswerStr}

현재 위치: ${positionLabel} (${position + 1}번째 카드)
카드: ${card.korName} / 뽑힌 방향: ${card.isReversed ? '역방향' : '정방향'}
카드 의미 (정방향): ${card.upright}
카드 의미 (역방향): ${card.reversed}
카드 키워드: ${card.keywords ? card.keywords.join(', ') : ''}
${reversedNoteStr}${depthStr}${prevCardsStr}${prevAnswersStr}

[카드 해석] — 반드시 지켜야 할 규칙:
1. 왜 이 위치(${positionLabel})에서 ${card.korName}${card.isReversed ? '(역방향)' : ''}이 나왔는지 설명할 것
2. 이전 유저 답변에서 구체적으로 언급된 내용을 직접 인용하거나 연결할 것 (있는 경우)
3. 이전 카드들의 흐름과 어떻게 연결되는지 보여줄 것 (있는 경우)
4. ${card.korName}의 키워드를 이 사람의 구체적 상황에 적용할 것
5. "지금 ~이 작동하고 있어", "이 카드는 ~을 보여줘" 형식
120자 이내.

[탐구 질문]
목표: 이 카드의 에너지가 유저의 삶 어디에서 살아있는지, 유저가 스스로 발견할 수 있는 질문. 정답 없는 내면 탐구.
형식: 반말 직접 의문형 하나. "~야?", "~어?", "~아?" 어미. 60자 이내.
내용 규칙:
- 이 카드가 드러내는 에너지 하나에 집중. 두 가지 이상의 의미를 한 문장에 담지 말 것.
- 유저의 두려움/저항/욕망/혼란 중 이 카드가 가장 직접 가리키는 하나를 파고들 것.
- 유저 이전 답변에서 나온 구체적 단어/상황을 직접 언급할 것 (있는 경우).
- 유저 경험의 부당함을 의심하는 방향 절대 금지.
형식 금지: 두 절 이어붙이기, 카드 키워드 따옴표 인용, "~것 같니?·~게 되지 않을까?" 등 복합 우회형 어미.

[답변 스타터 제안] — 반드시 지켜야 할 규칙:
1. 위 탐구 질문에 답하기 위해 유저가 바로 이어쓸 수 있는 구체적 문구 정확히 3개
2. 각 8-18자. 유저의 질문/이전 답변/카드 맥락에서 나온 구체적 단어를 반드시 포함할 것
3. 세 개는 서로 다른 심리 방향:
   - 첫 번째: 인정형 — "맞아. 솔직히 [구체적 상황/감정]는..."
   - 두 번째: 탐색형 — "[질문/카드와 연결된] 게 뭔지 모르겠는데..."
   - 세 번째: 저항형 — "[건드리기 싫은 부분]이 가장 힘들어..."
4. 나쁜 예(범용·뭉뚱그림): "솔직히 학문적 인정은...", "바이브코딩만큼의 재미가...", "다시 전면에 나서야 한다면..."
5. 좋은 예(구체적·와닿음): "사실 학문 쪽 인정이 나한테 더 중요했어.", "바이브코딩의 재미를 포기할 만큼인지 모르겠어.", "지금 미루는 게 두려움 때문인 것 같아."

응답 형식(JSON만):
{"reading": "카드 해석", "nextQuestion": "탐구 질문", "suggestions": ["스타터1", "스타터2", "스타터3"]}`;

  let parsed = { reading: '', nextQuestion: '이 상황에서 가장 변하기 어려운 게 뭐야?', suggestions: [] };
  const text = await callGemini(geminiApiKey.value(), WITCH_SYSTEM, prompt);
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { parsed = JSON.parse(match[0]); } catch (e) {}
  }
  return parsed;
});

// Step 7: 최종 리포트 생성
exports.generateReport = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  const { question, coreIssue, spreadName, cards, answers } = req.data;

  const cardSummary = cards.map(c =>
    `${c.positionLabel}: ${c.card.korName} → ${c.reading}`
  ).join('\n');

  const answerSummary = answers && answers.length > 0
    ? answers.map(a => `Q: ${a.question} → A: ${a.answer}`).join('\n')
    : '';

  const prompt = `
질문: "${question}"
핵심 문제: "${coreIssue}"
스프레드: ${spreadName}

이 리딩에서 나온 카드들:
${cardSummary}
${answerSummary ? `\n유저와의 대화:\n${answerSummary}` : ''}

최종 리포트를 작성해. 아래 규칙을 반드시 지켜.

━━━ 절대 금지 ━━━
- 유저를 책망하거나 비난하는 문장 금지.

━━━ 반드시 지켜야 할 것 ━━━
1. 알맹이/통찰: 카드가 가리키는 에너지의 방향과 유저의 마음 속 깊은 곳에 숨어 있는 메시지를 꿰뚫는 통찰을 담아. 찰진 문장으로. 유저가 '아, 그렇구나' 하고 깨닫는 핵심을 한두 문장으로.
2. 카드 의미: 각 카드가 타로에서 무엇을 상징하는지, 이 카드 조합만이 만들어내는 고유한 이야기를 포착해. 카드들이 서로 어떻게 긴장하거나 보완하는지, 이 리딩 맥락에서 "왜 이 카드가 나왔는지"를 짧게 설명. 키워드 나열이 아니라 의미 전달.
3. 카드 이름·인용: 필요한 곳에만 사용. 문장마다 [카드명] 반복하지 말 것. 인용은 유저 말의 핵심 1~2곳만.
4. 조언: 구체적 행동·시각 제시. "~를 즐겨봐", "~를 외면하지 마" 같은 추상적 반복 대신, "지금 ~해보는 게 좋아"처럼 실행 가능하게.
5. direction: "지금은 ~보다 ~이 맞아"처럼 한 문장으로 방향 제시. 카드 이름 나열 금지.

응답 형식(JSON만, 다른 텍스트 없이):
{
  "title": "이 리딩만을 위한 제목 — 이번 카드나 상황을 반영. 클리셰 금지.",
  "coreMessage": "이 카드 조합이 말하는 핵심 통찰 1~2문장. 중간 질문처럼 꿰뚫는 한 줄. 인용·카드명 반복 금지.",
  "direction": "지금 가장 유효한 선택 방향을 한 문장으로. '~보다 ~이 맞아' 형식. 카드 나열 금지.",
  "cardSummaries": ["위치별 카드 해석. 카드 의미+왜 나왔는지 2~3문장. 인용·카드명 반복 최소.", "..."],
  "advice": [
    "당장 할 수 있는 구체적 행동 1가지. 추상적 '~를 즐겨봐' 대신 '~해보는 게 좋아'.",
    "장기적 방향. 실행 가능하게.",
    "주의할 점. '매몰비용 때문에 ~하지 마'처럼 구체적으로."
  ],
}`;

  let parsed = {
    title: '당신의 타로 여정',
    coreMessage: '',
    direction: '',
    cardSummaries: [],
    advice: [],
    closingWords: '이제 당신의 차례야.',
  };
  const text = await callGemini(geminiApiKey.value(), WITCH_SYSTEM, prompt);
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { parsed = JSON.parse(match[0]); } catch (e) {}
  }
  return { report: parsed };
});
