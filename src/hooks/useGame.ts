import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  Grid,
  Direction,
  Move,
  GameState,
  ShiftResult,
  AdvanceResult,
} from '../types/game';
import { GRID_SIZE } from '../constants/game';
import {
  createEmptyGrid,
  randomChoice,
  isGameOver,
  deepCloneGrid,
  saveGameState,
  loadGameState,
  saveHighestScore,
  loadHighestScore,
} from '../utils/game';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = loadGameState();
    const highestScore = loadHighestScore();

    if (savedState) {
      return {
        ...savedState,
        gameOver: isGameOver(savedState.grid),
        isAnimating: false,
        moves: [],
        highestScore,
      };
    }

    const initialGrid = createEmptyGrid();
    // 初始有两个方块 - 使用独立的函数而不是useCallback中的函数
    const generateInitialBlock = (grid: Grid): void => {
      const possiblePositions: [number, number][] = [];

      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (grid[i][j] === null) {
            possiblePositions.push([i, j]);
          }
        }
      }

      if (possiblePositions.length > 0) {
        const position = randomChoice(possiblePositions);
        grid[position[0]][position[1]] = 2;
      }
    };

    generateInitialBlock(initialGrid);
    generateInitialBlock(initialGrid);

    return {
      grid: initialGrid,
      score: 0,
      steps: 0,
      gameOver: false,
      isAnimating: false,
      moves: [],
      highestScore,
    };
  });

  const gameStateRef = useRef<GameState>(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // 生成新方块
  const generateNewBlock = useCallback((grid: Grid): void => {
    const possiblePositions: [number, number][] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === null) {
          possiblePositions.push([i, j]);
        }
      }
    }

    if (possiblePositions.length > 0) {
      const position = randomChoice(possiblePositions);
      grid[position[0]][position[1]] = 2;
    }
  }, []);

  // 移动算法
  const shiftBlock = useCallback(
    (rowArr: (number | null)[], isReverse: boolean): ShiftResult => {
      let head = 0;
      let tail = 1;
      let incr = 1;
      let points = 0;

      if (isReverse) {
        head = rowArr.length - 1;
        tail = head - 1;
        incr = -1;
      }

      const moves: [number, number][] = [];

      while (tail < rowArr.length && 0 <= tail) {
        if (rowArr[tail] === null) {
          tail += incr;
        } else {
          if (rowArr[head] === null) {
            rowArr[head] = rowArr[tail];
            rowArr[tail] = null;
            moves.push([tail, head]);
            tail += incr;
          } else if (rowArr[head] === rowArr[tail]) {
            rowArr[head] = (rowArr[head] as number) * 2;
            rowArr[tail] = null;
            points += rowArr[head] as number;
            moves.push([tail, head]);
            head += incr;
            tail += incr;
          } else {
            head += incr;
            if (head === tail) {
              tail += incr;
            }
          }
        }
      }

      return { rowArr, moves, points };
    },
    []
  );

  // 前进一步
  const advance = useCallback(
    (command: Direction): AdvanceResult => {
      const currentState = gameStateRef.current;
      const grid = deepCloneGrid(currentState.grid);
      const moves: Move[] = [];
      let points = 0;
      const isReverse = command === 'right' || command === 'down';

      if (command === 'left' || command === 'right') {
        for (let i = 0; i < GRID_SIZE; i++) {
          const rowMove = shiftBlock(grid[i], isReverse);
          points += rowMove.points;

          for (const move of rowMove.moves) {
            // 添加边界检查
            if (
              move[0] >= 0 &&
              move[0] < GRID_SIZE &&
              move[1] >= 0 &&
              move[1] < GRID_SIZE
            ) {
              moves.push([
                [i, move[0]],
                [i, move[1]],
              ]);
            }
          }
        }
      } else if (command === 'up' || command === 'down') {
        for (let i = 0; i < GRID_SIZE; i++) {
          const tmp: (number | null)[] = [];

          // 转置数组
          for (let j = 0; j < GRID_SIZE; j++) {
            tmp.push(grid[j][i]);
          }

          // 合并数组
          const colMove = shiftBlock(tmp, isReverse);
          points += colMove.points;

          // push二维点
          for (const move of colMove.moves) {
            // 添加边界检查
            if (
              move[0] >= 0 &&
              move[0] < GRID_SIZE &&
              move[1] >= 0 &&
              move[1] < GRID_SIZE
            ) {
              moves.push([
                [move[0], i],
                [move[1], i],
              ]);
            }
          }

          // 转置数组
          for (let j = 0; j < GRID_SIZE; j++) {
            grid[j][i] = tmp[j];
          }
        }
      }

      if (moves.length !== 0) {
        generateNewBlock(grid);
      }

      const newScore = currentState.score + points;
      const newSteps = currentState.steps + (moves.length > 0 ? 1 : 0);
      const gameOver = isGameOver(grid);

      // 更新最高分
      const newHighestScore = Math.max(currentState.highestScore, newScore);
      if (newHighestScore > currentState.highestScore) {
        saveHighestScore(newHighestScore);
      }

      const newState: GameState = {
        grid,
        score: newScore,
        steps: newSteps,
        gameOver,
        isAnimating: moves.length > 0,
        moves,
        highestScore: newHighestScore,
        scoreAnimation:
          points > 0
            ? {
                points,
                key: Date.now(),
              }
            : undefined,
      };

      setGameState(newState);
      saveGameState(newState);

      return {
        moves,
        points: newScore,
        steps: newSteps,
      };
    },
    [shiftBlock, generateNewBlock]
  );

  // 初始化游戏
  const initializeGame = useCallback(() => {
    const grid = createEmptyGrid();
    generateNewBlock(grid);
    generateNewBlock(grid);

    const newState: GameState = {
      grid,
      score: 0,
      steps: 0,
      gameOver: false,
      isAnimating: false,
      moves: [],
      highestScore: gameState.highestScore,
      scoreAnimation: undefined,
    };

    setGameState(newState);
    saveGameState(newState);
  }, [generateNewBlock, gameState.highestScore]);

  // 设置动画状态
  const setAnimating = useCallback((isAnimating: boolean) => {
    setGameState((prev) => ({ ...prev, isAnimating }));
  }, []);

  return {
    gameState,
    advance,
    initializeGame,
    setAnimating,
  };
};
