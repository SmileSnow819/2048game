import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction } from '../types/game';
import { evaluateBestMove } from '../utils/aiAgent';

interface UseAIAgentOptions {
  depth?: number;
  stepDelay?: number;
}

type AdvanceFn = (direction: Direction) => void;

export const useAIAgent = (
  gameState: Parameters<typeof evaluateBestMove>[0],
  advance: AdvanceFn,
  options?: UseAIAgentOptions
) => {
  const { depth = 5, stepDelay = 260 } = options ?? {};
  const [isRunning, setIsRunning] = useState(false);
  const [lastDecision, setLastDecision] = useState<{
    move: Direction;
    projectedScore: number;
  } | null>(null);

  const stateRef = useRef(gameState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const stopAI = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const playAI = useCallback(
    (rounds = 10) => {
      if (isRunning || stateRef.current.gameOver) return;

      setIsRunning(true);

      const step = (remaining: number) => {
        const latest = stateRef.current;

        if (remaining <= 0 || latest.gameOver) {
          stopAI();
          return;
        }

        const decision = evaluateBestMove(latest, depth);
        if (!decision) {
          stopAI();
          return;
        }

        setLastDecision({
          move: decision.move,
          projectedScore: decision.points,
        });

        advance(decision.move);

        timerRef.current = setTimeout(() => step(remaining - 1), stepDelay);
      };

      step(rounds);
    },
    [advance, depth, isRunning, stepDelay, stopAI]
  );

  useEffect(() => stopAI, [stopAI]);

  return {
    playAI,
    stopAI,
    isAIRunning: isRunning,
    lastDecision,
  };
};
