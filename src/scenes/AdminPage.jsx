import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  adminGetUsers,
  adminAdjustLua,
  adminGetUserSessions,
  adminGetMessages,
  adminReplyMessage,
} from '../services/luaService';

const font = "'Press Start 2P', monospace";

const SPREAD_LABELS = { oneCard: '1괘', threeCard: '쓰리카드', celticCross: '셀틱 크로스' };

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Clean underline-style tab button
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: font, fontSize: '12px',
        background: 'none', border: 'none',
        borderBottom: active ? '2px solid #ffd700' : '2px solid transparent',
        color: active ? '#ffd700' : '#6b5080',
        paddingBottom: 8, paddingLeft: 0, paddingRight: 0, marginRight: 28,
        cursor: 'pointer',
        transition: 'color 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// Small pill filter button
function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: font, fontSize: '10px',
        background: active ? 'rgba(255,215,0,0.12)' : 'transparent',
        border: `1px solid ${active ? '#ffd700' : '#3d1a6e'}`,
        color: active ? '#ffd700' : '#6b5080',
        padding: '6px 14px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [search, setSearch] = useState('');

  const [adjustMap, setAdjustMap] = useState({});
  const [expandedSessions, setExpandedSessions] = useState({});
  const [loadingSessions, setLoadingSessions] = useState({});

  const [replyMap, setReplyMap] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [msgFilter, setMsgFilter] = useState('unanswered');

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, msgsRes] = await Promise.all([
          adminGetUsers(),
          adminGetMessages(),
        ]);
        setUsers(usersRes.data.users || []);
        setMessages(msgsRes.data.messages || []);
      } catch (e) {
        if (e.message?.includes('Unauthorized') || e.code === 'functions/permission-denied') {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAdjust(uid, delta) {
    if (!delta || isNaN(delta)) return;
    try {
      const res = await adminAdjustLua({ targetUid: uid, delta: Number(delta) });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, lua: res.data.newBalance } : u));
      setAdjustMap(prev => ({ ...prev, [uid]: '' }));
    } catch (e) {
      alert('루나 조정 실패: ' + e.message);
    }
  }

  async function toggleSessions(uid) {
    if (expandedSessions[uid]) {
      setExpandedSessions(prev => { const n = { ...prev }; delete n[uid]; return n; });
      return;
    }
    setLoadingSessions(prev => ({ ...prev, [uid]: true }));
    try {
      const res = await adminGetUserSessions({ targetUid: uid });
      setExpandedSessions(prev => ({ ...prev, [uid]: res.data.sessions || [] }));
    } catch (e) {
      alert('세션 조회 실패');
    } finally {
      setLoadingSessions(prev => ({ ...prev, [uid]: false }));
    }
  }

  async function handleReply(msgId) {
    const reply = replyMap[msgId]?.trim();
    if (!reply) return;
    setSendingReply(prev => ({ ...prev, [msgId]: true }));
    try {
      await adminReplyMessage({ messageId: msgId, reply });
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, reply, repliedAt: { seconds: Date.now() / 1000 } } : m
      ));
      setReplyMap(prev => ({ ...prev, [msgId]: '' }));
    } catch (e) {
      alert('답변 실패: ' + e.message);
    } finally {
      setSendingReply(prev => ({ ...prev, [msgId]: false }));
    }
  }

  const containerStyle = {
    maxWidth: 720, margin: '0 auto',
    padding: '36px 28px 100px',
    fontFamily: font,
    boxSizing: 'border-box',
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 100 }}>
        <div style={{ fontSize: '13px', color: '#c5a3f5' }}>
          로딩 중<span className="loading-dot">.</span><span className="loading-dot">.</span><span className="loading-dot">.</span>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 100 }}>
        <div style={{ fontSize: 32, color: '#ff6b6b', marginBottom: 20 }}>✕</div>
        <div style={{ fontSize: '13px', color: '#ff6b6b', lineHeight: 2.2 }}>
          접근 권한이 없어.<br />어드민만 볼 수 있어.
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (u.email || '').toLowerCase().includes(s) ||
           (u.displayName || '').toLowerCase().includes(s);
  });

  const unansweredCount = messages.filter(m => !m.reply).length;
  const filteredMessages = msgFilter === 'unanswered'
    ? messages.filter(m => !m.reply)
    : messages;

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: '16px', color: '#ffd700', letterSpacing: 2 }}>★ 어드민</div>
        <button
          style={{
            fontFamily: font, fontSize: '11px',
            background: 'transparent', border: '1px solid #3d1a6e',
            color: '#6b5080', padding: '8px 16px', cursor: 'pointer',
          }}
          onClick={() => signOut(auth).then(() => { window.location.href = '/'; })}
        >
          로그아웃
        </button>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #3d1a6e', marginBottom: 28 }}>
        <TabBtn active={tab === 'users'} onClick={() => setTab('users')}>
          유저 ({users.length}명)
        </TabBtn>
        <TabBtn active={tab === 'messages'} onClick={() => setTab('messages')}>
          문의함{unansweredCount > 0 ? ` · 미답변 ${unansweredCount}` : ''}
        </TabBtn>
      </div>

      {/* ── 유저 탭 ── */}
      {tab === 'users' && (
        <div>
          <input
            className="pixel-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이메일 / 이름 검색..."
            style={{ marginBottom: 20, fontSize: '12px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredUsers.map(u => (
              <div key={u.uid} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #2a1040',
                padding: '18px 20px',
              }}>
                {/* User info row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#f0e6ff', marginBottom: 5 }}>
                      {u.displayName || '(이름 없음)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#7b60a0', lineHeight: 1.8 }}>{u.email || '(이메일 없음)'}</div>
                    <div style={{ fontSize: '10px', color: '#4a3060', marginTop: 3 }}>
                      가입: {formatDate(u.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', color: '#ffd700' }}>♦ {u.lua ?? '?'}</div>
                    <div style={{ fontSize: '10px', color: '#7b60a0', marginTop: 3 }}>루나</div>
                  </div>
                </div>

                {/* Lua adjustment */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="number"
                    min="1"
                    value={adjustMap[u.uid] || ''}
                    onChange={e => setAdjustMap(prev => ({ ...prev, [u.uid]: e.target.value }))}
                    placeholder="수량"
                    style={{
                      fontFamily: font, fontSize: '11px', width: 80,
                      background: 'rgba(0,0,0,0.3)', border: '1px solid #3d1a6e',
                      color: '#f0e6ff', padding: '7px 10px', outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleAdjust(u.uid, Math.abs(Number(adjustMap[u.uid])))}
                    style={{
                      fontFamily: font, fontSize: '10px',
                      background: 'rgba(184,134,11,0.2)', border: '1px solid #b8860b',
                      color: '#ffd700', padding: '8px 14px', cursor: 'pointer',
                    }}
                  >
                    + 충전
                  </button>
                  <button
                    onClick={() => handleAdjust(u.uid, -Math.abs(Number(adjustMap[u.uid])))}
                    style={{
                      fontFamily: font, fontSize: '10px',
                      background: 'rgba(255,107,107,0.1)', border: '1px solid #7a3030',
                      color: '#ff9090', padding: '8px 14px', cursor: 'pointer',
                    }}
                  >
                    − 차감
                  </button>
                  <button
                    onClick={() => toggleSessions(u.uid)}
                    style={{
                      fontFamily: font, fontSize: '10px',
                      background: 'transparent', border: '1px solid #3d1a6e',
                      color: '#7b60a0', padding: '8px 14px', cursor: 'pointer',
                    }}
                  >
                    {loadingSessions[u.uid] ? '...' : expandedSessions[u.uid] ? '▲ 닫기' : '▼ 세션'}
                  </button>
                </div>

                {/* Session list */}
                {expandedSessions[u.uid] && (
                  <div style={{ borderTop: '1px solid #2a1040', marginTop: 14, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {expandedSessions[u.uid].length === 0 ? (
                      <div style={{ fontSize: '11px', color: '#4a3060' }}>세션 없음</div>
                    ) : expandedSessions[u.uid].map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <div>
                          <span style={{ fontSize: '10px', color: '#7b60a0', marginRight: 10 }}>
                            {formatDate(s.createdAt)}
                          </span>
                          <span style={{ fontSize: '11px', color: '#c5a3f5' }}>
                            "{(s.question || '').slice(0, 28)}{(s.question || '').length > 28 ? '...' : ''}"
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#ffd700' }}>
                            {SPREAD_LABELS[s.spreadType] || s.spreadType || '?'}
                          </span>
                          {s.isPublic && (
                            <a
                              href={`/report/${s.id}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontFamily: font, fontSize: '10px',
                                color: '#c5a3f5', textDecoration: 'none',
                                border: '1px solid #3d1a6e', padding: '3px 9px',
                              }}
                            >
                              보기
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#4a3060', padding: 32 }}>
                검색 결과 없음
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 문의함 탭 ── */}
      {tab === 'messages' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <FilterBtn active={msgFilter === 'unanswered'} onClick={() => setMsgFilter('unanswered')}>미답변만</FilterBtn>
            <FilterBtn active={msgFilter === 'all'} onClick={() => setMsgFilter('all')}>전체</FilterBtn>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMessages.map(m => (
              <div key={m.id} style={{
                background: m.reply ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${m.reply ? '#2a1040' : '#3d1a6e'}`,
                padding: '18px 20px',
              }}>
                {/* Sender */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#f0e6ff', marginRight: 10 }}>
                      {m.userDisplayName || '(이름 없음)'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#7b60a0' }}>{m.userEmail}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#4a3060' }}>{formatDate(m.createdAt)}</span>
                </div>

                {/* Content */}
                <div style={{
                  fontSize: '12px', color: '#c5a3f5', lineHeight: 2,
                  background: 'rgba(0,0,0,0.2)', padding: '10px 12px', marginBottom: 12,
                }}>
                  {m.content}
                </div>

                {/* Reply */}
                {m.reply ? (
                  <div style={{ borderTop: '1px solid #2a1040', paddingTop: 12 }}>
                    <div style={{ fontSize: '10px', color: '#ffd700', marginBottom: 6 }}>
                      ★ 아이라의 답변 ({formatDate(m.repliedAt)})
                    </div>
                    <div style={{ fontSize: '12px', color: '#f0e6ff', lineHeight: 2 }}>
                      {m.reply}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea
                      value={replyMap[m.id] || ''}
                      onChange={e => setReplyMap(prev => ({ ...prev, [m.id]: e.target.value }))}
                      placeholder="답변을 입력해..."
                      style={{
                        fontFamily: font, fontSize: '11px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid #3d1a6e',
                        color: '#f0e6ff', padding: '10px', resize: 'none', height: 80,
                        outline: 'none', lineHeight: 1.8, width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      disabled={!replyMap[m.id]?.trim() || sendingReply[m.id]}
                      onClick={() => handleReply(m.id)}
                      style={{
                        fontFamily: font, fontSize: '11px',
                        background: 'rgba(184,134,11,0.2)', border: '1px solid #b8860b',
                        color: replyMap[m.id]?.trim() ? '#ffd700' : '#4a3060',
                        padding: '10px 18px', cursor: replyMap[m.id]?.trim() ? 'pointer' : 'default',
                        alignSelf: 'flex-start',
                        transition: 'all 0.15s',
                      }}
                    >
                      {sendingReply[m.id] ? '전송 중...' : '답장 보내기 ▶'}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#4a3060', padding: 32 }}>
                {msgFilter === 'unanswered' ? '미답변 문의 없음' : '문의 없음'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
