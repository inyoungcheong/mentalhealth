import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { createSession } from './services/firestoreService';
import { requestTossPayment } from './services/paymentService';

import Scene1Intro from './scenes/Scene1Intro';
import Scene2Village from './scenes/Scene2Village';
import Scene3CardDraw from './scenes/Scene3CardDraw';
import FreeResultScene from './scenes/FreeResultScene';
import Scene6Reading from './scenes/Scene6Reading';
import Scene7Report from './scenes/Scene7Report';
import ReportPage from './scenes/ReportPage';
import HistoryPage from './scenes/HistoryPage';
import AdminPage from './scenes/AdminPage';
import PaymentSuccessPage from './scenes/PaymentSuccessPage';

import './styles/global.css';
import './styles/pixelart.css';

function getSpecialRoute() {
  const path = window.location.pathname;
  const reportMatch = path.match(/^\/report\/(.+)$/);
  if (reportMatch) return { type: 'report', id: reportMatch[1] };
  if (path === '/history') return { type: 'history' };
  if (path === '/admin') return { type: 'admin' };
  if (path === '/payment/success') return { type: 'payment-success' };
  if (path === '/payment/fail') return { type: 'payment-fail' };
  return null;
}

export default function App() {
  // scene: intro | village | card-draw | free-result | three-card | report
  const [scene, setScene] = useState('intro');
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Session data
  const [question, setQuestion] = useState('');
  const [categoryId, setCategoryId] = useState('general');
  const [initialCard, setInitialCard] = useState(null);
  const [initialHexagram, setInitialHexagram] = useState(null);
  const [freeResult, setFreeResult] = useState(null);   // 템플릿 리딩 결과
  const [readingId, setReadingId] = useState(null);     // 심층 리딩 doc ID
  const [deepPreview, setDeepPreview] = useState(null); // blur preview text
  const [coreIssue, setCoreIssue] = useState('');       // deepReading에서 추출
  const [spreadInfo, setSpreadInfo] = useState(null);
  const [finalCards, setFinalCards] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  // Special routes
  const specialRoute = getSpecialRoute();
  if (specialRoute?.type === 'report') {
    return (
      <div style={{ width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#0d0020' }}>
        <ReportPage sessionId={specialRoute.id} />
      </div>
    );
  }
  if (specialRoute?.type === 'history') {
    return (
      <div style={{ width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#0d0020' }}>
        <HistoryPage user={user} />
      </div>
    );
  }
  if (specialRoute?.type === 'admin') {
    return (
      <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#0d0020' }}>
        <AdminPage />
      </div>
    );
  }
  if (specialRoute?.type === 'payment-success') {
    return <PaymentSuccessPage />;
  }
  if (specialRoute?.type === 'payment-fail') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0020', gap: 20 }}>
        <div style={{ fontSize: 36 }}>✕</div>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '13px', color: '#ff6b6b', textAlign: 'center', lineHeight: 2 }}>
          결제가 취소됐어.
        </div>
        <a href="/" style={{ fontFamily: "'Press Start 2P'", fontSize: '11px', color: '#ffd700', textDecoration: 'none', border: '1px solid #ffd700', padding: '10px 20px' }}>
          ↩ 돌아가기
        </a>
      </div>
    );
  }

  // ── Scene handlers ──────────────────────────────────────────────

  function handleIntroNext() {
    setScene('village');
  }

  function handleVillageNext(q, loggedInUser, catId = 'general') {
    setQuestion(q);
    setCategoryId(catId);
    setUser(loggedInUser);
    setScene('card-draw');
  }

  function handleCardDrawNext({ card, hexagram, freeResult: fr, readingId: rid, deepReadingPromise }) {
    setInitialCard(card);
    setInitialHexagram(hexagram);
    setFreeResult(fr);
    setReadingId(rid || null);
    setScene('free-result');
    // Await deep reading in background — update state when it resolves
    if (deepReadingPromise) {
      deepReadingPromise.then(r => {
        if (r) {
          setDeepPreview(r.preview || null);
          setCoreIssue(r.coreIssue || '');
        }
      });
    }
  }

  const THREE_CARD_SPREAD = {
    spreadType: 'threeCard',
    spreadName: '과거·현재·미래',
    positions: ['과거', '현재', '미래'],
    cardCount: 3,
  };

  async function handleSelectTier({ tier }) {
    if (!user) return; // FreeResultScene shows login warning

    if (tier === '330') {
      // single_deep: readingId already exists from initFreeTierReading
      const orderId = `sd-${readingId}-${Date.now()}`;
      await requestTossPayment({
        amount: 330,
        orderId,
        orderName: '타로 심층 리딩',
        customerName: user.displayName,
        context: {
          productType: 'single_deep',
          readingId,
          initialCard,
          question,
        },
      });
    } else if (tier === '990') {
      // three_card: create session (paymentStatus: pending) before redirecting
      const sid = await createSession(user.uid, question, {
        paymentStatus: 'pending',
        readingType: 'three_card',
      });
      const orderId = `tc-${sid}-${Date.now()}`;
      await requestTossPayment({
        amount: 990,
        orderId,
        orderName: '쓰리카드 타로 상담',
        customerName: user.displayName,
        context: {
          productType: 'three_card',
          sessionId: sid,
          question,
          coreIssue,
          initialCard,
          initialHexagram,
          ...THREE_CARD_SPREAD,
        },
      });
    }
  }

  function handleReadingNext({ cards }) {
    setFinalCards(cards);
    setScene('report');
  }

  function handleRestart() {
    setScene('intro');
    setQuestion('');
    setCategoryId('general');
    setInitialCard(null);
    setInitialHexagram(null);
    setFreeResult(null);
    setReadingId(null);
    setDeepPreview(null);
    setCoreIssue('');
    setSessionId(null);
    setSpreadInfo(null);
    setFinalCards([]);
  }

  // ── Scene map ────────────────────────────────────────────────────

  const sceneComponents = {
    intro: <Scene1Intro onNext={handleIntroNext} />,
    village: <Scene2Village currentUser={user} onNext={handleVillageNext} />,
    'card-draw': (
      <Scene3CardDraw
        question={question}
        categoryId={categoryId}
        user={user}
        onNext={handleCardDrawNext}
      />
    ),
    'free-result': (
      <FreeResultScene
        card={initialCard}
        hexagram={initialHexagram}
        freeResult={freeResult}
        readingId={readingId}
        deepPreview={deepPreview}
        user={user}
        onSelectTier={handleSelectTier}
      />
    ),
    'three-card': spreadInfo ? (
      <Scene6Reading
        sessionId={sessionId}
        question={question}
        coreIssue={coreIssue}
        spreadType={spreadInfo.spreadType}
        spreadName={spreadInfo.spreadName}
        positions={spreadInfo.positions}
        cardCount={spreadInfo.cardCount}
        onNext={handleReadingNext}
      />
    ) : null,
    report: (
      <Scene7Report
        sessionId={sessionId}
        question={question}
        spreadName={spreadInfo?.spreadName || ''}
        cards={finalCards}
        coreIssue={coreIssue}
      />
    ),
  };

  const devScenes = ['intro', 'village', 'card-draw', 'free-result', 'three-card', 'report'];

  return (
    <div className="game-viewport">
      <div className="game-screen" style={{ overflowY: 'auto', position: 'relative' }}>

        {/* Scene transition wrapper */}
        <div
          key={scene}
          style={{ width: '100%', height: '100%', animation: 'sceneFadeIn 0.4s ease' }}
        >
          {sceneComponents[scene] || sceneComponents.intro}
        </div>

        {/* Dev scene skip */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed', bottom: 4, right: 4,
            display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end',
            zIndex: 9999,
          }}>
            {devScenes.map(s => (
              <button
                key={s}
                onClick={() => setScene(s)}
                style={{
                  fontSize: '6px', padding: '2px 4px',
                  background: scene === s ? '#6b2d8b' : '#333',
                  color: '#fff', border: '1px solid #555',
                  cursor: 'pointer', fontFamily: 'monospace',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes sceneFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
