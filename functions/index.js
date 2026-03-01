const { onCall } = require('firebase-functions/v2/https');
const { GoogleGenAI } = require('@google/genai');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const { FieldValue } = admin.firestore;

const geminiApiKey = defineSecret('GEMINI_API_KEY');
const tossSecretKey = defineSecret('TOSS_SECRET_KEY');
const ADMIN_UID = process.env.ADMIN_UID || '';

const MODEL = 'gemini-2.5-flash';

// Aira — 타로 마녀 (post-login)
const WITCH_SYSTEM = `당신은 타로 마녀 아이라(Aira)입니다.

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

async function callGemini(apiKey, systemInstruction, prompt) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    config: { systemInstruction },
    contents: prompt,
  });
  return response.text.trim();
}

// 쓰리카드 스프레드 카드별 해석 — buildup 방식 (이전 답변 직접 연결)
exports.readCard = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  const { position, positionLabel, card, previousContext, question, coreIssue, allAnswers } = req.data;

  const coreIssueStr = coreIssue
    ? `\n초기 점괘에서 포착된 핵심 문제: "${coreIssue}"`
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
질문: "${question}"${coreIssueStr}

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

[탐구 질문] — 반드시 지켜야 할 규칙:
1. 자연스럽고 누구나 의미를 이해하기 쉬운 완성된 한 문장. 뚝 끊기지 않는 대화체. 
2. 카드의 의미와 유저의 context를 두루 살피되 지나치게 여러 번의 전환이 들어가서 문장을 이해하기 어렵게 하지 말 것. 
2. 유저가 이전 답변에서 말한 구체적인 단어나 상황을 직접 언급할 것 (있는 경우)
4. 유저가 경험한 차별, 부당함, 불공정은 사실로 받아들일 것. "혹시 과장 아닐까?", "네가 오해한 거 아닐까?" 식의 질문 절대 금지. 그 경험을 어떻게 내면화하거나 대처하는지에 집중.
5. 유저가 느끼는 기대나 불안감이나 혼란의 원인을 파고들 것.
60자 이내.

[답변 스타터 제안] — 반드시 지켜야 할 규칙:
1. 위 탐구 질문에 답하기 위해 자연스럽게 타이핑을 시작할 수 있는 짧은 문구 정확히 3개
2. 각 10-20자 이내. 완성된 답이 아니라 생각을 여는 시작점 — 유저가 뒤에 이어쓸 수 있어야 함
3. 반드시 서로 완전히 다른 심리적 방향 — 세 개가 비슷한 의미면 실패:
   - 첫 번째: 인정/확신형 — 이미 알거나 솔직히 인정하는 시작 (예: "솔직히 말하면...", "사실 나는...")
   - 두 번째: 탐색/혼란형 — 아직 모르거나 명확하지 않은 시작 (예: "왜 그런지 모르겠는데...", "이게 뭔지...")
   - 세 번째: 고통/저항형 — 인정하기 힘들거나 건드리기 싫은 시작 (예: "가장 힘든 건...", "인정하기 싫지만...")
4. 이 카드와 질문 맥락에 맞는 구체적인 언어를 쓸 것. 모든 상황에 쓸 수 있는 범용 문구 금지.

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

// 쓰리카드 최종 리포트 생성
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
- 유저를 책망하거나 비난하는 문장 금지. 유저의 reflection이 필요하다고 보이는 부분은 유저의 문장을 인용. 

━━━ 반드시 지켜야 할 것 ━━━
1. 모든 문장은 특정 카드 이름을 직접 명시해야 해.
   좋은 예: "[운명의 수레바퀴]가 '현재' 자리에 나왔다는 건 지금 변화의 기점이라는 뜻이야."
   나쁜 예: "지금 변화의 기점에 있어." (카드 이름 없음 — 실패)
2. 이 카드 조합만이 만들어내는 고유한 이야기를 포착해. 카드들이 서로 어떻게 긴장하거나 보완하는지.
   예: "[컵의 시종]의 감수성과 [완드의 5]의 혼돈이 동시에 있다는 게 흥미로워."
3. 유저가 대화에서 직접 말한 내용이 있으면 그것을 인용하거나 직접 연결해.
4. 조언은 "이 카드가 보여주는 구체적 방향"이어야 해. 실제로 다르게 해볼 수 있는 행동이나 시각을 제시해서 유저가 산뜻한 기분으로 무언가를 하면 좋을지 생각할 수 있도록. 
5. direction 필드: 타로는 유저의 상황을 둘러싼 에너지의 방향을 말할 수 있어. 
   "이 카드들을 뽑은 지금, 가장 유효한 선택 방향은?" — 카드 이름과 함께 직접 말해.
   "~쪽으로 에너지를 써" / "지금은 ~보다 ~이 맞아" 같은 방식으로. 구체적으로.

응답 형식(JSON만, 다른 텍스트 없이):
{
  "title": "이 리딩만을 위한 제목 — 이번 카드나 상황을 반영. 클리셰 금지.",
  "coreMessage": "카드의 조합이 그려주는 가장 가능성이 높은 미래를 보여줘. 1-2문장. 뭉뚱그리지 말고 확실하게 표현.",
  "direction": "유저가 원했던 모습과 카드의 에너지가 조화되는지 아닌지 묘사해.",
  "cardSummaries": ["이 자리에서 이 카드가 말하는 것. 유저 상황과 직접 연결.", "..."],
  "advice": [
    "유저가 당장 쉽게 행할 수 있는 액션 플랜 1가지.",
    "장기적 미래를 유저가 원하는 방향으로 끌고 가기 위한 조언.",
    "이 과정에서 카드의 에너지를 고려할 때 유저가 특히 주의해야 할 사항."
  ],
  "closingWords": "아이라 톤. 이번 리딩에서 가장 인상적인 카드 하나를 언급하며 마무리. 2문장."
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

// ── Tier 1: 무료 리딩 daily limit + readings doc 생성 ───────────────
exports.initFreeTierReading = onCall({ region: 'asia-northeast3' }, async (req) => {
  if (!req.auth) throw new Error('Unauthenticated');
  const uid = req.auth.uid;
  const { categoryId, questionText, cardId, isReversed, hexagramNumber } = req.data;

  // Daily limit check (query all free_fortune for user, filter by today client-side to avoid composite index)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snap = await db.collection('readings')
    .where('userId', '==', uid)
    .where('type', '==', 'free_fortune')
    .get();
  const todayCount = snap.docs.filter(d => {
    const ts = d.data().createdAt;
    if (!ts) return false;
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return date >= today;
  }).length;
  if (todayCount >= 1) return { allowed: false, reason: 'daily_limit' };

  // Create readings doc
  const ref = await db.collection('readings').add({
    userId: uid,
    type: 'free_fortune',
    categoryId: categoryId || 'general',
    questionText: questionText || '',
    cardId: cardId || null,
    isReversed: !!isReversed,
    hexagramNumber: hexagramNumber || null,
    paymentStatus: null,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { allowed: true, readingId: ref.id };
});

// ── Tier 2: Gemini 심층 리딩 생성 ───────────────────────────────────
exports.generateDeepReading = onCall({ region: 'asia-northeast3', secrets: [geminiApiKey] }, async (req) => {
  if (!req.auth) throw new Error('Unauthenticated');
  const uid = req.auth.uid;
  const { readingId, card, hexagram, categoryId, questionText } = req.data;

  // Security: verify reading belongs to caller
  const readingDoc = await db.collection('readings').doc(readingId).get();
  if (!readingDoc.exists || readingDoc.data().userId !== uid) {
    throw new Error('Unauthorized');
  }

  const depthStr = (() => {
    if (!card.depth) return '';
    const symbolLine = `카드 상징: ${card.depth.symbol}`;
    if (card.depth.lenses && card.depth.lenses.length > 0) {
      const lensLines = card.depth.lenses.map(l => `  - ${l.ref}: ${l.angle}`).join('\n');
      return `${symbolLine}\n해석 렌즈 (유저 상황에 맞는 하나만 골라 적용, 렌즈 이름 출력 금지):\n${lensLines}\n`;
    }
    return `${symbolLine}\n`;
  })();
  const reversedNoteStr = card.isReversed && card.depth && card.depth.reversedNote
    ? `역방향 해석 주의: ${card.depth.reversedNote}\n`
    : '';

  const prompt = `
