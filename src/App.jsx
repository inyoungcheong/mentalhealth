import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { createSession, saveInitialReading, saveSpreadSelection } from './services/firestoreService';
import { spendLua } from './services/luaService';

import LunaHUD from './components/LunaHUD';
import Scene1Intro from './scenes/Scene1Intro';
import Scene2Village from './scenes/Scene2Village';
import Scene3CardDraw from './scenes/Scene3CardDraw';
import SceneTierSelect from './scenes/SceneTierSelect';
import SceneMap from './scenes/SceneMap';
import Scene6Reading from './scenes/Scene6Reading';
import Scene7Report from './scenes/Scene7Report';
import ReportPage from './scenes/ReportPage';

import './styles/global.css';
import './styles/pixelart.css';

// Check if URL is a report share link
function getReportId() {
  const match = window.location.pathname.match(/^\/report\/(.+)$/);
  return match ? match[1] : null;
}

export default function App() {
  const [scene, setScene] = useState('intro'); // intro | map | village | tier-select | tier-select-paid | card-draw | reading | report
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Visitor context (set on login in Scene1Intro)
  const [isNewUser, setIsNewUser] = useState(false);
  const [lastVisitAt, setLastVisitAt] = useState(null);
  const [luaBalance, setLuaBalance] = useState(null);

  // Session data
  const [question, setQuestion] = useState('');
  const [initialCard, setInitialCard] = useState(null);
  const [interpretation, setInterpretation] = useState('');
  const [coreIssue, setCoreIssue] = useState('');
  const [deeperHook, setDeeperHook] = useState('');
  const [spreadInfo, setSpreadInfo] = useState(null);
  const [finalCards, setFinalCards] = useState([]);

  // Check auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthLoaded(true);
    });
    return unsub;
  }, []);

  // Report share page
  const reportId = getReportId();
  if (reportId) {
    return (
      <div className="game-viewport">
        <ReportPage sessionId={reportId} />
      </div>
    );
  }

  // Scene transitions
  async function handleIntroNext({ isNew, lastVisitAt: lat, lua }) {
    setIsNewUser(isNew);
    setLastVisitAt(lat);
    if (isNew && lua > 0) {
      // Animate 0 → lua for new users
      setLuaBalance(0);
      setTimeout(() => setLuaBalance(lua), 400);
    } else {
      setLuaBalance(lua ?? 0);
    }
    setScene('map');
  }

  async function handleVillageNext(q) {
    setQuestion(q);
    setScene('tier-select');
  }

  async function handleMapNext({ destination, question: q, useFree }) {
    setQuestion(q);
    if (destination === 'gray') {
      // Paid oracle: deduct 1 luna before proceeding
      if (!useFree && user) {
        try {
          const { lua } = await spendLua(1);
          setLuaBalance(lua);
        } catch (err) {
          console.error('Lua spend error (oracle):', err);
        }
      }
      setScene('card-draw');
    } else {
      // aira → paid-only tier select
      setScene('tier-select-paid');
    }
  }

  async function handleTierNext({ tier }) {
    if (tier === 'oracle') {
      setScene('card-draw');
      return;
    }

    // Paid tiers: create Firestore session then go to reading
    const spread = tier === 'oneCard'
      ? { spreadType: 'oneCard', spreadName: '원카드', positions: ['현재'], cardCount: 1 }
      : { spreadType: 'threeCard', spreadName: '쓰리카드', positions: ['과거', '현재', '미래'], cardCount: 3 };

    setSpreadInfo(spread);

    if (user) {
      try {
        const sid = await createSession(user.uid, question);
        setSessionId(sid);
        await saveSpreadSelection(sid, spread.spreadType);
      } catch (err) {
        console.error('Firestore session create error:', err);
      }
    }

    setScene('reading');
  }

  async function handleCardDrawNext({ card, answer, coreIssue: issue, deeperHook: hook }) {
    // Oracle is standalone — store data then restart to village
    setInitialCard(card);
    setInterpretation(answer || '');
    setCoreIssue(issue || '');
    setDeeperHook(hook || '');
    setScene('map');
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setScene('intro');
    setSessionId(null);
    setQuestion('');
    setInitialCard(null);
    setInterpretation('');
    setCoreIssue('');
    setDeeperHook('');
    setSpreadInfo(null);
    setFinalCards([]);
  }

  async function handleReadingNext({ cards }) {
    setFinalCards(cards);
    setScene('report');
  }

  const sceneComponents = {
    intro: <Scene1Intro user={user} authLoaded={authLoaded} onNext={handleIntroNext} />,
    map: <SceneMap isNew={isNewUser} lastVisitAt={lastVisitAt} luaBalance={luaBalance} onNext={handleMapNext} />,
    village: <Scene2Village isNew={isNewUser} lastVisitAt={lastVisitAt} onNext={handleVillageNext} />,
    'tier-select': <SceneTierSelect question={question} luaBalance={luaBalance} onNext={handleTierNext} onLuaSpent={setLuaBalance} />,
    'tier-select-paid': <SceneTierSelect question={question} luaBalance={luaBalance} mode="paid-only" onNext={handleTierNext} onLuaSpent={setLuaBalance} />,
    'card-draw': <Scene3CardDraw question={question} onNext={handleCardDrawNext} />,
    reading: spreadInfo ? (
      <Scene6Reading
        sessionId={sessionId}
        question={question}
        coreIssue={coreIssue}
        oracleAnswer={interpretation}
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

  return (
    <div className="game-viewport">
      <LunaHUD balance={luaBalance} onLogout={handleLogout} />
      <div className="game-screen" style={{
        overflowY: 'auto', position: 'relative',
      }}>
        {/* Scene transition wrapper */}
        <div
          key={scene}
          style={{
            width: '100%', height: '100%',
            animation: 'sceneFadeIn 0.4s ease',
          }}
        >
          {sceneComponents[scene] || sceneComponents.intro}
        </div>

        {/* Dev scene skip (remove for production) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed', bottom: 4, right: 4,
            display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end',
            zIndex: 9999,
          }}>
            {['intro','map','village','tier-select','tier-select-paid','card-draw','reading','report'].map(s => (
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
