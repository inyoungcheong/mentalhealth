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

// Step 3: Oracle reading (pre-login) — tarot + I Ching → verdict + direct answer + deeper hook
// Returns { verdict, verdictText, answer, coreIssue, deeperHook }
export const oracleReading = callable('oracleReading');

// Step 4: Identify core issue (fallback, mainly oracle provides coreIssue)
// Returns { coreIssue: string }
export const analyzeIssue = callable('analyzeIssue');

// Step 5: Recommend a spread (oneCard / threeCard / celticCross only)
// Returns { spreadType, spreadName, reason, positions, cardCount }
export const recommendSpread = callable('recommendSpread');

// Step 6: Read a single card in context (buildup — references all previous answers)
// Returns { reading: string, nextQuestion: string }
export const readCard = callable('readCard');

// Step 7: Generate final report
// Returns { report: { title, coreMessage, cardSummaries, advice, closingWords } }
export const generateReport = callable('generateReport');
