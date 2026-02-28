import React, { useEffect, useState } from 'react';
import { getReport } from '../services/firestoreService';
import TarotCard from '../components/TarotCard';

export default function ReportPage({ sessionId }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) { setError('잘못된 링크입니다.'); setLoading(false); return; }
    getReport(sessionId)
      .then(data => {
        if (!data) setError('리포트를 찾을 수 없습니다.');
        else setSession(data);
      })
      .catch(() => setError('불러오기 실패.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Press Start 2P'", color: '#c5a3f5', fontSize: '12px',
      }}>
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Press Start 2P'", color: '#ff6b6b', gap: 12,
      }}>
        <div style={{ fontSize: 32 }}>✦</div>
        <div style={{ fontSize: '12px' }}>{error}</div>
        <button className="pixel-btn" onClick={() => window.location.href = '/'}>홈으로</button>
      </div>
    );
  }

  const report = session?.report;
  const cards = session?.cards || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
      padding: '28px 20px 40px',
      fontFamily: "'Press Start 2P'",
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, color: '#ffd700', letterSpacing: 4 }}>✦ TAROT JOURNEY ✦</div>
          <div style={{ fontSize: '11px', color: '#c5a3f5', marginTop: 12, lineHeight: 2 }}>
            "{session?.question}"
          </div>
        </div>

        {report && (
          <>
            {/* Title + Core message */}
            <div style={{
              background: 'rgba(107,45,139,0.2)', border: '2px solid #ffd700',
              padding: '18px 20px', marginBottom: 20, textAlign: 'center',
            }}>
              <div style={{ fontSize: '14px', color: '#ffd700', marginBottom: 12, lineHeight: 1.8 }}>
                {report.title}
              </div>
              <div style={{ fontSize: '11px', color: '#f0e6ff', lineHeight: 2.2 }}>
                {report.coreMessage}
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
              {cards.map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <TarotCard card={c.card} faceDown={false} size="sm" />
                  <div style={{ fontSize: '9px', color: '#ffd700', textAlign: 'center', maxWidth: 80, lineHeight: 1.6 }}>
                    {c.positionLabel}
                  </div>
                </div>
              ))}
            </div>

            {/* Direction */}
            {report.direction && (
              <div style={{
                background: 'rgba(255,215,0,0.07)', border: '1px solid #ffd700',
                padding: '14px 16px', marginBottom: 16,
              }}>
                <div style={{ fontSize: '10px', color: '#ffd700', marginBottom: 8 }}>카드가 가리키는 방향</div>
                <div style={{ fontSize: '11px', color: '#ffd700', lineHeight: 2 }}>
                  {report.direction}
                </div>
              </div>
            )}

            {/* Advice */}
            {report.advice?.length > 0 && (
              <div style={{
                background: 'rgba(27,10,46,0.8)', border: '1px solid #6b2d8b',
                padding: '16px', marginBottom: 20,
              }}>
                <div style={{ fontSize: '10px', color: '#ffd700', marginBottom: 12 }}>루나의 조언</div>
                {report.advice.map((a, i) => (
                  <div key={i} style={{
                    fontSize: '11px', color: '#c5a3f5', lineHeight: 2,
                    paddingLeft: 12, borderLeft: '2px solid #6b2d8b', marginBottom: 10,
                  }}>
                    {a}
                  </div>
                ))}
              </div>
            )}

            {/* Closing */}
            {report.closingWords && (
              <div style={{ textAlign: 'center', color: '#f0e6ff', fontSize: '11px', lineHeight: 2.2, fontStyle: 'italic', marginBottom: 8 }}>
                "{report.closingWords}"
                <div style={{ color: '#9b7fc4', fontSize: '10px', marginTop: 8 }}>— Luna</div>
              </div>
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="pixel-btn" onClick={() => window.location.href = '/'}>
            나도 해보기 →
          </button>
        </div>
      </div>
    </div>
  );
}
