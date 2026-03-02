import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export async function initUserLua() {
  const fn = httpsCallable(functions, 'initUserIfNeeded');
  const result = await fn({});
  return result.data; // { lua, isNew, lastVisitAt }
}

export async function checkDailyOracle() {
  const fn = httpsCallable(functions, 'checkDailyOracle');
  const result = await fn({});
  return result.data; // { allowed: boolean }
}

export async function spendLua(amount = 1) {
  const fn = httpsCallable(functions, 'spendLua');
  const result = await fn({ amount });
  return result.data; // { lua: number }
}
