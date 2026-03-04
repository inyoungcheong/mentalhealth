import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GraySprite, ChibiGraySprite } from '../components/pixels/PixelGray';
import { WitchSprite, ChibiWitchSprite } from '../components/pixels/PixelWitch';
import { ChibiChildSprite } from '../components/pixels/PixelChild';
import ChatBubble from '../components/ChatBubble';
import { checkDailyOracle, useOracleToday } from '../services/luaService';

// ── NPC 대사 풀 ──────────────────────────────────────────────────────────────
const GRAY_NEW    = ['…처음 왔네.', '할 말은 짧게 해줘. 뭐가 궁금해?'];
const GRAY_NIGHT  = [['이 시간에.', '…카드는 솔직하거든.'], ['밤이네.', '뭐가 마음에 걸려?']];
const GRAY_RETURN = [
  ['또 왔어.', '뭐가 또 생겼어?'],
  ['그래서.', '오늘은 뭐야?'],
  ['…왔네.', '카드는 준비됐어. 말해봐.'],
  ['기다리고 있었어.', '뭐가 궁금해?'],
];
const AIRA_NEW    = ['어서 와. 이름은 아이라야.', '네 이야기가 궁금해 — 말해봐.'];
const AIRA_NIGHT  = [
  ['이 시간에 왔다는 건…', '잠이 안 오거나, 뭔가가 걸려있거나.'],
  ['밤에 뽑는 카드가 더 솔직해.', '어떤 이야기를 들어줄까?'],
];
const AIRA_RETURN = [
  ['또 왔네.', '오늘은 어떤 이야기를 들어줄까?'],
  ['왔구나.', '카드가 술렁이더라 — 네 기운을 느낀 모양이야.'],
  ['잘 왔어.', '여기는 언제든 네 자리가 있어.'],
  ['반가워.', '어떤 이야기가 펼쳐질까.'],
];

const QUESTION_PROMPTS = [
  '지금 가장 마음에 걸리는 게 뭐야?',
  '만약 카드가 뭐든 대답해줄 수 있다면 — 뭘 물을래?',
  '지금 네 마음을 가장 무겁게 하는 질문이 뭐야?',
  '뭐가 알고 싶어? 카드는 준비됐어.',
  '요즘 가장 생각이 많은 게 뭐야?',
  '지금 결정하지 못하고 있는 게 있어?',
];

// 23 example questions across diverse topics
const ALL_EXAMPLE_QUESTIONS = [
  // 연애
  '그 사람이 나를 좋아하는 걸까, 아닐까?',
  '우리 사이 이대로 계속 가도 괜찮을까?',
  '이 관계, 지금 시작해도 될까?',
  '이별 후 다시 연락해도 괜찮을까?',
  // 취직/커리어
  '이번 면접에서 합격할 수 있을까?',
  '지금 회사를 그만둬야 할까, 버텨야 할까?',
  '이 일, 나한테 맞는 길이 맞을까?',
  '연봉 협상 지금 해도 괜찮은 타이밍일까?',
  '이 직장, 1년 더 다녀야 할까?',
  // 재물/투자
  '지금 이 투자, 해도 괜찮을까?',
  '빚을 먼저 갚아야 할까, 저축을 늘려야 할까?',
  '이번 달 경제적으로 좋은 흐름이 올까?',
  '이 사업 아이디어, 현실적으로 가능할까?',
  // 건강
  '요즘 몸 상태, 그냥 놔둬도 괜찮을까?',
  '이 결정, 내 심신에 좋은 방향일까?',
  // 인간관계
  '그 사람한테 먼저 사과해야 할까?',
  '이 사람과 계속 연락해도 괜찮은 걸까?',
  '팀 안에서 내가 너무 참고 있는 걸까?',
  // 은퇴/새 시작
  '이 나이에 새로 시작하는 게 맞을까?',
  '지금 내 노후 준비 방향이 맞는 걸까?',
  // 일상/결정
  '이사 지금 가도 괜찮은 시기일까?',
  '이번 결정, 미루지 말고 지금 해야 할까?',
  '지금 이 선택, 나중에 후회하지 않을까?',
];

function pickFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function pickRandom3(arr) {
  const copy = [...arr];
  const result = [];
  while (result.length < 3 && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(i, 1)[0]);
  }
  return result;
}

function buildGreeting(dest, isNew) {
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 5;
  if (dest === 'gray') {
    if (isNew) return GRAY_NEW;
    return pickFrom(isNight ? GRAY_NIGHT : GRAY_RETURN);
  } else {
    if (isNew) return AIRA_NEW;
    return pickFrom(isNight ? AIRA_NIGHT : AIRA_RETURN);
  }
}

// ── Map geometry ──────────────────────────────────────────────────────────────
// Character positions (% of map area) — calibrated to background.png cobblestone paths
const AIRA_POS  = { x: 18, y: 32 };   // in front of left house entrance
const GRAY_POS  = { x: 48, y: 60 };   // at tarot table (on vertical path, below fork) — moved right to avoid table overlap
const START_POS = { x: 48, y: 82 };   // bottom of vertical cobblestone path

// Road axes — calibrated to background.png T-junction layout
const FORK_Y   = 47;    // y% where vertical path meets horizontal bar
const LEFT_X   = 16;    // x% of left branch end (→ Aira's house)
const RIGHT_X  = 68;    // x% of right branch end (→ Diary house)
const CENTER_X = 46;    // x% of center vertical stem

// Diary position (top-right house)
const DIARY_POS = { x: 66, y: 26 };

