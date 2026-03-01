const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || '';

async function loadTossScript() {
  if (window.TossPayments) return window.TossPayments;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://js.tosspayments.com/v1/payment';
    s.onload = () => resolve(window.TossPayments);
    s.onerror = () => reject(new Error('Toss SDK 로드 실패'));
    document.head.appendChild(s);
  });
}

const IS_DEV_BYPASS = !CLIENT_KEY || CLIENT_KEY.includes('YOUR_CLIENT_KEY');

// Initiates Toss payment redirect.
// context is stored in sessionStorage so PaymentSuccessPage can restore state.
export async function requestTossPayment({ amount, orderId, orderName, customerName, context }) {
  sessionStorage.setItem('tpPaymentCtx', JSON.stringify(context));

  // Dev bypass: Toss 키 없으면 mock 결제 성공으로 바로 이동
  if (IS_DEV_BYPASS) {
    window.location.href = `/payment/success?paymentKey=dev_mock&orderId=${orderId}&amount=${amount}`;
    return;
  }

  const TossPayments = await loadTossScript();
  const toss = TossPayments(CLIENT_KEY);
  toss.requestPayment('카드', {
    amount,
    orderId,
    orderName,
    customerName: customerName || '사용자',
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`,
  });
}
