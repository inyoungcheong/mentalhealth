import {
  collection, doc, addDoc, updateDoc, getDoc, serverTimestamp, arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase';

// Create a new reading session
export async function createSession(userId, question) {
  const ref = await addDoc(collection(db, 'sessions'), {
    userId,
    question,
    state: 'initial',
    initialCard: null,
    hexagram: null,
    initialInterpretation: null,
    coreIssue: null,
    spreadType: null,
    cards: [],
    answers: [],
    report: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isPublic: false,
  });
  return ref.id;
}

// Save initial card + hexagram + interpretation
export async function saveInitialReading(sessionId, card, hexagram, interpretation, coreIssue) {
  const ref = doc(db, 'sessions', sessionId);
  await updateDoc(ref, {
    initialCard: card,
    hexagram,
    initialInterpretation: interpretation,
    coreIssue,
    state: 'spread_pick',
    updatedAt: serverTimestamp(),
  });
}

// Save selected spread type
export async function saveSpreadSelection(sessionId, spreadType) {
  const ref = doc(db, 'sessions', sessionId);
  await updateDoc(ref, {
    spreadType,
    state: 'reading',
    updatedAt: serverTimestamp(),
  });
}

// Append a drawn card with its reading
export async function appendCard(sessionId, cardEntry) {
  // cardEntry: { card, position, positionLabel, reading, question }
  const ref = doc(db, 'sessions', sessionId);
  await updateDoc(ref, {
    cards: arrayUnion(cardEntry),
    updatedAt: serverTimestamp(),
  });
}

// Append user's answer to a card question
export async function appendAnswer(sessionId, answerEntry) {
  // answerEntry: { cardIndex, question, answer }
  const ref = doc(db, 'sessions', sessionId);
  await updateDoc(ref, {
    answers: arrayUnion(answerEntry),
    updatedAt: serverTimestamp(),
  });
}

// Save final report and make session public
export async function saveReport(sessionId, report) {
  const ref = doc(db, 'sessions', sessionId);
  await updateDoc(ref, {
    report,
    state: 'complete',
    isPublic: true,
    updatedAt: serverTimestamp(),
  });
}

// Get public report by session ID
export async function getReport(sessionId) {
  const ref = doc(db, 'sessions', sessionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (!data.isPublic && !data.report) return null;
  return { id: snap.id, ...data };
}

// Get full session (for logged-in user)
export async function getSession(sessionId) {
  const ref = doc(db, 'sessions', sessionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