// Multi-step walk paths — follow cobblestone roads
const WALK_PATHS = {
  // Gray: straight up the center path to tarot table
  gray: [
    { x: CENTER_X, y: GRAY_POS.y, dur: 750, face: -1 },
  ],
  // Aira: up center → left along horizontal bar → up to house
  aira: [
    { x: CENTER_X,       y: FORK_Y,            dur: 550, face: -1 },
    { x: LEFT_X,         y: FORK_Y,            dur: 600, face: -1 },
    { x: AIRA_POS.x + 2, y: AIRA_POS.y + 5,   dur: 400, face: -1 },
  ],
  // Diary: up center → right along horizontal bar → up to house
  diary: [
    { x: CENTER_X,    y: FORK_Y,            dur: 550, face: 1 },
    { x: RIGHT_X,     y: FORK_Y,            dur: 600, face: 1 },
    { x: DIARY_POS.x, y: DIARY_POS.y + 4,  dur: 400, face: 1 },
  ],
  // Home from center/table area: straight down
  home: [
    { x: CENTER_X,    y: START_POS.y,       dur: 750, face: 1 },
  ],
  // Home from Aira's area: retrace left branch → center → down
  homeFromAira: [
    { x: LEFT_X,      y: FORK_Y,            dur: 500, face: 1 },
    { x: CENTER_X,    y: FORK_Y,            dur: 600, face: 1 },
    { x: CENTER_X,    y: START_POS.y,       dur: 700, face: 1 },
  ],
  // Home from Diary: retrace right branch → center → down
  homeFromDiary: [
    { x: RIGHT_X,     y: FORK_Y,            dur: 400, face: -1 },
    { x: CENTER_X,    y: FORK_Y,            dur: 600, face: -1 },
    { x: CENTER_X,    y: START_POS.y,       dur: 700, face: 1 },
  ],
};

