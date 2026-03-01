import React, { useEffect, useState } from 'react';
import { generateReport } from '../services/geminiService';
import { saveReport } from '../services/firestoreService';
import TarotCard from '../components/TarotCard';

export default function Scene7Report({ sessionId, question, spreadName, cards, coreIssue = '' }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function buildReport() {
      try {
        const answers = cards.map(c => ({
          question: c.positionLabel,
          answer: c.userAnswer || '',
        }));

        const result = await generateReport({
          question,
          coreIssue,
          spreadName,
          cards,
          answers,
        });
        setReport(result.report);

        if (sessionId) {
          await saveReport(sessionId, result.report);
          setShareUrl(`${window.location.origin}/report/${sessionId}`);
        }
      } catch (err) {
        setReport({
          title: '당신의 타로 여정',
          coreMessage: '카드들이 말했습니다. 이제 당신의 차례입니다.',
          direction: '',
          cardSummaries: cards.map(c => `${c.positionLabel}: ${c.card?.korName || '?'}`),
          advice: ['하루하루 조금씩 나아가세요.', '직관을 믿으세요.', '지금 이 순간에 집중하세요.'],
          closingWords: '당신의 길은 당신만이 알고 있어.',
        });
      } finally {
        setLoading(false);
      }
    }
    buildReport();
  }, []);

  async function handleCopyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 20, fontFamily: "'Press Start 2P'", color: '#c5a3f5',
      }}>
        <div style={{ fontSize: 48 }}>✦</div>
        <div style={{ fontSize: 'var(--px-md)', lineHeight: 2 }}>
          최종 리포트 작성 중
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(180deg, #0d0020, #1a0a2e)',
      overflowY: 'auto',
      padding: '24px 20px 40px',
      fontFamily: "'Press Start 2P'",
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 32, color: '#ffd700', marginBottom: 12, letterSpacing: 8 }}>✦ ✦ ✦</div>
        <div style={{ fontSize: '16px', color: '#ffd700', lineHeight: 1.9 }}>
          {report?.title || '당신의 타로 여정'}
        </div>
        <div style={{ fontSize: 'var(--px-md)', color: '#9b7fc4', marginTop: 10, lineHeight: 1.8 }}>
          "{question}"
        </div>
      </div>

      {/* Core message */}
      <div style={{
        background: 'rgba(107,45,139,0.2)', border: '2px solid #6b2d8b',
        padding: '16px 18px', marginBottom: 20,
      }}>
        <div style={{ fontSize: 'var(--px-md)', color: '#ffd700', marginBottom: 10 }}>▶ 핵심 메시지</div>
        <div style={{ fontSize: 'var(--px-lg)', color: '#f0e6ff', lineHeight: 2 }}>
          {report?.coreMessage}
        </div>
      </div>

      {/* Direction */}
      {report?.direction && (
        <div style={{
          background: 'rgba(255,215,0,0.07)', border: '2px solid #ffd700',
          padding: '14px 18px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 'var(--px-md)', color: '#ffd700', marginBottom: 10 }}>▶ 카드가 가리키는 방향</div>
          <div style={{ fontSize: 'var(--px-lg)', color: '#ffd700', lineHeight: 2 }}>
            {report.direction}
          </div>
        </div>
      )}

      {/* Cards summary */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 'var(--px-md)', color: '#ffd700', marginBottom: 12 }}>▶ 카드 리딩 요약</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: 'rgba(27,10,46,0.5)', border: '1px solid #3d1a6e',
              padding: '12px 14px',
            }}>
              <div style={{ flexShrink: 0 }}>
                <TarotCard card={c.card} faceDown={false} size="sm" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--px-sm)', color: '#ffd700', marginBottom: 6 }}>
                  {c.positionLabel} — {c.card?.korName}
                  {c.card?.isReversed && <span style={{ color: '#ff8c8c', marginLeft: 6 }}>(역)</span>}
                </div>
                <div style={{ fontSize: 'var(--px-md)', color: '#c5a3f5', lineHeight: 1.9 }}>
                  {report?.cardSummaries?.[i] || c.reading}
                </div>
                {c.userAnswer && (
                  <div style={{ fontSize: 'var(--px-sm)', color: 'rgba(197,163,245,0.5)', marginTop: 6, borderTop: '1px solid rgba(107,45,139,0.3)', paddingTop: 6 }}>
                    답변: "{c.userAnswer}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advice */}
      {report?.advice?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 'var(--px-md)', color: '#ffd700', marginBottom: 12 }}>▶ 아이라의 조언</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.advice.map((a, i) => (
              <div key={i} style={{
                fontSize: 'var(--px-md)', color: '#f0e6ff', lineHeight: 1.9,
                padding: '10px 14px',
                borderLeft: '3px solid #6b2d8b',
                background: 'rgba(107,45,139,0.1)',
              }}>
                {i + 1}. {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closing words */}
      {report?.closingWords && (
        <div style={{
          textAlign: 'center', padding: '20px',
          background: 'rgba(107,45,139,0.15)', border: '1px solid #6b2d8b',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 20, color: '#ffd700', marginBottom: 12 }}>✦</div>
          <div style={{ fontSize: 'var(--px-lg)', color: '#f0e6ff', lineHeight: 2 }}>
            "{report.closingWords}"
          </div>
          <div style={{ fontSize: 'var(--px-md)', color: '#9b7fc4', marginTop: 10 }}>— 아이라 (Aira)</div>
        </div>
      )}

      {/* Share */}
      {shareUrl && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          padding: '16px', border: '2px solid #ffd700',
          background: 'rgba(255,215,0,0.05)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 'var(--px-md)', color: '#ffd700' }}>리딩 결과 공유하기</div>
          <div style={{
            fontSize: 'var(--px-sm)', color: '#c5a3f5',
            padding: '8px 12px', background: 'rgba(27,10,46,0.8)',
            border: '1px solid #6b2d8b', wordBreak: 'break-all',
            maxWidth: '100%', lineHeight: 1.8,
          }}>
            {shareUrl}
          </div>
          <button className="pixel-btn gold" onClick={handleCopyLink} style={{ fontSize: 'var(--px-md)' }}>
            {copied ? '✓ 복사됨!' : '🔗 링크 복사'}
          </button>
        </div>
      )}

      {/* Restart + History */}
      <div style={{ textAlign: 'center', paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <button
          className="pixel-btn secondary"
          onClick={() => window.location.href = '/history'}
          style={{ fontSize: 'var(--px-md)' }}
        >
          📜 내 기록 보기
        </button>
        <button
          className="pixel-btn secondary"
          onClick={() => window.location.reload()}
          style={{ fontSize: 'var(--px-md)' }}
        >
          ↩ 새 여정 시작
        </button>
      </div>
    </div>
  );
}
