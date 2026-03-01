import React, { useEffect, useState } from 'react';
import { getReport } from '../services/firestoreService';
import TarotCard from '../components/TarotCard';

// Font size scale — mobile base, desktop bumped via CSS vars + media query
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --f-xs:   10px;
    --f-sm:   11px;
    --f-body: 12px;
    --f-card: 14px;
    --f-title:16px;
    --f-hero: 20px;
  }
  @media (min-width: 640px) {
    :root {
      --f-xs:   11px;
      --f-sm:   13px;
      --f-body: 14px;
      --f-card: 16px;
      --f-title:18px;
      --f-hero: 24px;
    }
  }

  .rp { font-family: 'Press Start 2P', monospace; }
  .rp-xs   { font-size: var(--f-xs);   line-height: 2; }
  .rp-sm   { font-size: var(--f-sm);   line-height: 2.2; }
  .rp-body { font-size: var(--f-body); line-height: 2.4; }
  .rp-card { font-size: var(--f-card); line-height: 1.9; }
  .rp-title{ font-size: var(--f-title);line-height: 1.8; }
  .rp-hero { font-size: var(--f-hero); line-height: 1.6; letter-spacing: 3px; }

  .pixel-btn {
    font-family: 'Press Start 2P', monospace;
    font-size: var(--f-sm);
    padding: 14px 28px;
    background: #6b2d8b; color: #f5f0ff;
    border: none; cursor: pointer;
    box-shadow: 0 4px 0 #3d1a5a;
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .pixel-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #3d1a5a; }
  .pixel-btn.gold { background: #b8860b; box-shadow: 0 4px 0 #7a5a00; color: #fff9e0; }

  /* Card name highlight */
  .card-name-block {
    background: rgba(255,215,0,0.06);
    border-left: 3px solid #ffd700;
    padding: 8px 12px;
    margin-bottom: 8px;
  }
`;

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
      <>
        <style>{CSS}</style>
        <div style={{
          width: '100%', height: '100vh',
          background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="rp rp-body" style={{ color: '#c5a3f5' }}>불러오는 중...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{
          width: '100%', height: '100vh',
          background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 20,
        }}>
          <div style={{ fontSize: 36 }}>✦</div>
          <span className="rp rp-body" style={{ color: '#ff6b6b' }}>{error}</span>
          <button className="pixel-btn" onClick={() => window.location.href = '/'}>홈으로</button>
        </div>
      </>
    );
  }

  const report = session?.report;
  const cards = session?.cards || [];

  return (
    <>
      <style>{CSS}</style>
      <div className="rp" style={{
        width: '100%',
        background: 'linear-gradient(180deg, #0d0020 0%, #120828 60%, #0d0020 100%)',
        paddingBottom: 60,
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 20px' }}>

          {/* ── HEADER ── */}
          <div style={{ textAlign: 'center', padding: '40px 0 28px' }}>
            <div style={{ color: '#4a1a6e', marginBottom: 12, letterSpacing: 8, fontSize: 14 }}>
              ✦ ✦ ✦
            </div>
            <div className="rp-hero" style={{ color: '#ffd700', marginBottom: 2 }}>TAROT</div>
            <div className="rp-hero" style={{ color: '#ffd700', marginBottom: 28 }}>JOURNEY</div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(107,45,139,0.2)',
              border: '1px solid #6b2d8b',
              padding: '14px 22px',
              maxWidth: '100%',
            }}>
              <span className="rp-sm" style={{ color: '#c5a3f5' }}>"{session?.question}"</span>
            </div>
          </div>

          {report && (
            <>
              {/* ── TITLE + CORE MESSAGE ── */}
              <div style={{
                background: 'rgba(107,45,139,0.15)',
                border: '2px solid #ffd700',
                padding: '22px 22px',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                <div className="rp-title" style={{ color: '#ffd700', marginBottom: 18 }}>
                  {report.title}
                </div>
                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #6b2d8b, transparent)',
                  marginBottom: 18,
                }} />
                <div className="rp-body" style={{ color: '#f0e6ff' }}>
                  {report.coreMessage}
                </div>
              </div>

              {/* ── DIRECTION ── */}
              {report.direction && (
                <div style={{
                  background: 'rgba(255,215,0,0.06)',
                  border: '2px solid #ffd700',
                  padding: '20px 22px',
                  marginBottom: 20,
                }}>
                  <div className="rp-xs" style={{ color: '#ffd700', marginBottom: 12, letterSpacing: 2 }}>
                    ▶ 카드가 가리키는 방향
                  </div>
                  <div className="rp-body" style={{ color: '#ffd700' }}>
                    {report.direction}
                  </div>
                </div>
              )}

              {/* ── CARDS ── */}
              <div className="rp-xs" style={{ color: '#ffd700', marginBottom: 12, letterSpacing: 2 }}>
                ▶ 카드 리딩
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {cards.map((c, i) => (
                  <div key={i} style={{
                    background: 'rgba(27,10,46,0.7)',
                    border: '1px solid #3d1a6e',
                    padding: '18px',
                    display: 'flex', gap: 18, alignItems: 'flex-start',
                  }}>
                    {/* Card image */}
                    <div style={{ flexShrink: 0 }}>
                      <TarotCard card={c.card} faceDown={false} size="sm" />
                    </div>

                    {/* Card info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Position */}
                      <div className="rp-xs" style={{ color: '#9b7fc4', marginBottom: 10 }}>
                        {c.positionLabel}
                      </div>

                      {/* Card name — most prominent element */}
                      <div className="card-name-block">
                        <div className="rp-card" style={{ color: '#ffd700' }}>
                          {c.card?.korName}
                        </div>
                        {c.card?.isReversed && (
                          <div className="rp-xs" style={{ color: '#ff8c8c', marginTop: 4 }}>
                            역방향
                          </div>
                        )}
                      </div>

                      {/* Card summary */}
                      {report.cardSummaries?.[i] && (
                        <div className="rp-sm" style={{ color: '#c5a3f5' }}>
                          {report.cardSummaries[i]}
                        </div>
                      )}

                      {/* User answer */}
                      {c.userAnswer && (
                        <div className="rp-xs" style={{
                          color: 'rgba(197,163,245,0.5)',
                          marginTop: 10,
                          borderTop: '1px solid rgba(107,45,139,0.2)',
                          paddingTop: 8,
                        }}>
                          나의 답변: "{c.userAnswer}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── ADVICE ── */}
              {report.advice?.length > 0 && (
                <>
                  <div className="rp-xs" style={{ color: '#ffd700', marginBottom: 12, letterSpacing: 2 }}>
                    ▶ 아이라의 조언
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                    {report.advice.map((a, i) => (
                      <div key={i} style={{
                        background: 'rgba(107,45,139,0.12)',
                        borderLeft: '3px solid #6b2d8b',
                        padding: '16px 18px',
                        display: 'flex', gap: 14, alignItems: 'flex-start',
                      }}>
                        <span className="rp-sm" style={{ color: '#ffd700', flexShrink: 0 }}>
                          {i + 1}.
                        </span>
                        <span className="rp-sm" style={{ color: '#f0e6ff' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── CLOSING ── */}
              {report.closingWords && (
                <div style={{
                  textAlign: 'center',
                  padding: '32px 24px',
                  background: 'rgba(107,45,139,0.1)',
                  border: '1px solid rgba(107,45,139,0.4)',
                  marginBottom: 36,
                }}>
                  <div style={{ fontSize: 28, color: '#ffd700', marginBottom: 20 }}>✦</div>
                  <div className="rp-sm" style={{ color: '#f0e6ff', fontStyle: 'italic', marginBottom: 20 }}>
                    "{report.closingWords}"
                  </div>
                  <div className="rp-xs" style={{ color: '#9b7fc4' }}>— 아이라 (Aira)</div>
                </div>
              )}
            </>
          )}

          {/* ── CTA ── */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4a1a6e', marginBottom: 20, letterSpacing: 8, fontSize: 14 }}>✦ ✦ ✦</div>
            <button className="pixel-btn gold" onClick={() => window.location.href = '/'}>
              나도 해보기 →
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