질문: "${questionText}"
카테고리: ${categoryId || 'general'}

카드: ${card.korName} / 방향: ${card.isReversed ? '역방향' : '정방향'}
카드 의미 (정방향): ${card.upright || ''}
카드 의미 (역방향): ${card.reversed || ''}
카드 키워드: ${(card.keywords || []).join(', ')}
${reversedNoteStr}${depthStr}
주역 괘: ${hexagram.korName} (제${hexagram.number}괘)
괘 설명: ${hexagram.description || ''}
판단: ${hexagram.judgment || ''}
조언: ${hexagram.advice || ''}

이 카드와 주역 괘의 조합이 드러내는 깊은 메시지를 3-4문단으로 써줘.
각 문단은 빈 줄로 구분해.

반드시 JSON으로만 응답해:
{"fullText": "전체 리딩 (3-4문단)", "coreIssue": "이 사람의 핵심 문제를 한 문장으로 (쓰리카드 리딩 컨텍스트로 재사용됨)"}`;

  const text = await callGemini(geminiApiKey.value(), WITCH_SYSTEM, prompt);
  const match = text.match(/\{[\s\S]*\}/);
  let fullText = '';
  let coreIssue = '';
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      fullText = parsed.fullText || '';
      coreIssue = parsed.coreIssue || '';
    } catch (e) {
      fullText = text;
    }
  } else {
    fullText = text;
  }

  // Preview = first 2 paragraphs
  const paragraphs = fullText.split(/\n\n+/).filter(p => p.trim());
  const preview = paragraphs.slice(0, 2).join('\n\n');

  // Update reading doc
  await db.collection('readings').doc(readingId).update({
    fullText,
    coreIssue,
    preview,
    paymentStatus: 'pending',
  });

  return {
    preview,
    coreIssue,
    blurredLength: fullText.length - preview.length,
    paragraphCount: paragraphs.length,
  };
});

// ── 토스페이먼츠 결제 검증 ────────────────────────────────────────
exports.verifyTossPayment = onCall({ region: 'asia-northeast3', secrets: [tossSecretKey] }, async (req) => {
  if (!req.auth) throw new Error('Unauthenticated');
  const uid = req.auth.uid;
  const { paymentKey, orderId, amount, readingId, sessionId, productType } = req.data;
  if (!paymentKey || !orderId || !amount) throw new Error('Missing params');

  // Call Toss Payments confirm API
  const encoded = Buffer.from(`${tossSecretKey.value()}:`).toString('base64');
  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const tossData = await tossRes.json();
  if (!tossRes.ok) {
    throw new Error(tossData.message || 'Payment confirmation failed');
  }

  // Save payment record
  await db.collection('payments').add({
    userId: uid,
    tossPaymentKey: paymentKey,
    orderId,
    amount,
    productType: productType || null,
    readingId: readingId || null,
    sessionId: sessionId || null,
    status: 'completed',
    tossStatus: tossData.status,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Unlock reading or session
  if (readingId) {
    await db.collection('readings').doc(readingId).update({ paymentStatus: 'paid', paymentKey });
  }
  if (sessionId) {
    await db.collection('sessions').doc(sessionId).update({ paymentStatus: 'paid', paymentKey });
  }

  return { success: true, productType, readingId: readingId || null, sessionId: sessionId || null };
});

// ── 어드민 전용 함수 ──────────────────────────────────────────────

function assertAdmin(req) {
  if (!req.auth || req.auth.uid !== ADMIN_UID) {
    throw new Error('Unauthorized');
  }
}

// 전체 유저 목록
exports.adminGetUsers = onCall({ region: 'asia-northeast3' }, async (req) => {
  assertAdmin(req);
  const snap = await db.collection('users').get();
  const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  return { users };
});

// 특정 유저 세션 목록
exports.adminGetUserSessions = onCall({ region: 'asia-northeast3' }, async (req) => {
  assertAdmin(req);
  const { targetUid } = req.data;
  const snap = await db.collection('sessions')
    .where('userId', '==', targetUid)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
  const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { sessions };
});

// 전체 문의 목록
exports.adminGetMessages = onCall({ region: 'asia-northeast3' }, async (req) => {
  assertAdmin(req);
  const snap = await db.collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();
  const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { messages };
});

// 문의 답변
exports.adminReplyMessage = onCall({ region: 'asia-northeast3' }, async (req) => {
  assertAdmin(req);
  const { messageId, reply } = req.data;
  if (!messageId || !reply) throw new Error('Invalid params');
  await db.collection('messages').doc(messageId).update({
    reply,
    repliedAt: FieldValue.serverTimestamp(),
    isReadByAdmin: true,
  });
  return { ok: true };
});
