import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { saveInitialReading, saveSpreadSelection } from './services/firestoreService';
import { initUserIfNeeded } from './services/luaService';

import Scene1Intro from './scenes/Scene1Intro';
import Scene2Village from './scenes/Scene2Village';
import Scene3CardDraw from './scenes/Scene3CardDraw';
import CurrencyIntroScene from './scenes/CurrencyIntroScene';
import Scene6Reading from './scenes/Scene6Reading';
import Scene7Report from './scenes/Scene7Report';
import ReportPage from './scenes/ReportPage';
import HistoryPage from './scenes/HistoryPage';
import AdminPage from './scenes/AdminPage';
import LuaHUD from './components/LuaHUD';

import './styles/global.css';
import './styles/pixelart.css';

function getSpecialRoute() {
  const path = window.location.pathname;
  const reportMatch = path.match(/^\/report\/(.+)$/);
  if (reportMatch) return { type: 'report', id: reportMatch[1] };
  if (path === '/history') return { type: 'history' };
  if (path === '/admin') return { type: 'admin' };
  return null;
}

export default function App() {
  // scene: intro | village | analysis | card-draw | lua-intro | reading | report
  const [scene, setScene] = useState('intro');
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [luaBalance, setLuaBalance] = useState(null);

  // Session data
  const [question, setQuestion] = useState('');
  const [initialCard, setInitialCard] = useState(null);
  const [interpretation, setInterpretation] = useState('');
  const [coreIssue, setCoreIssue] = useState('');
  const [deeperHook, setDeeperHook] = useState('');
  const [spreadInfo, setSpreadInfo] = useState(null);
  const [finalCards, setFinalCards] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  // Special routes: /report/:id and /history
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

  // ── Scene handlers ──────────────────────────────────────────────

  function handleIntroNext() {
    setScene('village');
  }

  async function handleVillageNext(q, loggedInUser) {
    setQuestion(q);
    setUser(loggedInUser);
    try {
      const res = await initUserIfNeeded();
      setLuaBalance(res.data.lua);
    } catch (err) {
      console.error('initUser error:', err);
      setLuaBalance(0);
    }
    setScene('card-draw'); // free oracle
  }

  function handleCardDrawNext({ card, answer, coreIssue: issue, deeperHook: hook }) {
    setInitialCard(card);
    setInterpretation(answer || '');
    setCoreIssue(issue || '');
    setDeeperHook(hook || '');
    setScene('lua-intro'); // spread selection (costs lua)
  }

  async function handleLuaConsumed({ sessionId: sid, luaAfter, spreadType, spreadName, positions, cardCount }) {
    setSessionId(sid);
    setLuaBalance(luaAfter);
    setSpreadInfo({ spreadType, spreadName, positions, cardCount });

    // Save oracle data to the newly created session
    if (initialCard) {
      try {
        await saveInitialReading(sid, initialCard, null, interpretation, coreIssue);
        await saveSpreadSelection(sid, spreadType);
      } catch (err) {
        console.error('saveInitialReading error:', err);
      }
    }

    setScene('reading');
  }

  function handleReadingNext({ cards }) {
    setFinalCards(cards);
    setScene('report');
  }

  // ── Scene map ────────────────────────────────────────────────────

  const sceneComponents = {
    intro: <Scene1Intro onNext={handleIntroNext} />,
    village: <Scene2Village currentUser={user} onNext={handleVillageNext} />,
    'card-draw': <Scene3CardDraw question={question} onNext={handleCardDrawNext} />,
    'lua-intro': (
      <CurrencyIntroScene
        question={question}
        luaBalance={luaBalance ?? 0}
        deeperHook={deeperHook}
        onNext={handleLuaConsumed}
      />
    ),
    reading: spreadInfo ? (
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

  const devScenes = ['intro', 'village', 'card-draw', 'lua-intro', 'reading', 'report'];

  return (
    <div className="game-viewport">
      <div className="game-screen" style={{ overflowY: 'auto', position: 'relative' }}>

        {/* Lua balance HUD */}
        <LuaHUD luaBalance={user ? luaBalance : null} />

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
