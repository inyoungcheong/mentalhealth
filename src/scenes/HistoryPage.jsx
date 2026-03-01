import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserSessions, sendMessage, getMyMessages } from '../services/firestoreService';

const font = "'Press Start 2P', monospace";

const SPREAD_LABELS = {
  oneCard: '1괘',
  threeCard: '쓰리카드',
  celticCross: '셀틱 크로스',
};

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function HistoryPage({ user }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Message state
  const [messages, setMessages] = useState([]);
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      getUserSessions(user.uid).catch(() => { setError('기록을 불러오는 데 실패했어.'); return []; }),
      getMyMessages(user.uid).catch(() => []),
    ])
      .then(([sess, msgs]) => { setSessions(sess); setMessages(msgs); })
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSendMessage() {
    if (!msgContent.trim()) return;
    setSendingMsg(true);
    try {
      await sendMessage(user, msgContent.trim());
      setMsgSent(true);
      setMsgContent('');
      setShowMsgForm(false);
      // Refresh messages
      const msgs = await getMyMessages(user.uid);
      setMessages(msgs);
    } catch (e) {
      alert('전송 실패: ' + e.message);
    } finally {
      setSendingMsg(false);
    }
  }

  const containerStyle = {
    width: '100%',
    maxWidth: 620, margin: '0 auto',
    padding: '32px 20px 60px', boxSizing: 'border-box',
    fontFamily: font,
  };

  // Not logged in
  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 28, color: '#ffd700', marginBottom: 20 }}>✦</div>
          <div style={{ fontSize: 'var(--px-lg)', color: '#c5a3f5', lineHeight: 2 }}>
            기록을 보려면 로그인이 필요해.
          </div>
          <div style={{ marginTop: 24 }}>
            <button
              className="pixel-btn"
              onClick={() => window.location.href = '/'}
              style={{ fontSize: 'var(--px-sm)' }}
            >
              ↩ 홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ ...containerStyle, paddingTop: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--px-md)', color: '#c5a3f5', lineHeight: 2 }}>
          기록 불러오는 중
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 24, color: '#ffd700', marginBottom: 12, letterSpacing: 6 }}>✦ ✦ ✦</div>
        <div style={{ fontSize: 'var(--px-lg)', color: '#ffd700', lineHeight: 1.9 }}>내 리딩 기록</div>
        <div style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4', marginTop: 10, lineHeight: 2 }}>
          {user.displayName || user.email}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            className="pixel-btn secondary"
            onClick={() => window.location.href = '/'}
            style={{ fontSize: 'var(--px-sm)' }}
          >
            ↩ 홈으로
          </button>
          <button
            className="pixel-btn secondary"
            onClick={() => signOut(auth).then(() => { window.location.href = '/'; })}
            style={{ fontSize: 'var(--px-sm)' }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', fontSize: 'var(--px-sm)', color: '#ff6b6b', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && sessions.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          border: '1px solid #3d1a6e', background: 'rgba(27,10,46,0.5)',
        }}>
          <div style={{ fontSize: 24, color: '#6b2d8b', marginBottom: 16 }}>✦</div>
          <div style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4', lineHeight: 2 }}>
            아직 리딩 기록이 없어.<br />
            첫 여정을 시작해봐.
          </div>
        </div>
      )}

      {/* Message sent confirmation */}
      {msgSent && (
        <div style={{ fontSize: 'var(--px-sm)', color: '#7dff7d', textAlign: 'center', marginBottom: 16, lineHeight: 2 }}>
          ✓ 문의가 전송됐어. 곧 답변이 올 거야.
        </div>
      )}

      {/* Session list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sessions.map(s => (
          <div key={s.id} style={{
            background: 'rgba(27,10,46,0.6)',
            border: '1px solid #3d1a6e',
            padding: '16px 18px',
          }}>
            {/* Date + spread */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 10, flexWrap: 'wrap', gap: 8,
            }}>
              <span style={{ fontSize: 'var(--px-sm)', color: '#9b7fc4' }}>
                {formatDate(s.createdAt)}
              </span>
              <span style={{
                fontSize: 'var(--px-sm)', color: '#ffd700',
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid #ffd70033',
                padding: '2px 8px',
              }}>
                {SPREAD_LABELS[s.spreadType] || s.spreadType || '?'}
              </span>
            </div>

            {/* Question */}
            <div style={{ fontSize: 'var(--px-sm)', color: '#f0e6ff', lineHeight: 2, marginBottom: 12 }}>
              "{s.question}"
            </div>

            {/* Report link */}
            {s.isPublic ? (
              <a
                href={`/report/${s.id}`}
                style={{
                  display: 'inline-block',
                  fontFamily: font, fontSize: 'var(--px-sm)',
                  color: '#ffd700', textDecoration: 'none',
                  border: '1px solid #ffd70055',
                  padding: '6px 14px',
                  background: 'rgba(255,215,0,0.06)',
                }}
              >
                리포트 보기 →
              </a>
            ) : (
              <span style={{ fontSize: 'var(--px-sm)', color: '#555' }}>
                (리포트 없음)
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── 문의하기 섹션 ── */}
      <div style={{ marginTop: 40, borderTop: '1px solid #3d1a6e', paddingTop: 28 }}>
        <div style={{ fontSize: 'var(--px-md)', color: '#ffd700', marginBottom: 16 }}>✉ 문의하기</div>

        {/* My messages */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {messages.map(m => (
              <div key={m.id} style={{
                background: 'rgba(27,10,46,0.5)',
                border: '1px solid #3d1a6e',
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: 'var(--px-xs)', color: '#6b5080', marginBottom: 6 }}>
                  {m.createdAt?.seconds
                    ? new Date(m.createdAt.seconds * 1000).toLocaleDateString('ko-KR')
                    : ''}
                </div>
                <div style={{ fontSize: 'var(--px-sm)', color: '#c5a3f5', lineHeight: 2, marginBottom: m.reply ? 10 : 0 }}>
                  {m.content}
                </div>
                {m.reply && (
                  <div style={{ borderTop: '1px solid #3d1a6e', paddingTop: 8 }}>
                    <div style={{ fontSize: 'var(--px-xs)', color: '#ffd700', marginBottom: 4 }}>★ 아이라의 답변</div>
                    <div style={{ fontSize: 'var(--px-sm)', color: '#f0e6ff', lineHeight: 2 }}>{m.reply}</div>
                  </div>
                )}
                {!m.reply && (
                  <div style={{ fontSize: 'var(--px-xs)', color: '#555', marginTop: 6 }}>답변 대기 중...</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New message form */}
        {showMsgForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              value={msgContent}
              onChange={e => setMsgContent(e.target.value)}
              placeholder="루나 관련 문의, 리딩 관련 질문 등 무엇이든..."
              style={{
                fontFamily: font, fontSize: 'var(--px-sm)',
                background: 'rgba(27,10,46,0.8)', border: '1px solid #6b2d8b',
                color: '#f0e6ff', padding: '10px', resize: 'none', height: 90,
                outline: 'none', lineHeight: 1.8, width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="pixel-btn gold"
                style={{ fontSize: 'var(--px-sm)' }}
                disabled={!msgContent.trim() || sendingMsg}
                onClick={handleSendMessage}
              >
                {sendingMsg ? '전송 중...' : '보내기 ▶'}
              </button>
              <button
                className="pixel-btn secondary"
                style={{ fontSize: 'var(--px-sm)' }}
                onClick={() => { setShowMsgForm(false); setMsgContent(''); }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            className="pixel-btn secondary"
            style={{ fontSize: 'var(--px-sm)' }}
            onClick={() => setShowMsgForm(true)}
          >
            + 새 문의 보내기
          </button>
        )}
      </div>
    </div>
  );
}
