import { LocalizedQuestion } from '../types';
import { QUESTIONS_PART_1 } from './questions_part1';
import { QUESTIONS_PART_2 } from './questions_part2';
import { QUESTIONS_PART_3 } from './questions_part3';
import { LEVEL_CONFIGS, DAILY_QUESTION_IDS } from './levels';

export const ALL_QUESTIONS: LocalizedQuestion[] = [
  ...QUESTIONS_PART_1,
  ...QUESTIONS_PART_2,
  ...QUESTIONS_PART_3,
];

const questionsMap = new Map<string, LocalizedQuestion>();
ALL_QUESTIONS.forEach((q) => {
  questionsMap.set(q.id, q);
});

export function getQuestionById(id: string): LocalizedQuestion | undefined {
  return questionsMap.get(id);
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getQuestionsForLevel(levelId: number, excludeQuestionIds: string[] = []): LocalizedQuestion[] {
  const config = LEVEL_CONFIGS.find((l) => l.id === levelId);
  if (!config) return [];

  const neededCount = config.isBoss ? (config.id === 10 ? 7 : 6) : 5;
  const pool: LocalizedQuestion[] = [];
  
  for (const qid of config.questionIds) {
    const q = questionsMap.get(qid);
    if (q) pool.push(q);
  }

  if (pool.length <= neededCount) {
    return shuffleArray(pool);
  }

  // Prioritize questions not in excludeQuestionIds
  const excludeSet = new Set(excludeQuestionIds);
  const fresh = pool.filter((q) => !excludeSet.has(q.id));
  const seen = pool.filter((q) => excludeSet.has(q.id));

  const shuffledFresh = shuffleArray(fresh);
  const shuffledSeen = shuffleArray(seen);

  const selected = [...shuffledFresh, ...shuffledSeen].slice(0, neededCount);
  return shuffleArray(selected);
}

export function getDailyQuestions(): LocalizedQuestion[] {
  const questions: LocalizedQuestion[] = [];
  for (const qid of DAILY_QUESTION_IDS) {
    const q = questionsMap.get(qid);
    if (q) questions.push(q);
  }
  return shuffleArray(questions);
}

