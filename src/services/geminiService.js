import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

// Wrap Firebase callable functions with error handling
function callable(name) {
  const fn = httpsCallable(functions, name);
  return async (data) => {
    try {
      const result = await fn(data);
      return result.data;
    } catch (err) {
      console.error(`[${name}] error:`, err);
      throw err;
    }
  };
}

// Tier 2: 심층 리딩 생성 (1카드 + 주역 → 개인화 해석)
// Returns { preview, blurredLength, paragraphCount, coreIssue }
export const generateDeepReading = callable('generateDeepReading');

// Tier 1: 무료 리딩 daily limit 확인 + reading doc 생성
// Returns { allowed: boolean, readingId?: string, reason?: string }
export const initFreeTierReading = callable('initFreeTierReading');

// Tier 3: 쓰리카드 카드별 해석 (buildup)
// Returns { reading: string, nextQuestion: string, suggestions: string[] }
export const readCard = callable('readCard');

// Tier 3: 쓰리카드 최종 리포트 생성
// Returns { report: { title, coreMessage, direction, cardSummaries, advice, closingWords } }
export const generateReport = callable('generateReport');

// 결제 검증 (토스페이먼츠)
// Returns { success: boolean, productType, readingId }
export const verifyTossPayment = callable('verifyTossPayment');
