// 무료 티어 템플릿 리딩 엔진 — LLM 호출 없음, 순수 클라이언트 동기 실행

import { drawRandomCard } from './tarotCards';
import { generateHexagram } from './iching';
import {
  QUESTION_CATEGORIES,
  BRIDGE_PHRASES,
  FORTUNE_MESSAGES,
  SYNERGY_PHRASES,
} from './readingTemplates';

// ── 메이저 아르카나 길흉 가중치 (0~1)
const MAJOR_WEIGHTS = {
  0: 0.7,  // 바보
  1: 0.8,  // 마법사
  2: 0.7,  // 여사제
  3: 0.8,  // 여황제
  4: 0.65, // 황제
  5: 0.6,  // 교황
  6: 0.75, // 연인
  7: 0.75, // 전차
  8: 0.8,  // 힘
  9: 0.6,  // 은둔자
  10: 0.55, // 운명의 수레바퀴
  11: 0.6,  // 정의
  12: 0.45, // 매달린 사람
  13: 0.35, // 죽음
  14: 0.75, // 절제
  15: 0.25, // 악마
  16: 0.15, // 탑
  17: 0.85, // 별
  18: 0.35, // 달
  19: 0.95, // 태양
  20: 0.7,  // 심판
  21: 0.9,  // 세계
};

// 마이너 아르카나 번호별 가중치
const NUMBER_WEIGHTS = {
  1: 0.8,   // 에이스
  2: 0.6,
  3: 0.7,
  4: 0.55,
  5: 0.35,
  6: 0.7,
  7: 0.5,
  8: 0.6,
  9: 0.65,
  10: 0.5,
  11: 0.65, // 페이지
  12: 0.6,  // 나이트
  13: 0.75, // 퀸
  14: 0.7,  // 킹
};

const SUIT_BONUS = {
  cups: 0.05,
  pentacles: 0.05,
  wands: 0,
  swords: -0.05,
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * tarotCards.js에 fortuneWeight가 없으므로 카드 속성으로 추정
 */
function estimateCardFortune(card) {
  if (card.suit === 'major' && MAJOR_WEIGHTS[card.number] !== undefined) {
    const base = MAJOR_WEIGHTS[card.number];
    return card.isReversed ? (1 - base) * 0.7 + 0.15 : base;
  }
  const base = NUMBER_WEIGHTS[card.number] || 0.5;
  const adjusted = base + (SUIT_BONUS[card.suit] || 0);
  return card.isReversed ? (1 - adjusted) * 0.7 + 0.15 : adjusted;
}

/**
 * 카드 + 괘의 길흉 점수 합산 (카드 60% + 괘 40%)
 * hexagram.fortuneWeight가 없으므로 description 키워드로 간이 추정
 */
function estimateHexagramFortune(hexagram) {
  // 괘 번호 기반 기본 가중치 (King Wen 순서 기준 대략적 길흉)
  const positiveHexagrams = new Set([1, 2, 3, 11, 13, 14, 15, 16, 17, 19, 20, 24, 25, 34, 35, 42, 45, 46, 48, 50, 54, 55, 58, 63]);
  const negativeHexagrams = new Set([6, 12, 23, 29, 30, 33, 36, 38, 39, 47, 56, 57, 59, 60, 62, 64]);
  if (positiveHexagrams.has(hexagram.number)) return 0.7;
  if (negativeHexagrams.has(hexagram.number)) return 0.3;
  return 0.5;
}

function calculateFortune(card, hexagram) {
  const cardScore = estimateCardFortune(card);
  const hexScore = estimateHexagramFortune(hexagram);
  const rawScore = cardScore * 0.6 + hexScore * 0.4;
  const score = Math.round(rawScore * 100);

  let tier;
  if (score >= 80) tier = 'great_fortune';
  else if (score >= 60) tier = 'fortune';
  else if (score >= 40) tier = 'neutral';
  else if (score >= 20) tier = 'caution';
  else tier = 'misfortune';

  const info = FORTUNE_MESSAGES[tier];
  return {
    score,
    tier,
    label: info.label,
    emoji: info.emoji,
    message: pickRandom(info.messages),
  };
}

function getSynergy(card, hexagram) {
  const cardPositive = !card.isReversed;
  const hexScore = estimateHexagramFortune(hexagram);
  const hexPositive = hexScore >= 0.55;

  let type;
  if (cardPositive === hexPositive) type = 'aligned';
  else if (Math.abs(hexScore - 0.5) < 0.1) type = 'mixed';
  else type = 'tension';

  return {
    type,
    message: pickRandom(SYNERGY_PHRASES[type]),
  };
}

function composeSummary(fortune, cardInterp, hexInterp, bridge, synergy) {
  return {
    fortuneMessage: fortune.message,
    cardSection: cardInterp,
    bridgeAndHex: `${bridge}, ${hexInterp}`,
    synergyMessage: synergy.message,
  };
}

/**
 * 이미 뽑힌 card + hexagramResult를 입력받아 무료 리딩 생성
 * (카드/괘를 서버와 공유할 때 사용)
 *
 * @param {string} categoryId
 * @param {string} questionText
 * @param {object} card - drawRandomCard() 결과 (isReversed 포함)
 * @param {object} hexagramResult - generateHexagram() 결과 { hexagram, lines }
 * @returns {FreeReadingResult}
 */
export function generateFreeReadingWithInputs(categoryId, questionText, card, hexagramResult) {
  const category = QUESTION_CATEGORIES[categoryId] || QUESTION_CATEGORIES.general;
  const { hexagram, lines } = hexagramResult;

  const fortune = calculateFortune(card, hexagram);
  const cardInterpretation = card.isReversed ? card.reversed : card.upright;
  // iching.js 실제 필드: description, judgment, advice (interpretation/meaning 아님)
  const hexInterpretation = hexagram.description;
  const bridge = pickRandom(BRIDGE_PHRASES[categoryId] || BRIDGE_PHRASES.general);
  const synergy = getSynergy(card, hexagram);

  return {
    timestamp: new Date().toISOString(),
    category,
    questionText,

    card: {
      id: card.id,
      name: card.name,
      korName: card.korName,
      suit: card.suit,
      number: card.number,
      isReversed: card.isReversed,
      keywords: card.keywords,
      interpretation: cardInterpretation,
    },

    hexagram: {
      number: hexagram.number,
      korName: hexagram.korName,
      chinese: hexagram.chinese,
      unicode: hexagram.unicode,
      meaning: hexagram.description,
      interpretation: hexagram.description,
      judgment: hexagram.judgment,
      advice: hexagram.advice,
      shadow: hexagram.shadow,
      lines,
    },

    fortune,
    bridge,
    synergy,
    summary: composeSummary(fortune, cardInterpretation, hexInterpretation, bridge, synergy),
  };
}

/**
 * 카드와 괘를 직접 뽑아 무료 리딩 생성
 *
 * @param {string} categoryId
 * @param {string} questionText
 * @returns {{ freeResult: FreeReadingResult, card: object, hexagramResult: object }}
 */
export function generateFreeReading(categoryId = 'general', questionText = '') {
  const card = drawRandomCard();
  const hexagramResult = generateHexagram();
  const freeResult = generateFreeReadingWithInputs(categoryId, questionText, card, hexagramResult);
  return { freeResult, card, hexagramResult };
}

export { calculateFortune };
