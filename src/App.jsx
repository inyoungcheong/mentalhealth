import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { createSession, saveInitialReading, saveSpreadSelection } from './services/firestoreService';

import Scene1Intro from './scenes/Scene1Intro';
import Scene2Village from './scenes/Scene2Village';
import Scene3CardDraw from './scenes/Scene3CardDraw';
import Scene4Analysis from './scenes/Scene4Analysis';
import Scene5Spread from './scenes/Scene5Spread';
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
  const [scene, setScene] = useState('intro'); // intro | village | card-draw | analysis | spread | reading | report
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);

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
    const unsub = onAuthStateChanged(auth, u => setUser(u));
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
  async function handleIntroNext() {
    setScene('village');
  }

  async function handleVillageNext(q) {
    setQuestion(q);
    setScene('card-draw');
  }

  async function handleCardDrawNext({ card, answer, coreIssue: issue, deeperHook: hook }) {
    setInitialCard(card);
    setInterpretation(answer || '');
    setCoreIssue(issue || '');
    setDeeperHook(hook || '');
    setScene('analysis');
  }

  async function handleAnalysisNext(loggedInUser) {
    setUser(loggedInUser);

    // Create Firestore session
    try {
      const sid = await createSession(loggedInUser.uid, question);
      setSessionId(sid);
      if (initialCard) {
        await saveInitialReading(sid, initialCard, null, interpretation, coreIssue);
      }
    } catch (err) {
      console.error('Firestore session create error:', err);
    }

    setScene('spread');
  }

  async function handleSpreadNext(spread) {
    setSpreadInfo(spread);

    if (sessionId) {
      try {
        await saveSpreadSelection(sessionId, spread.spreadType);
      } catch (err) {
        console.error('Spread save error:', err);
      }
    }

    setScene('reading');
  }

  async function handleReadingNext({ cards }) {
    setFinalCards(cards);
    setScene('report');
  }

  const sceneComponents = {
    intro: <Scene1Intro onNext={handleIntroNext} />,
    village: <Scene2Village onNext={handleVillageNext} />,
    'card-draw': <Scene3CardDraw question={question} onNext={handleCardDrawNext} />,
    analysis: <Scene4Analysis coreIssue={coreIssue} deeperHook={deeperHook} onNext={handleAnalysisNext} />,
    spread: <Scene5Spread question={question} coreIssue={coreIssue} onNext={handleSpreadNext} />,
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

  return (
    <div className="game-viewport">
      <div className="game-screen" style={{
        overflowY: 'auto', position: 'relative',
      }}>
        {/* Scene transition wrapper */}
        <div
          key={scene}
          style={{
            width: '100%', minHeight: '100%',
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
            {['intro','village','card-draw','analysis','spread','reading','report'].map(s => (
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
