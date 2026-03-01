import React, { useState, useEffect } from 'react';
import { verifyTossPayment } from '../services/geminiService';
import { saveInitialReading, saveSpreadSelection, getDeepReading } from '../services/firestoreService';
import DeepResultScene from './DeepResultScene';
import Scene6Reading from './Scene6Reading';
import Scene7Report from './Scene7Report';

const font = "'Press Start 2P', monospace";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [ctx, setCtx] = useState(null);
  const [deepReading, setDeepReading] = useState(null);
  const [scene, setScene] = useState('paid'); // paid | reading | report
  const [finalCards, setFinalCards] = useState([]);

  useEffect(() => {
    async function run() {
      // 1. Parse URL params
      const params = new URLSearchParams(window.location.search);
      const paymentKey = params.get('paymentKey');
      const orderId = params.get('orderId');
      const amount = Number(params.get('amount'));

      if (!paymentKey || !orderId || !amount) {
        setErrorMsg('결제 정보가 없어.');
        setStatus('error');
        return;
      }

      // 2. Load payment context from sessionStorage
      let context = null;
      try {
        const raw = sessionStorage.getItem('tpPaymentCtx');
        if (raw) context = JSON.parse(raw);
      } catch (e) {}
      if (!context) {
        setErrorMsg('결제 컨텍스트가 없어. 다시 시도해줘.');
        setStatus('error');
        return;
      }
      setCtx(context);

      // 3. Verify payment (dev_mock이면 스킵)
      if (paymentKey !== 'dev_mock') {
        try {
          await verifyTossPayment({
            paymentKey,
            orderId,
            amount,
            readingId: context.readingId || null,
            sessionId: context.sessionId || null,
            productType: context.productType,
          });
        } catch (err) {
          setErrorMsg('결제 검증 실패: ' + (err.message || '알 수 없는 오류'));
          setStatus('error');
          return;
        }
      }

      // 4. Post-payment setup
      if (context.productType === 'single_deep' && context.readingId) {
        try {
          const reading = await getDeepReading(context.readingId);
          setDeepReading(reading);
        } catch (e) {}
      }

      if (context.productType === 'three_card' && context.sessionId) {
        // Save initial reading + spread to Firestore
        try {
          if (context.initialCard) {
            await saveInitialReading(
              context.sessionId,
              context.initialCard,
              context.initialHexagram || null,
              '',
              context.coreIssue || '',
            );
          }
          await saveSpreadSelection(context.sessionId, context.spreadType || 'threeCard');
        } catch (e) {
          console.error('saveInitialReading error:', e);
        }
        setScene('reading');
      }

      sessionStorage.removeItem('tpPaymentCtx');
      setStatus('success');
    }
    run();
  }, []);

  // ── Loading ────────────────────────────────────────────────────────
  if (status === 'verifying') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0020', gap: 16 }}>
        <div style={{ fontFamily: font, fontSize: 'var(--px-md)', color: '#c5a3f5' }}>결제 확인 중...</div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0020', gap: 20, padding: 24 }}>
        <div style={{ fontSize: 36, color: '#ff6b6b' }}>✕</div>
        <div style={{ fontFamily: font, fontSize: 'var(--px-md)', color: '#ff6b6b', textAlign: 'center', lineHeight: 2 }}>
          {errorMsg}
        </div>
        <a href="/" style={{ fontFamily: font, fontSize: 'var(--px-sm)', color: '#ffd700', textDecoration: 'none', border: '1px solid #ffd700', padding: '10px 20px' }}>
          ↩ 홈으로
        </a>
      </div>
    );
  }

  // ── Success: three_card → Scene6Reading ───────────────────────────
  if (status === 'success' && ctx?.productType === 'three_card') {
    if (scene === 'reading') {
      return (
        <div style={{ width: '100%', height: '100vh', overflowY: 'auto', background: '#0d0020' }}>
          <Scene6Reading
            sessionId={ctx.sessionId}
            question={ctx.question}
            coreIssue={ctx.coreIssue || ''}
            spreadType={ctx.spreadType || 'threeCard'}
            spreadName={ctx.spreadName || '과거·현재·미래'}
            positions={ctx.positions || ['과거', '현재', '미래']}
            cardCount={ctx.cardCount || 3}
            onNext={({ cards }) => { setFinalCards(cards); setScene('report'); }}
          />
        </div>
      );
    }
    if (scene === 'report') {
      return (
        <div style={{ width: '100%', height: '100vh', overflowY: 'auto', background: '#0d0020' }}>
          <Scene7Report
            sessionId={ctx.sessionId}
            question={ctx.question}
            spreadName={ctx.spreadName || '과거·현재·미래'}
            cards={finalCards}
            coreIssue={ctx.coreIssue || ''}
          />
        </div>
      );
    }
  }

  // ── Success: single_deep → DeepResultScene ────────────────────────
  if (status === 'success' && ctx?.productType === 'single_deep') {
    return (
      <div style={{ width: '100%', height: '100vh', overflowY: 'auto', background: '#0d0020' }}>
        <DeepResultScene
          card={ctx.initialCard || null}
          question={ctx.question || ''}
          fullText={deepReading?.fullText || ''}
          coreIssue={deepReading?.coreIssue || ''}
          onRestart={() => { window.location.href = '/'; }}
        />
      </div>
    );
  }

  return null;
}
