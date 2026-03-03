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
// Character positions (% of map area) — spread apart to avoid overlap
const AIRA_POS  = { x: 14, y: 14 };   // top-left, in front of house
const GRAY_POS  = { x: 38, y: 46 };   // center — on main path, away from Aira
const START_POS = { x: 42, y: 78 };   // bottom-center, in starting area

// Road axes — clearer path layout
const FORK_Y   = 35;    // y% of horizontal fork road
const LEFT_X   = 16;    // x% of left fork road (→ Aira)
const RIGHT_X  = 72;    // x% of right fork road (→ Diary)
const CENTER_X = 42;    // x% of center vertical road

// Diary position (top-right)
const DIARY_POS = { x: 70, y: 16 };

// Multi-step walk paths — all 4 destinations reachable
const WALK_PATHS = {
  gray: [
    { x: 42, y: 48, dur: 700, face: -1 },
  ],
  aira: [
    { x: CENTER_X,      y: FORK_Y,            dur: 500, face: -1 },
    { x: LEFT_X,        y: FORK_Y,            dur: 550, face: -1 },
    { x: LEFT_X + 7,    y: AIRA_POS.y + 6,    dur: 350, face: -1 },
  ],
  diary: [
    { x: CENTER_X, y: FORK_Y,            dur: 500, face: 1 },
    { x: RIGHT_X,  y: FORK_Y,            dur: 550, face: 1 },
    { x: RIGHT_X,  y: DIARY_POS.y + 2,   dur: 400, face: 1 },
  ],
  home: [
    { x: CENTER_X, y: 55,                dur: 500, face: 1 },
    { x: START_POS.x, y: 68,            dur: 450, face: 1 },
    { x: START_POS.x, y: START_POS.y,    dur: 400, face: 1 },
  ],
  homeFromAira: [
    { x: LEFT_X + 7,    y: FORK_Y,        dur: 500, face: 1 },
    { x: CENTER_X,      y: FORK_Y,        dur: 550, face: 1 },
    { x: CENTER_X,      y: 55,            dur: 500, face: 1 },
    { x: START_POS.x,   y: START_POS.y,   dur: 500, face: 1 },
  ],
  homeFromDiary: [
    { x: RIGHT_X, y: FORK_Y,            dur: 400, face: -1 },
    { x: CENTER_X, y: FORK_Y,           dur: 550, face: -1 },
    { x: CENTER_X, y: 55,               dur: 500, face: 1 },
    { x: START_POS.x, y: START_POS.y,    dur: 500, face: 1 },
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
      if (px < 25 && py < 30) pathKey = 'homeFromAira';
      else if (px > 60 && py < 25) pathKey = 'homeFromDiary';
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

        {/* Toast message (diary "준비 중" etc.) */}
        {toastMessage && (
          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            fontFamily: F, fontSize: '8px', color: '#c5a3f5',
            background: 'rgba(20,8,40,0.9)', padding: '6px 14px',
            border: '1px solid #4a2070', borderRadius: 4,
            zIndex: 20, animation: 'panelSlideUp 0.2s ease',
          }}>{toastMessage}</div>
        )}

        {/* Layer 1 — Background sky */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #02000c 0%, #08021a 55%, #050c08 100%)' }} />

        {/* Depth gradient — far(top) darker, near(bottom) slightly warmer */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 55%, rgba(18,28,12,0.25) 100%)',
          zIndex: 1,
        }} />

        {/* Stars */}
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${s.y}%`, left: `${s.x}%`,
            width: s.sz, height: s.sz, background: '#fff', borderRadius: '50%',
            opacity: s.op, animation: `starTwinkle ${s.dur}s ease-in-out infinite ${s.del}s`,
          }} />
        ))}

        {/* Layer 2 — Terrain (dark grass) */}
        {GRASS.map((g, i) => (
          <div key={i} style={{ position: 'absolute',
            top: `${g.y}%`, left: `${g.x}%`, width: `${g.w}%`, height: `${g.h}%`,
            background: g.c }} />
        ))}

        {/* Border trees */}
        {TREES.map((t, i) => <MutedTree key={i} x={t.x} y={t.y} s={t.s} />)}

        {/* FX — ambient magical particles (z:3, between terrain and characters) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {FX_PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${p.y}%`, left: `${p.x}%`,
              width: p.sz, height: p.sz,
              background: p.c,
              borderRadius: '50%',
              opacity: p.op,
              animation: `fxDrift ${p.dur}s ease-in-out infinite ${p.del}s`,
              boxShadow: `0 0 ${p.sz * 2}px ${p.c}`,
            }} />
          ))}
        </div>

        {/* Layer 3 — Stone roads (clear paths, no building overlap) */}
        <StoneRoad x={CENTER_X - 2} y={FORK_Y + 3}  w={5}  h={48} />  {/* center vertical — main path */}
        <StoneRoad x={10}           y={FORK_Y - 2}   w={62} h={6}  />  {/* horizontal fork */}
        <StoneRoad x={LEFT_X - 2}   y={10}           w={5}  h={28} />  {/* left fork → Aira */}
        <StoneRoad x={RIGHT_X - 2}  y={8}            w={5}  h={30} />  {/* right fork → Diary */}

        {/* Starting area — path entrance, flowers, Luna cat */}
        <StartingArea />
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

        {/* ── Aira's house (top-left) ── */}
        <AiraHouse />

        {/* ── Diary (top-right) ── */}
        <DiaryBuilding />
        {/* Diary click overlay */}
        <div
          onClick={handleDiaryClick}
          title="일기장 (준비 중)"
          style={{
            position: 'absolute', top: '2%', left: '74%', width: '24%', height: '24%',
            cursor: !walking && dialogPhase === 'none' ? 'pointer' : 'default',
            zIndex: 6,
          }}
        />

        {/* ── Gray's zone (right-center) ── */}
        <GrayZone />

        {/* ── Aira character (clickable) ── */}
        <div
          onClick={handleAiraClick}
          title="아이라 (유료 딥 리딩)"
          style={{
            position: 'absolute', top: `${AIRA_POS.y}%`, left: `${AIRA_POS.x}%`,
            transform: 'scale(3.2) scaleX(-1)', transformOrigin: 'bottom center',
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

        {/* Aira label */}
        <div style={{
          position: 'absolute', top: `calc(${AIRA_POS.y}% + 86px)`, left: `${AIRA_POS.x - 2}%`,
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
            top: `calc(${AIRA_POS.y}% + 100px)`, left: `${AIRA_POS.x}%`,
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
            transform: 'scale(3.2)', transformOrigin: 'bottom center',
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

        {/* Gray label */}
        <div style={{
          position: 'absolute', top: `calc(${GRAY_POS.y}% + 74px)`, left: `${GRAY_POS.x - 2}%`,
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
          transform: `scale(3.0) scaleX(${facing})`, transformOrigin: 'bottom center',
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
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '46%',
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
            {/* Portrait */}
            <div style={{
              width: 76, flexShrink: 0,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              padding: '0 0 10px 8px',
              borderRight: '1px solid rgba(107,45,139,0.15)',
              background: destination === 'gray' ? 'rgba(14,22,36,0.7)' : 'rgba(10,4,26,0.7)',
            }}>
              <div style={{
                transform: destination === 'gray' ? 'scale(1.6)' : 'scale(1.6) scaleX(-1)',
                transformOrigin: 'bottom center', imageRendering: 'pixelated',
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
          0%, 100% { transform: scale(1.8) scaleX(-1) translateY(0px); }
          50%       { transform: scale(1.8) scaleX(-1) translateY(-4px); }
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
        @keyframes candleFlicker {
          from { opacity: 0.95; transform: scaleX(1)   scaleY(1);   }
          to   { opacity: 0.6;  transform: scaleX(0.8) scaleY(1.2); }
        }
        @keyframes crystalPulse {
          0%, 100% { opacity: 0.85; }
          50%       { opacity: 0.4;  }
        }
        @keyframes diaryFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes windowGlow {
          0%, 100% { box-shadow: 0 0 22px rgba(140,60,200,0.75), inset 0 0 14px rgba(220,180,255,0.30); }
          50%       { box-shadow: 0 0 38px rgba(160,80,220,0.95), inset 0 0 22px rgba(220,180,255,0.50); }
        }
        @keyframes lunaTailWag {
          0%, 85%, 100% { transform: rotate(0deg); }
          90% { transform: rotate(-25deg); }
          92% { transform: rotate(20deg); }
          95% { transform: rotate(-15deg); }
        }
        @keyframes lunaEarTwitch {
          0%, 88%, 100% { transform: scaleY(1); }
          90% { transform: scaleY(1.15); }
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

// ── Sub-components ────────────────────────────────────────────────────────────

// Luna the cat — ivory, 1/3 protagonist size, tail wag + ear twitch
function LunaCat() {
  const ivory = '#f0ebe0';
  const ivoryShadow = '#e0d8c8';
  const ivoryDark = '#d8d0c0';
  const F = "'Press Start 2P'";
  return (
    <div style={{
      position: 'absolute', bottom: '20%', left: '28%',
      transform: 'scale(1.0)', transformOrigin: 'bottom center',
      imageRendering: 'pixelated', zIndex: 4, pointerEvents: 'none',
    }}>
      <div style={{ position: 'relative', width: 12, height: 14 }}>
        {/* Ears — twitch animation */}
        <div style={{
          position: 'absolute', top: 0, left: 1, width: 3, height: 4,
          background: ivory, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transformOrigin: 'bottom center',
          animation: 'lunaEarTwitch 4.2s ease-in-out infinite 0.3s',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 1, width: 3, height: 4,
          background: ivory, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transformOrigin: 'bottom center',
          animation: 'lunaEarTwitch 4.2s ease-in-out infinite 0.8s',
        }} />
        {/* Head */}
        <div style={{ position: 'absolute', top: 2, left: 2, width: 8, height: 6, background: ivory, borderRadius: '50% 50% 40% 40%' }} />
        <div style={{ position: 'absolute', top: 3, left: 3, width: 2, height: 2, background: '#2a1a08', borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 3, right: 3, width: 2, height: 2, background: '#2a1a08', borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 3, left: 4, width: 1, height: 1, background: '#fff', opacity: 0.8 }} />
        <div style={{ position: 'absolute', top: 3, right: 4, width: 1, height: 1, background: '#fff', opacity: 0.8 }} />
        {/* Body */}
        <div style={{ position: 'absolute', top: 7, left: 3, width: 6, height: 5, background: ivoryShadow, borderRadius: '40% 40% 50% 50%' }} />
        {/* Tail — wag animation */}
        <div style={{
          position: 'absolute', top: 9, right: -2, width: 4, height: 3,
          background: ivoryDark, borderRadius: '0 50% 50% 0',
          transformOrigin: 'left center',
          animation: 'lunaTailWag 3.5s ease-in-out infinite 1.2s',
        }} />
      </div>
      <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', fontFamily: F, fontSize: '5px', color: '#c5a3f5', whiteSpace: 'nowrap' }}>루나</div>
    </div>
  );
}

function StartingArea() {
  return (
    <>
      {/* Path entrance stones — bottom center */}
      <div style={{ position: 'absolute', bottom: '18%', left: '39%', width: '8%', height: '3%', background: '#2a2848', border: '1px solid #3e3a60', borderRadius: 2, zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: '16%', left: '41%', width: '6%', height: '2%', background: '#323050', border: '1px solid #4a4668', borderRadius: 2, zIndex: 2 }} />
      {/* Small flowers by path */}
      <div style={{ position: 'absolute', bottom: '20%', left: '34%', width: 6, height: 6, background: '#8a4a6a', borderRadius: '50%', border: '1px solid #6a3a52', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: '22%', right: '36%', width: 5, height: 5, background: '#6a5a9a', borderRadius: '50%', border: '1px solid #4a3a7a', zIndex: 3 }} />
      {/* Luna the cat — ivory, 1/3 protagonist size, at start */}
      <LunaCat />
    </>
  );
}

function StoneRoad({ x, y, w, h }) {
  return (
    <div style={{
      position: 'absolute', top: `${y}%`, left: `${x}%`, width: `${w}%`, height: `${h}%`,
      background: '#6868a4',
      backgroundImage: `
        repeating-linear-gradient(90deg, transparent 0%, transparent calc(16.6% - 1px), rgba(20,18,40,0.7) calc(16.6% - 1px), rgba(20,18,40,0.7) 16.6%),
        repeating-linear-gradient(0deg,  transparent 0%, transparent calc(25%   - 1px), rgba(20,18,40,0.7) calc(25%   - 1px), rgba(20,18,40,0.7) 25%)
      `,
      borderTop: '1px solid #8888c0',
      borderBottom: '1px solid #383058',
      boxShadow: 'inset 0 0 8px rgba(90,80,120,0.15)',
      zIndex: 1,
    }} />
  );
}

function MutedTree({ x, y, s = 1 }) {
  const w = Math.round(14 * s);
  return (
    <div style={{ position: 'absolute', top: `${y}%`, left: `${x}%`, pointerEvents: 'none', zIndex: 2 }}>
      <div style={{ width: w, height: Math.round(w * 0.85), background: '#091308', borderRadius: '50% 50% 40% 40%', border: '1px solid #0d1a0c' }} />
      <div style={{ width: Math.round(4 * s), height: Math.round(6 * s), background: '#090f07', margin: '0 auto' }} />
    </div>
  );
}

function AiraHouse() {
  return (
    <>
      {/* Foundation */}
      <div style={{ position: 'absolute', top: '30%', left: '3%', width: '20%', height: '3%', background: '#14102a', border: '1px solid #4028a0', zIndex: 2 }} />
      {/* Main wall */}
      <div style={{ position: 'absolute', top: '16%', left: '4%', width: '18%', height: '15%', background: '#1a1438', border: '2px solid #5030a0', zIndex: 2,
        filter: 'drop-shadow(3px 6px 0 rgba(0,0,0,0.75))' }} />
      {/* Siding lines */}
      {[19, 23, 27].map(y => (
        <div key={y} style={{ position: 'absolute', top: `${y}%`, left: '4%', width: '18%', height: '1px', background: 'rgba(44,28,82,0.5)', zIndex: 3 }} />
      ))}
      {/* Main roof */}
      <div style={{ position: 'absolute', top: '7%', left: '2%', width: '22%', height: '10%', background: '#0b0920', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', zIndex: 3 }} />
      {/* Small turret */}
      <div style={{ position: 'absolute', top: '8%', left: '11%', width: '6%', height: '6%', background: '#090718', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', zIndex: 4 }} />
      {/* Main window (glowing) */}
      <div style={{
        position: 'absolute', top: '18%', left: '8%', width: '8%', height: '6%',
        background: 'rgba(130,55,180,0.6)', border: '2px solid #b070e0',
        animation: 'windowGlow 2.8s ease-in-out infinite', zIndex: 4,
      }}>
        <div style={{ position: 'absolute', left: '48%', top: 0, width: 1, height: '100%', background: 'rgba(107,45,139,0.5)' }} />
        <div style={{ position: 'absolute', top: '46%', left: 0, width: '100%', height: 1, background: 'rgba(107,45,139,0.5)' }} />
      </div>
      {/* Door */}
      <div style={{ position: 'absolute', top: '24%', left: '10%', width: '5%', height: '6%', background: '#090718', border: '1px solid #3e2268', borderRadius: '2px 2px 0 0', zIndex: 4 }} />
      <div style={{ position: 'absolute', top: '27%', left: '14.5%', width: '1%', height: '1%', background: '#c8a030', borderRadius: '50%', zIndex: 5 }} />
      {/* Sign */}
      <div style={{ position: 'absolute', top: '30.5%', left: '5%', fontFamily: "'Press Start 2P'", fontSize: '5px', color: '#c5a3f5', background: '#0a0618', border: '1px solid #4a2070', padding: '2px 4px', whiteSpace: 'nowrap', zIndex: 5 }}>아이라의 집</div>
      {/* Crystal pillars */}
      <CrystalPost x={3.5} y={27} />
      <CrystalPost x={20.5} y={27} />
    </>
  );
}

function DiaryBuilding() {
  return (
    <>
      {/* Roof */}
      <div style={{ position: 'absolute', top: '2%', left: '75%', width: '22%', height: '8%', background: '#090618', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', zIndex: 3 }} />
      {/* Wall */}
      <div style={{
        position: 'absolute', top: '8%', left: '76%', width: '20%', height: '16%',
        background: '#16122e', border: '2px solid #3c2880', zIndex: 3,
        filter: 'drop-shadow(3px 6px 0 rgba(0,0,0,0.75))',
      }}>
        {/* Wall lines */}
        {[40, 70].map(p => (
          <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, width: '100%', height: 1, background: 'rgba(32,24,56,0.6)' }} />
        ))}
        {/* Lock + label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 3 }}>
          <div style={{ fontSize: '14px', animation: 'diaryFloat 2.4s ease-in-out infinite' }}>🔒</div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: '5px', color: '#5a4a88' }}>일기장</div>
        </div>
      </div>
      {/* Foundation */}
      <div style={{ position: 'absolute', top: '23%', left: '75%', width: '22%', height: '2%', background: '#120e28', border: '1px solid #3c2880', zIndex: 3 }} />
    </>
  );
}

function GrayZone() {
  return (
    <>
      {/* Checkered stone floor — centered around main path */}
      {GRAY_FLOOR.map((f, i) => (
        <div key={i} style={{ position: 'absolute', top: `${f.y}%`, left: `${f.x}%`, width: `${f.w}%`, height: `${f.h}%`, background: f.c, border: '1px solid #1a163a', zIndex: 2 }} />
      ))}
      <LampPost x={24} y={37} />
      {/* Table top — left of center road */}
      <div style={{ position: 'absolute', top: '55%', left: '25%', width: '18%', height: '4%', background: '#7c4520', border: '1px solid #5a3010', zIndex: 4 }} />
      {/* Table legs */}
      <div style={{ position: 'absolute', top: '59%', left: '26.5%', width: '2.5%', height: '3%', background: '#4a2c10', zIndex: 4 }} />
      <div style={{ position: 'absolute', top: '59%', left: '40%',   width: '2.5%', height: '3%', background: '#4a2c10', zIndex: 4 }} />
      {/* Cards on table */}
      <div style={{ position: 'absolute', top: '55.5%', left: '26%', width: '4%', height: '5%', background: '#2a1a4a', border: '1px solid #c8a030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', zIndex: 5 }}>
        <span style={{ color: '#c8a030' }}>✦</span>
      </div>
      <div style={{ position: 'absolute', top: '56%', left: '31%', width: '3.5%', height: '4.5%', background: '#2a1a4a', border: '1px solid #c8a030', transform: 'rotate(8deg)', zIndex: 5 }} />
      <Candle x={42} y={48} />
    </>
  );
}

function LampPost({ x, y }) {
  return (
    <div style={{ position: 'absolute', top: `${y}%`, left: `${x}%`, pointerEvents: 'none', zIndex: 3 }}>
      <div style={{ width: 11, height: 9, background: 'rgba(255,218,70,0.55)', border: '1px solid #6a5020', boxShadow: '0 0 28px rgba(255,200,50,0.70)', margin: '0 auto' }} />
      <div style={{ width: 3, height: 30, background: '#201c38', margin: '0 auto' }} />
    </div>
  );
}

function Candle({ x, y }) {
  return (
    <div style={{ position: 'absolute', top: `${y}%`, left: `${x}%`, pointerEvents: 'none', zIndex: 5 }}>
      <div style={{ width: 6, height: 8, background: 'radial-gradient(circle at 50% 70%, #ffe060, #ff8800, transparent)', borderRadius: '50% 50% 30% 30%', margin: '0 auto', animation: 'candleFlicker 1.1s ease-in-out infinite alternate', boxShadow: '0 0 18px rgba(255,180,30,0.75)' }} />
      <div style={{ width: 4, height: 10, background: '#e8d8b0', margin: '0 auto' }} />
    </div>
  );
}

function CrystalPost({ x, y }) {
  return (
    <div style={{
      position: 'absolute', top: `${y}%`, left: `${x}%`,
      width: '2.2%', height: '6%',
      background: 'linear-gradient(180deg, #a060e0 0%, #5a1a8a 100%)',
      clipPath: 'polygon(50% 0%, 100% 22%, 80% 100%, 20% 100%, 0% 22%)',
      boxShadow: '0 0 8px rgba(150,60,200,0.5)',
      animation: 'crystalPulse 2.5s ease-in-out infinite',
      pointerEvents: 'none', zIndex: 5,
    }} />
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const GRASS = [
  { x: 0,  y: 0,  w: 100, h: 100, c: '#0d1c0b' },
  { x: 0,  y: 0,  w: 55,  h: 14,  c: '#112013' },
  { x: 55, y: 0,  w: 45,  h: 12,  c: '#112013' },
  { x: 0,  y: 40, w: 14,  h: 22,  c: '#0e1b0c' },
  { x: 86, y: 40, w: 14,  h: 22,  c: '#0e1b0c' },
  { x: 12, y: 64, w: 76,  h: 36,  c: '#0f1e0d' },
];

// Gray's floor — centered around main path (x 24-52%, y 43-63%)
const GRAY_FLOOR = [
  { x: 24, y: 43, w: 7, h: 5, c: '#2c2850' }, { x: 31, y: 43, w: 7, h: 5, c: '#110e28' },
  { x: 38, y: 43, w: 7, h: 5, c: '#2c2850' }, { x: 45, y: 43, w: 7, h: 5, c: '#110e28' },
  { x: 24, y: 48, w: 7, h: 5, c: '#110e28' }, { x: 31, y: 48, w: 7, h: 5, c: '#2c2850' },
  { x: 38, y: 48, w: 7, h: 5, c: '#110e28' }, { x: 45, y: 48, w: 7, h: 5, c: '#2c2850' },
  { x: 24, y: 53, w: 7, h: 5, c: '#2c2850' }, { x: 31, y: 53, w: 7, h: 5, c: '#110e28' },
  { x: 38, y: 53, w: 7, h: 5, c: '#2c2850' }, { x: 45, y: 53, w: 7, h: 5, c: '#110e28' },
  { x: 24, y: 58, w: 7, h: 4, c: '#110e28' }, { x: 31, y: 58, w: 7, h: 4, c: '#2c2850' },
  { x: 38, y: 58, w: 7, h: 4, c: '#110e28' }, { x: 45, y: 58, w: 7, h: 4, c: '#2c2850' },
];

const TREES = [
  { x: 0,  y: 4,  s: 1.2 }, { x: 0,  y: 22, s: 1.0 }, { x: 0,  y: 42, s: 1.1 },
  { x: 0,  y: 62, s: 1.0 }, { x: 0,  y: 80, s: 1.2 },
  { x: 93, y: 4,  s: 1.2 }, { x: 93, y: 22, s: 1.0 }, { x: 93, y: 44, s: 1.1 },
  { x: 93, y: 62, s: 1.0 }, { x: 93, y: 80, s: 1.2 },
  { x: 44, y: 1,  s: 1.0 },
];

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