export default function SceneMap({ isNew, lastVisitAt, luaBalance, onNext }) {
  const [protagonistPos, setProtagonistPos] = useState(START_POS);
  const [protagonistDur, setProtagonistDur] = useState(0);
  const [facing, setFacing]     = useState(1);
  const [walking, setWalking]   = useState(false);
  const [destination, setDestination] = useState(null);
  const [dialogPhase, setDialogPhase] = useState('none'); // none|greet|offer|input
  const [chatLines, setChatLines]     = useState([]);
  const [lineIdx, setLineIdx]         = useState(0);
  const [question, setQuestion]       = useState('');
  const [inputError, setInputError]   = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [usesFree, setUsesFree]       = useState(false);
  const [oracleAvailable, setOracleAvailable] = useState(null);

  const inputRef    = useRef(null);
  const toastTimer  = useRef(null);
  const walkTimers  = useRef([]);   // stores all pending walk timeouts

  const questionPrompt    = useMemo(() => pickFrom(QUESTION_PROMPTS),    [destination]);
  const exampleQuestions  = useMemo(() => pickRandom3(ALL_EXAMPLE_QUESTIONS), [destination]);

  // On mount: check oracle availability + Gray auto-greets
  useEffect(() => {
    checkDailyOracle()
      .then(({ allowed }) => setOracleAvailable(allowed))
      .catch(() => setOracleAvailable(true));

    const t = setTimeout(() => {
      setFacing(1);
      openDialog('gray');
    }, 800);
    walkTimers.current.push(t);

    return () => {
      walkTimers.current.forEach(clearTimeout);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function clearWalkTimers() {
    walkTimers.current.forEach(clearTimeout);
    walkTimers.current = [];
  }

  function walkToDestination(dest, onArrival) {
    clearWalkTimers();
    let pathKey = dest;
    if (dest === 'home') {
      const px = protagonistPos.x, py = protagonistPos.y;
      if (px < 30 && py < 48) pathKey = 'homeFromAira';
      else if (px > 58 && py < 40) pathKey = 'homeFromDiary';
      else pathKey = 'home';
    }
    const steps = WALK_PATHS[pathKey];
    if (!steps) return;
    setWalking(true);

    let acc = 0;
    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        setProtagonistDur(step.dur);
        setProtagonistPos({ x: step.x, y: step.y });
        setFacing(step.face);
        if (i === steps.length - 1) {
          const t2 = setTimeout(() => {
            setWalking(false);
            onArrival?.();
          }, step.dur + 80);
          walkTimers.current.push(t2);
        }
      }, acc);
      walkTimers.current.push(t);
      acc += step.dur;
    });
  }

  function openDialog(dest) {
    setDestination(dest);
    const lines = buildGreeting(dest, isNew);
    setChatLines(lines);
    setLineIdx(0);
    setDialogPhase('greet');
  }

  function handleClose() {
    setDialogPhase('none');
    setDestination(null);
    setQuestion('');
    setInputError('');
    setWalking(false);
    clearWalkTimers();
  }

  function handleAiraClick() {
    if (walking || dialogPhase !== 'none') return;
    walkToDestination('aira', () => openDialog('aira'));
  }

  function handleGrayClick() {
    if (walking || dialogPhase !== 'none') return;
    walkToDestination('gray', () => openDialog('gray'));
  }

  function handleDiaryClick() {
    if (walking || dialogPhase !== 'none') return;
    walkToDestination('diary', () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToastMessage('일기장은 준비 중이야. 곧 만나자.');
      toastTimer.current = setTimeout(() => {
        setToastMessage('');
        toastTimer.current = null;
      }, 2200);
    });
  }

  function handleHomeClick() {
    if (walking || dialogPhase !== 'none') return;
    walkToDestination('home', () => {
      setDestination(null);
      setDialogPhase('none');
    });
  }

  function handleBubbleDone() {
    if (lineIdx < chatLines.length - 1) {
      setTimeout(() => setLineIdx(l => l + 1), 450);
    } else {
      if (destination === 'gray') {
        setTimeout(() => setDialogPhase('offer'), 350);
      } else {
        setTimeout(() => setDialogPhase('input'), 350);
      }
    }
  }

  function handleOfferYes() {
    const free = oracleAvailable === true;
    setUsesFree(free);
    if (free) useOracleToday().catch(() => {});
    setDialogPhase('input');
  }

  function handleSubmit() {
    if (question.trim().length < 2) { setInputError('2자 이상 입력해줘!'); return; }
    setInputError('');
    setDialogPhase('none');
    onNext?.({ destination, question: question.trim(), useFree: usesFree });
  }

  function timeUntilKSTMidnight() {
    const kstMs = Date.now() + 9 * 3600000;
    const msLeft = 24 * 3600000 - (kstMs % (24 * 3600000));
    const h = Math.floor(msLeft / 3600000);
    const m = Math.floor((msLeft % 3600000) / 60000);
    return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
  }

  const isDialogOpen = dialogPhase !== 'none';
  const F = "'Press Start 2P'";

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* ══════ MAP AREA ══════ */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

        {/* Toast message */}
        {toastMessage && (
          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            fontFamily: F, fontSize: '8px', color: '#c5a3f5',
            background: 'rgba(20,8,40,0.9)', padding: '6px 14px',
            border: '1px solid #4a2070', borderRadius: 4,
            zIndex: 20, animation: 'panelSlideUp 0.2s ease',
          }}>{toastMessage}</div>
        )}

        {/* ── Background image (background.png) ── */}
        <MapBackground />

        {/* ── Animated stars over sky ── */}
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${s.y}%`, left: `${s.x}%`,
            width: s.sz, height: s.sz, background: '#fff', borderRadius: '50%',
            opacity: s.op, animation: `starTwinkle ${s.dur}s ease-in-out infinite ${s.del}s`,
            zIndex: 1, pointerEvents: 'none',
          }} />
        ))}

        {/* ── Ambient magic particles (z:3) ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {FX_PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${p.y}%`, left: `${p.x}%`,
              width: p.sz, height: p.sz,
              background: p.c, borderRadius: '50%', opacity: p.op,
              animation: `fxDrift ${p.dur}s ease-in-out infinite ${p.del}s`,
              boxShadow: `0 0 ${p.sz * 2}px ${p.c}`,
            }} />
          ))}
        </div>

        {/* Home click overlay — return to start */}
        <div
          onClick={handleHomeClick}
          title="출발지 (루나가 있어)"
          style={{
            position: 'absolute', bottom: '12%', left: '32%', width: '36%', height: '22%',
            cursor: !walking && dialogPhase === 'none' ? 'pointer' : 'default',
            zIndex: 5,
          }}
        />

        {/* Diary click overlay */}
        <div
          onClick={handleDiaryClick}
          title="일기장 (준비 중)"
          style={{
            position: 'absolute', top: '2%', left: '68%', width: '26%', height: '26%',
            cursor: !walking && dialogPhase === 'none' ? 'pointer' : 'default',
            zIndex: 6,
          }}
        />

        {/* ── Aira character (clickable) ── */}
        <div
          onClick={handleAiraClick}
          title="아이라 (유료 딥 리딩)"
          style={{
            position: 'absolute', top: `${AIRA_POS.y}%`, left: `${AIRA_POS.x}%`,
            transform: 'scale(2.8) scaleX(-1)', transformOrigin: 'bottom center',
            imageRendering: 'pixelated',
            cursor: !walking && dialogPhase === 'none' ? 'pointer' : 'default',
            animation: 'airaIdle 1.4s ease-in-out infinite',
            filter: destination === 'aira'
              ? 'drop-shadow(0 0 6px rgba(197,163,245,0.95))'
              : 'drop-shadow(0 0 3px rgba(107,45,139,0.45))',
            transition: 'filter 0.3s', zIndex: 5,
          }}
        >
          <ChibiWitchSprite />
        </div>

        {/* Aira label — sprite is 44px × 2.8 scale */}
        <div style={{
          position: 'absolute', top: `calc(${AIRA_POS.y}% + 38px)`, left: `${AIRA_POS.x - 2}%`,
          fontFamily: F, fontSize: '7px', color: '#c5a3f5',
          textAlign: 'center', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5,
        }}>
          아이라
          <div style={{ fontSize: '5px', color: '#7a5a9a', marginTop: 1 }}>
            ♦ 루나{luaBalance !== null && (
              <span style={{ color: luaBalance > 0 ? '#ffd700' : '#c08080' }}> ({luaBalance})</span>
            )}
          </div>
        </div>

        {/* Aira click hint */}
        {!isDialogOpen && !walking && (
          <div style={{
            position: 'absolute',
            top: `calc(${AIRA_POS.y}% + 52px)`, left: `${AIRA_POS.x}%`,
            fontFamily: F, fontSize: '5px', color: '#5a2d7a',
            animation: 'hintBounce 0.9s ease-in-out infinite alternate',
            pointerEvents: 'none', zIndex: 5,
          }}>클릭</div>
        )}

        {/* ── Gray character (clickable) ── */}
        <div
          onClick={handleGrayClick}
          title="그레이 (무료 오늘의 점괘)"
          style={{
            position: 'absolute', top: `${GRAY_POS.y}%`, left: `${GRAY_POS.x}%`,
            transform: 'scale(3.5)', transformOrigin: 'bottom center',
            imageRendering: 'pixelated',
            cursor: !walking && dialogPhase === 'none' ? 'pointer' : 'default',
            filter: destination === 'gray'
              ? 'drop-shadow(0 0 6px rgba(90,138,170,0.95))'
              : 'drop-shadow(0 0 3px rgba(58,90,110,0.45))',
            transition: 'filter 0.3s', zIndex: 5,
          }}
        >
          <ChibiGraySprite />
        </div>

        {/* Gray label — sprite is 34px × 2.8 scale */}
        <div style={{
          position: 'absolute', top: `calc(${GRAY_POS.y}% + 32px)`, left: `${GRAY_POS.x - 2}%`,
          fontFamily: F, fontSize: '7px', color: '#8aaabb',
          textAlign: 'center', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5,
        }}>
          그레이
          <div style={{ fontSize: '5px', color: '#4a7a8a', marginTop: 1 }}>무료 · 하루 1회</div>
        </div>

        {/* Vignette — focus center, atmospheric edge darkening */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 55%, transparent 30%, rgba(0,0,0,0.72) 100%)',
          zIndex: 14,
        }} />

        {/* ── Protagonist ── */}
        <div style={{
          position: 'absolute',
          top: `${protagonistPos.y}%`, left: `${protagonistPos.x}%`,
          transform: `scale(3.5) scaleX(${facing})`, transformOrigin: 'bottom center',
          imageRendering: 'pixelated',
          transition: walking
            ? `top ${protagonistDur}ms linear, left ${protagonistDur}ms linear`
            : 'none',
          zIndex: 6,
        }}>
          <ChibiChildSprite walking={walking} />
        </div>
      </div>

      {/* ══════ VN DIALOG PANEL — absolute overlay ══════ */}
      {isDialogOpen && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          zIndex: 20,
          background: destination === 'gray'
            ? 'linear-gradient(180deg, rgba(8,14,26,0.99) 0%, rgba(3,6,16,0.99) 100%)'
            : 'linear-gradient(180deg, rgba(10,4,24,0.99) 0%, rgba(4,1,14,0.99) 100%)',
          borderTop: destination === 'gray'
            ? '2px solid rgba(90,138,170,0.65)'
            : '2px solid rgba(155,79,196,0.65)',
          boxShadow: destination === 'gray'
            ? 'inset 0 1px 0 rgba(90,138,170,0.12), 0 -6px 24px rgba(0,0,0,0.85)'
            : 'inset 0 1px 0 rgba(155,79,196,0.12), 0 -6px 24px rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column',
          animation: 'panelSlideUp 0.3s ease',
          overflow: 'hidden',
        }}>
          {/* Name bar */}
          <div style={{
            padding: '8px 14px',
            background: destination === 'gray' ? 'rgba(22,34,52,0.95)' : 'rgba(22,8,50,0.95)',
            borderBottom: `1px solid ${destination === 'gray' ? 'rgba(90,138,170,0.35)' : 'rgba(107,45,139,0.35)'}`,
            fontFamily: F, fontSize: '10px',
            color: destination === 'gray' ? '#8aaabb' : '#c5a3f5',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 9, height: 9, borderRadius: '50%',
              background: destination === 'gray' ? '#5a8aaa' : '#9b4fc4',
              boxShadow: destination === 'gray' ? '0 0 5px rgba(90,138,170,0.6)' : '0 0 5px rgba(155,79,196,0.6)',
              display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{ flex: 1 }}>{destination === 'gray' ? '그레이' : '아이라'}</span>
            <button onClick={handleClose} style={{
              fontFamily: F, fontSize: '9px',
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
              padding: '2px 5px', lineHeight: 1,
            }}>✕</button>
          </div>

          {/* Portrait + content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
            {/* Portrait — overflow:hidden crops to head+chest */}
            <div style={{
              width: 76, flexShrink: 0,
              overflow: 'hidden',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 6,
              borderRight: '1px solid rgba(107,45,139,0.15)',
              background: destination === 'gray' ? 'rgba(14,22,36,0.7)' : 'rgba(10,4,26,0.7)',
            }}>
              <div style={{
                transform: destination === 'gray' ? 'scale(3.4)' : 'scale(3.4) scaleX(-1)',
                transformOrigin: 'top center', imageRendering: 'pixelated',
                flexShrink: 0,
              }}>
                {destination === 'gray' ? <GraySprite /> : <WitchSprite />}
              </div>
            </div>

            {/* Dialog content */}
            <div style={{
              flex: 1, padding: '12px 16px',
              display: 'flex', flexDirection: 'column',
              justifyContent: dialogPhase === 'input' ? 'flex-start' : 'center',
              overflow: 'hidden', gap: 0,
            }}>

              {/* GREET */}
              {dialogPhase === 'greet' && lineIdx < chatLines.length && (
                <ChatBubble
                  key={lineIdx}
                  text={chatLines[lineIdx]}
                  speaker="witch"
                  onDone={handleBubbleDone}
                  style={{ fontSize: '13px', maxWidth: '100%', padding: '12px 16px' }}
                />
              )}

              {/* OFFER (Gray only) */}
              {dialogPhase === 'offer' && destination === 'gray' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontFamily: F, fontSize: '13px', color: '#c0dcea', lineHeight: 1.8 }}>
                    나랑 오늘의 점괘 볼래?
                  </div>
                  <div style={{ fontFamily: F, fontSize: '10px', lineHeight: 1.8 }}>
                    {oracleAvailable === null
                      ? <span style={{ color: '#444' }}>확인 중…</span>
                      : oracleAvailable
                      ? <span style={{ color: '#7ab0c8' }}>
                          <span style={{ textDecoration: 'line-through', color: '#3a5a6a', marginRight: 7 }}>♦ 1루나</span>
                          1일 1회 무료
                        </span>
                      : <span style={{ color: '#c8a050' }}>♦ 1루나</span>
                    }
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      className="pixel-btn"
                      onClick={handleOfferYes}
                      disabled={oracleAvailable === null}
                      style={{
                        fontSize: '11px', padding: '9px 16px',
                        display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
                        opacity: oracleAvailable === null ? 0.45 : 1,
                      }}
                    >
                      <span>응</span>
                      {oracleAvailable !== null && (
                        <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', fontFamily: F, whiteSpace: 'nowrap' }}>
                          {oracleAvailable
                            ? '무료로 오늘의 점괘 보기'
                            : `1루나 사용 · 다음 무료 ${timeUntilKSTMidnight()} 후`}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      style={{
                        fontFamily: F, fontSize: '11px',
                        padding: '9px 16px',
                        background: 'rgba(50,30,70,0.25)', border: '1px solid #3a2060',
                        color: '#8a6a9a', cursor: 'pointer',
                      }}
                    >아니</button>
                  </div>
                </div>
              )}

              {/* INPUT */}
              {dialogPhase === 'input' && (
                <>
                  {destination === 'gray' && (
                    <div style={{ fontFamily: F, fontSize: '9px', color: usesFree ? '#7ab0c8' : '#c8a050', lineHeight: 1.9, marginBottom: 8 }}>
                      {usesFree ? '✓ 무료 · 오늘의 점괘' : `♦ 1루나 사용 · 다음 무료 ${timeUntilKSTMidnight()} 후`}
                    </div>
                  )}
                  <div style={{ fontFamily: F, fontSize: '11px', color: 'rgba(220,200,255,0.88)', lineHeight: 1.9, marginBottom: 10 }}>
                    {questionPrompt}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                    {exampleQuestions.map((eq, i) => (
                      <button key={i}
                        onClick={() => { setQuestion(eq); setInputError(''); inputRef.current?.focus(); }}
                        style={{
                          fontFamily: F, fontSize: '8px',
                          background: question === eq ? 'rgba(107,45,139,0.3)' : 'rgba(107,45,139,0.1)',
                          border: `1px solid ${question === eq ? '#6b2d8b' : '#3a1a5a'}`,
                          color: question === eq ? '#d4b8f0' : '#7a5a9a',
                          padding: '4px 8px', cursor: 'pointer', lineHeight: 1.7,
                        }}>
                        {eq}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 7 }}>
                    <textarea
                      ref={inputRef} maxLength={100} value={question} autoFocus rows={2}
                      onChange={e => { setQuestion(e.target.value); setInputError(''); }}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                      placeholder="여기에 입력..."
                      className="input-typing"
                      style={{
                        flex: 1, fontSize: '14px',
                        background: 'rgba(16,5,32,0.9)', border: '1px solid #5a2a7a',
                        color: '#f0e6ff', padding: '8px 10px', resize: 'none',
                        lineHeight: 1.8, outline: 'none',
                      }} />
                    <button className="pixel-btn" onClick={handleSubmit}
                      style={{ fontSize: '13px', padding: '6px 14px', alignSelf: 'flex-end' }}>▶</button>
                  </div>
                  {inputError && (
                    <div style={{ fontFamily: F, fontSize: '8px', color: '#c84040', marginTop: 5 }}>{inputError}</div>
                  )}
                  <div style={{ fontFamily: F, fontSize: '7px', color: '#3a2850', marginTop: 4, textAlign: 'right' }}>
                    {question.length}/100
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes airaIdle {
          0%, 100% { transform: scale(2.8) scaleX(-1) translateY(0px); }
          50%       { transform: scale(2.8) scaleX(-1) translateY(-3px); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 0.15; }
        }
        @keyframes panelSlideUp {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes hintBounce {
          from { transform: translateY(0);    }
          to   { transform: translateY(-5px); }
        }
        @keyframes fxDrift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-8px) translateX(3px); }
          66%       { transform: translateY(-4px) translateX(-3px); }
        }
      `}</style>
    </div>
  );
}

// ── Map Background (background.png) ────────────────────────────────────────────
function MapBackground() {
  return (
    <img
      src="/intro/background.png"
      alt=""
      style={{
        position: 'absolute', inset: 0, zIndex: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: 'center center',
        imageRendering: 'pixelated',
        display: 'block',
      }}
    />
  );
}

// ── Village SVG (legacy — kept for reference, not rendered) ───────────────────
function VillageSVG_DEPRECATED() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    >
      <defs>
        <linearGradient id="vSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#01000d" />
          <stop offset="55%"  stopColor="#060118" />
          <stop offset="100%" stopColor="#060e05" />
        </linearGradient>
        <linearGradient id="vDepth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.55" />
          <stop offset="50%"  stopColor="#000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#121c0c" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="vMoonHalo" cx="50%" cy="9%" r="18%">
          <stop offset="0%"   stopColor="#ddc8ff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ddc8ff" stopOpacity="0"   />
        </radialGradient>
        <radialGradient id="vWinGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#e0b8ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6020a8" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id="vLampGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#ffe878" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ff8800" stopOpacity="0"   />
        </radialGradient>
        <radialGradient id="vCandleGlow" cx="50%" cy="20%" r="55%">
          <stop offset="0%"   stopColor="#ffe060" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ff8000" stopOpacity="0"   />
        </radialGradient>
        <radialGradient id="vCrystalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c080ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6010a0" stopOpacity="0"   />
        </radialGradient>
      </defs>

      {/* ── SKY ── */}
      <rect x="0" y="0" width="100" height="100" fill="url(#vSky)" />

      {/* ── MOON ── */}
      <circle cx="50" cy="9" r="13" fill="url(#vMoonHalo)" />
      <circle cx="50" cy="9" r="4.2" fill="#ede0fa" opacity="0.9" />
      <circle cx="52.4" cy="8.1" r="3.1" fill="#060118" />

      {/* ── Static stars (animated ones rendered as React divs) ── */}
      <circle cx="12"  cy="4"  r="0.45" fill="#fff"     opacity="0.50" />
      <circle cx="26"  cy="2"  r="0.35" fill="#fff"     opacity="0.40" />
      <circle cx="39"  cy="5"  r="0.40" fill="#c5a3f5"  opacity="0.45" />
      <circle cx="57"  cy="2"  r="0.35" fill="#fff"     opacity="0.45" />
      <circle cx="71"  cy="4"  r="0.45" fill="#c5a3f5"  opacity="0.42" />
      <circle cx="83"  cy="3"  r="0.35" fill="#fff"     opacity="0.48" />
      <circle cx="91"  cy="6"  r="0.40" fill="#fff"     opacity="0.38" />
      <circle cx="6"   cy="7"  r="0.35" fill="#a0c8e8"  opacity="0.35" />
      <circle cx="96"  cy="5"  r="0.35" fill="#a0c8e8"  opacity="0.38" />

      {/* ── GROUND ── */}
      <rect x="0" y="20" width="100" height="80" fill="#0b1609" />
      <rect x="4" y="27" width="92" height="65" fill="#0e1c0c" rx="3" />

      {/* ── STONE PATHS ── */}
      {/* Center vertical path */}
      <rect x="40" y="36" width="8" height="64" fill="#524e7a" rx="1" />
      <rect x="41" y="36" width="2" height="64" fill="#7874a4" opacity="0.32" />
      {/* Cobblestone seams */}
      {[41,46,51,56,61,66,71,76,81,86,91,96].map(y => (
        <line key={y} x1="40" y1={y} x2="48" y2={y} stroke="#3a366a" strokeWidth="0.35" />
      ))}

      {/* Horizontal fork */}
      <rect x="10" y="33" width="80" height="6" fill="#524e7a" rx="1" />
      <rect x="10" y="33" width="80" height="1.5" fill="#7874a4" opacity="0.28" />
      {[17,24,31,38,45,52,59,66,73,80].map(x => (
        <line key={x} x1={x} y1="33" x2={x} y2="39" stroke="#3a366a" strokeWidth="0.35" />
      ))}

      {/* Left branch → Aira */}
      <rect x="13" y="8"  width="6" height="27" fill="#524e7a" rx="1" />
      <rect x="14" y="8"  width="2" height="27" fill="#7874a4" opacity="0.28" />
      {[13,18,23,28].map(y => (
        <line key={y} x1="13" y1={y} x2="19" y2={y} stroke="#3a366a" strokeWidth="0.35" />
      ))}

      {/* Right branch → Diary */}
      <rect x="69" y="8"  width="6" height="27" fill="#524e7a" rx="1" />
      <rect x="70" y="8"  width="2" height="27" fill="#7874a4" opacity="0.28" />
      {[13,18,23,28].map(y => (
        <line key={y} x1="69" y1={y} x2="75" y2={y} stroke="#3a366a" strokeWidth="0.35" />
      ))}

      {/* ── AIRA'S COTTAGE (top-left, x:2-23, y:2-33) ── */}
      {/* Drop shadow */}
      <rect x="3" y="28" width="22" height="3" fill="#030012" opacity="0.65" rx="1" />
      {/* Foundation */}
      <rect x="3"  y="26" width="21" height="3" fill="#1c1548" stroke="#3a2298" strokeWidth="0.4" rx="0.5" />
      {/* Main wall */}
      <rect x="4"  y="12" width="19" height="15" fill="#161238" stroke="#4a30a8" strokeWidth="0.5" rx="0.5" />
      {/* Siding lines */}
      {[15.5, 19, 22.5].map(y => (
        <line key={y} x1="4" y1={y} x2="23" y2={y} stroke="#241856" strokeWidth="0.3" />
      ))}
      {/* Chimney */}
      <rect x="9" y="4" width="3.5" height="8" fill="#0c0a22" stroke="#281860" strokeWidth="0.3" />
      <rect x="8.5" y="3.5" width="4.5" height="1.5" fill="#1a1438" stroke="#3a2480" strokeWidth="0.3" />
      {/* Smoke puffs */}
      <circle cx="11" cy="2.5" r="1.1" fill="#1c1830" opacity="0.55" />
      <circle cx="12.5" cy="1.5" r="0.85" fill="#1c1830" opacity="0.38" />
      <circle cx="10"   cy="1.2" r="0.7"  fill="#1c1830" opacity="0.28" />
      {/* Main roof */}
      <polygon points="2,12 13.5,2.5 25,12" fill="#0a0820" stroke="#3a1a70" strokeWidth="0.4" />
      {/* Roof ridge */}
      <polygon points="8,11.8 13.5,7 19,11.8" fill="#080618" />
      {/* Glowing window — large */}
      <rect x="6"  y="15" width="7.5" height="6" fill="url(#vWinGlow)" stroke="#c080f8" strokeWidth="0.5" rx="0.4" />
      <line x1="9.75" y1="15" x2="9.75" y2="21"   stroke="#6828a0" strokeWidth="0.3" />
      <line x1="6"    y1="18" x2="13.5" y2="18"   stroke="#6828a0" strokeWidth="0.3" />
      {/* Small side window */}
      <rect x="16" y="15" width="4"   height="3.5" fill="#1e1440" stroke="#4a2880" strokeWidth="0.3" rx="0.3" />
      {/* Door */}
      <rect x="15.5" y="20" width="5" height="6.5" fill="#09061e" stroke="#3a1a60" strokeWidth="0.3" rx="0.4" />
      <circle cx="19.5" cy="23.5" r="0.5" fill="#c8a030" />
      {/* Crystal pillars */}
      <polygon points="3.8,27 5.2,23 6.6,27" fill="#b060e8" opacity="0.75" />
      <circle cx="5.2" cy="23" r="1.2" fill="url(#vCrystalGlow)" />
      <polygon points="19.4,27 20.8,23 22.2,27" fill="#b060e8" opacity="0.75" />
      <circle cx="20.8" cy="23" r="1.2" fill="url(#vCrystalGlow)" />
      {/* Sign */}
      <rect x="4" y="28.5" width="13" height="3" fill="#0a0620" stroke="#38186a" strokeWidth="0.3" rx="0.4" />

      {/* ── DIARY BUILDING (top-right, x:68-92, y:2-28) ── */}
      {/* Drop shadow */}
      <rect x="68" y="25" width="22" height="3" fill="#030012" opacity="0.65" rx="1" />
      {/* Foundation */}
      <rect x="69" y="23" width="20" height="3" fill="#100c28" stroke="#301870" strokeWidth="0.3" rx="0.5" />
      {/* Wall */}
      <rect x="70" y="9"  width="18" height="15" fill="#14102e" stroke="#302070" strokeWidth="0.5" rx="0.5" />
      {/* Wall siding */}
      {[12.5, 16, 19.5].map(y => (
        <line key={y} x1="70" y1={y} x2="88" y2={y} stroke="#1e1848" strokeWidth="0.3" />
      ))}
      {/* Roof */}
      <polygon points="67,9 79,1.5 91,9" fill="#09061e" stroke="#2a1860" strokeWidth="0.4" />
      {/* Small dormers */}
      <polygon points="72,8.8 75,5.5 78,8.8" fill="#0a0720" stroke="#241460" strokeWidth="0.3" />
      <polygon points="80,8.8 83,5.5 86,8.8" fill="#0a0720" stroke="#241460" strokeWidth="0.3" />
      {/* Padlock body */}
      <circle cx="79" cy="15" r="2.8" fill="#1c1638" stroke="#48388a" strokeWidth="0.45" />
      <rect   x="77" y="15" width="4"   height="3.2" fill="#1c1638" stroke="#48388a" strokeWidth="0.45" rx="0.4" />
      {/* Lock shackle */}
      <path d="M77.8,15 Q77.8,12.5 79,12.5 Q80.2,12.5 80.2,15" fill="none" stroke="#48388a" strokeWidth="0.5" />
      {/* Keyhole */}
      <circle cx="79" cy="15.8" r="0.8" fill="#362870" />
      <rect   x="78.6" y="16.6" width="0.8" height="1.1" fill="#362870" />
      {/* Small windows */}
      <rect x="71" y="11" width="4" height="3.2" fill="#1e1440" stroke="#4030888" strokeWidth="0.3" rx="0.3" />
      <rect x="83" y="11" width="4" height="3.2" fill="#1e1440" stroke="#403088" strokeWidth="0.3" rx="0.3" />
      {/* Foundation line */}
      <rect x="69" y="23" width="20" height="0.6" fill="#483888" opacity="0.6" />

      {/* ── GRAY'S ZONE — stone floor, table, candle ── */}
      {/* Stone floor */}
      <rect x="26" y="40" width="30" height="24" fill="#1c1836" rx="2" />
      {/* Floor tile grid */}
      {[30,34,38,42,46,50].map(y => (
        <line key={y} x1="26" y1={y} x2="56" y2={y} stroke="#28244a" strokeWidth="0.4" />
      ))}
      {[30,34,38,42,46,50,54].map(x => (
        <line key={x} x1={x} y1="40" x2={x} y2="64" stroke="#28244a" strokeWidth="0.4" />
      ))}
      {/* Alternate tile shading */}
      {[[26,40],[34,40],[42,40],[50,40],[30,44],[38,44],[46,44],[54,44],
        [26,48],[34,48],[42,48],[50,48],[30,52],[38,52],[46,52],[54,52],
        [26,56],[34,56],[42,56],[50,56],[30,60],[38,60],[46,60],[54,60],
      ].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill={i%2===0 ? '#252148' : '#111030'} opacity="0.55" />
      ))}
      {/* Table */}
      <rect x="28" y="50" width="17" height="3.5" fill="#7a4018" stroke="#5a3010" strokeWidth="0.4" rx="0.5" />
      <rect x="29.5" y="53.5" width="1.8" height="4" fill="#4a2c10" />
      <rect x="42"   y="53.5" width="1.8" height="4" fill="#4a2c10" />
      {/* Tarot cards on table */}
      <rect x="30" y="46.8" width="5" height="6.5" fill="#2a1a4a" stroke="#c8a030" strokeWidth="0.45" rx="0.4" />
      <text x="32.5" y="50.5" textAnchor="middle" fontSize="2.8" fill="#c8a030" opacity="0.85">✦</text>
      <rect x="36.5" y="47.5" width="4.5" height="5.5" fill="#2a1a4a" stroke="#c8a030" strokeWidth="0.45" rx="0.4" transform="rotate(8,38.75,50.25)" />
      {/* Candle */}
      <rect x="45.5" y="49" width="2" height="3.5" fill="#ece0b8" rx="0.4" />
      <ellipse cx="46.5" cy="48.5" rx="1" ry="1.5" fill="#ffe060" opacity="0.9" />
      <ellipse cx="46.5" cy="48.5" rx="0.5" ry="0.6" fill="#fff" opacity="0.7" />
      <circle  cx="46.5" cy="48.5" r="3.5"   fill="url(#vCandleGlow)" />
      {/* Lamp post on left edge of zone */}
      <rect x="27" y="37" width="1.4" height="11" fill="#201c38" />
      <rect x="25.5" y="36.5" width="4" height="3" fill="rgba(255,220,80,0.6)" stroke="#6a5020" strokeWidth="0.35" rx="0.5" />
      <circle cx="27.7" cy="37" r="4.5" fill="url(#vLampGlow)" />

      {/* ── STARTING AREA (bottom center) ── */}
      {/* Entry stones */}
      <rect x="38" y="74" width="14" height="4.5" fill="#2a2848" stroke="#3e3a68" strokeWidth="0.4" rx="1.2" />
      <rect x="40" y="77" width="10" height="3.5" fill="#323058" stroke="#4a4670" strokeWidth="0.4" rx="1" />
      {/* Lantern at start */}
      <rect x="35" y="74" width="1.2" height="8" fill="#201c38" />
      <rect x="34" y="73.5" width="3.2" height="2.5" fill="rgba(255,220,80,0.55)" stroke="#6a5020" strokeWidth="0.3" rx="0.4" />
      <circle cx="35.6" cy="73.5" r="3.5" fill="url(#vLampGlow)" />
      {/* Flowers left */}
      <circle cx="32"  cy="74.5" r="1.6" fill="#8a4a6a" />
      <circle cx="30"  cy="76.5" r="1.2" fill="#7a3858" />
      <circle cx="34"  cy="77.5" r="1.3" fill="#6a5a9a" />
      <circle cx="29.5" cy="78.5" r="0.9" fill="#8a4a6a" opacity="0.7" />
      {/* Flower stems */}
      <line x1="32" y1="76" x2="32" y2="78" stroke="#1a3010" strokeWidth="0.5" />
      <line x1="30" y1="77.5" x2="30" y2="79" stroke="#1a3010" strokeWidth="0.5" />
      {/* Flowers right */}
      <circle cx="58"  cy="74.5" r="1.6" fill="#6a5a9a" />
      <circle cx="60"  cy="76.5" r="1.2" fill="#7a6aaa" />
      <circle cx="56"  cy="77.5" r="1.3" fill="#8a4a6a" />
      <circle cx="60.5" cy="78.5" r="0.9" fill="#6a5a9a" opacity="0.7" />
      <line x1="58" y1="76" x2="58" y2="78" stroke="#1a3010" strokeWidth="0.5" />
      <line x1="60" y1="77.5" x2="60" y2="79" stroke="#1a3010" strokeWidth="0.5" />
      {/* Grass tufts near entrance */}
      {[[33,80],[35,81.5],[37,80.5],[55,80],[57,81.5],[59,80.5]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.1" ry="0.7" fill="#1c3414" opacity="0.85" />
      ))}

      {/* ── BORDER TREES (left edge) ── */}
      {[
        [1, 12, 1.2], [0, 26, 1.0], [1, 42, 1.1],
        [0, 58, 1.0], [1, 74, 1.2],
      ].map(([x, y, s], i) => (
        <g key={i}>
          <rect x={x + 2} y={y + 4} width={3.5 * s} height={5.5 * s} fill="#07100a" />
          <ellipse cx={x + 4} cy={y}     rx={5.8 * s} ry={5.2 * s} fill="#0a1608" />
          <ellipse cx={x + 4} cy={y}     rx={4.5 * s} ry={4.0 * s} fill="#0d1e0c" opacity="0.7" />
          <ellipse cx={x + 5} cy={y - 1} rx={2.5 * s} ry={2.0 * s} fill="#142a12" opacity="0.45" />
        </g>
      ))}

      {/* ── BORDER TREES (right edge) ── */}
      {[
        [91, 12, 1.2], [92, 26, 1.0], [91, 42, 1.1],
        [92, 58, 1.0], [91, 74, 1.2],
      ].map(([x, y, s], i) => (
        <g key={i}>
          <rect x={x + 2} y={y + 4} width={3.5 * s} height={5.5 * s} fill="#07100a" />
          <ellipse cx={x + 4} cy={y}     rx={5.8 * s} ry={5.2 * s} fill="#0a1608" />
          <ellipse cx={x + 4} cy={y}     rx={4.5 * s} ry={4.0 * s} fill="#0d1e0c" opacity="0.7" />
          <ellipse cx={x + 3} cy={y - 1} rx={2.5 * s} ry={2.0 * s} fill="#142a12" opacity="0.45" />
        </g>
      ))}

      {/* ── CORNER + TOP TREES ── */}
      <ellipse cx="2"  cy="22" rx="4.5" ry="3.5" fill="#091408" />
      <ellipse cx="98" cy="22" rx="4.5" ry="3.5" fill="#091408" />
      {/* Center top tree (between Aira and Diary) */}
      <rect x="44.5" y="24" width="3" height="6" fill="#07100a" />
      <ellipse cx="46"  cy="22" rx="5.5" ry="4.5" fill="#0a1608" />
      <ellipse cx="46"  cy="21" rx="3.5" ry="3.0" fill="#0e1e0c" opacity="0.6" />

      {/* ── DEPTH GRADIENT overlay ── */}
      <rect x="0" y="0" width="100" height="100" fill="url(#vDepth)" />
    </svg>
  );
}

const STARS = [
  { x: 8,  y: 1, sz: 2, op: 0.7,  dur: 2.1, del: 0   },
  { x: 22, y: 1, sz: 1, op: 0.5,  dur: 1.8, del: 0.3 },
  { x: 35, y: 3, sz: 2, op: 0.6,  dur: 2.5, del: 0.7 },
  { x: 50, y: 1, sz: 1, op: 0.4,  dur: 1.6, del: 0.1 },
  { x: 63, y: 2, sz: 2, op: 0.65, dur: 2.2, del: 0.5 },
  { x: 78, y: 1, sz: 1, op: 0.55, dur: 1.9, del: 0.9 },
  { x: 88, y: 4, sz: 2, op: 0.6,  dur: 2.0, del: 0.4 },
  { x: 14, y: 5, sz: 1, op: 0.45, dur: 2.3, del: 0.6 },
  { x: 72, y: 5, sz: 1, op: 0.5,  dur: 1.7, del: 0.2 },
  { x: 92, y: 7, sz: 2, op: 0.55, dur: 2.4, del: 0.8 },
];

const FX_PARTICLES = [
  { x: 8,  y: 30, sz: 3, c: '#c5a3f5', op: 0.4,  dur: 4.2, del: 0.0 },
  { x: 18, y: 20, sz: 2, c: '#9b4fc4', op: 0.35, dur: 3.8, del: 0.7 },
  { x: 25, y: 45, sz: 2, c: '#7ab0c8', op: 0.3,  dur: 5.1, del: 1.2 },
  { x: 35, y: 35, sz: 3, c: '#c5a3f5', op: 0.35, dur: 4.6, del: 0.4 },
  { x: 45, y: 55, sz: 2, c: '#c8a030', op: 0.3,  dur: 3.5, del: 0.9 },
  { x: 52, y: 25, sz: 2, c: '#9b4fc4', op: 0.4,  dur: 4.9, del: 1.5 },
  { x: 62, y: 40, sz: 3, c: '#7ab0c8', op: 0.3,  dur: 4.0, del: 0.3 },
  { x: 70, y: 15, sz: 2, c: '#c5a3f5', op: 0.35, dur: 3.7, del: 1.0 },
  { x: 80, y: 30, sz: 2, c: '#c8a030', op: 0.25, dur: 5.3, del: 0.6 },
  { x: 88, y: 50, sz: 3, c: '#9b4fc4', op: 0.3,  dur: 4.4, del: 1.8 },
];
