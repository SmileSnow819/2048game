import { GRID_SIZE } from '../constants/game';
import type { Direction, GameState, Grid } from '../types/game';
import { deepCloneGrid, randomChoice } from './game';

const DIRECTIONS: Direction[] = ['left', 'right', 'up', 'down'];

interface SimulationState {
  grid: Grid;
  score: number;
}

interface SimulationResult extends SimulationState {
  moved: boolean;
}

const collectEmptyCells = (grid: Grid): [number, number][] => {
  const cells: [number, number][] = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === null) {
        cells.push([i, j]);
      }
    }
  }

  return cells;
};

const spawnRandomBlock = (grid: Grid): void => {
  const empty = collectEmptyCells(grid);

  if (empty.length === 0) return;

  const [row, col] = randomChoice(empty);
  grid[row][col] = 2;
};

const shiftLine = (
  line: (number | null)[],
  isReverse: boolean
): { line: (number | null)[]; moved: boolean; points: number } => {
  const arr = [...line];
  let moved = false;
  let points = 0;

  let head = isReverse ? arr.length - 1 : 0;
  let tail = isReverse ? head - 1 : 1;
  const incr = isReverse ? -1 : 1;

  while (tail >= 0 && tail < arr.length) {
    if (arr[tail] === null) {
      tail += incr;
      continue;
    }

    if (arr[head] === null) {
      arr[head] = arr[tail];
      arr[tail] = null;
      moved = true;
      tail += incr;
    } else if (arr[head] === arr[tail]) {
      arr[head] = (arr[head] as number) * 2;
      arr[tail] = null;
      points += arr[head] as number;
      moved = true;
      head += incr;
      tail += incr;
    } else {
      head += incr;
      if (head === tail) {
        tail += incr;
      }
    }
  }

  return { line: arr, moved, points };
};

const simulate = (
  state: SimulationState,
  direction: Direction
): SimulationResult => {
  const grid = deepCloneGrid(state.grid);
  const isReverse = direction === 'right' || direction === 'down';
  let moved = false;
  let gained = 0;

  if (direction === 'left' || direction === 'right') {
    for (let row = 0; row < GRID_SIZE; row++) {
      const { line, moved: rowMoved, points } = shiftLine(grid[row], isReverse);
      grid[row] = line;
      moved = moved || rowMoved;
      gained += points;
    }
  } else {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tmp: (number | null)[] = [];

      for (let row = 0; row < GRID_SIZE; row++) {
        tmp.push(grid[row][col]);
      }

      const { line, moved: colMoved, points } = shiftLine(tmp, isReverse);

      for (let row = 0; row < GRID_SIZE; row++) {
        grid[row][col] = line[row];
      }

      moved = moved || colMoved;
      gained += points;
    }
  }

  if (moved) {
    spawnRandomBlock(grid);
  }

  return {
    grid,
    score: state.score + gained,
    moved,
  };
};

const evaluateNode = (state: SimulationState, depth: number): number => {
  if (depth === 0) return state.score;

  let best = -Infinity;

  for (const direction of DIRECTIONS) {
    const result = simulate(state, direction);
    if (!result.moved) continue;

    const projected = evaluateNode(
      { grid: result.grid, score: result.score },
      depth - 1
    );

    if (projected > best) {
      best = projected;
    }
  }

  return best === -Infinity ? state.score : best;
};

export const evaluateBestMove = (
  gameState: GameState,
  depth = 5
): { move: Direction; points: number } | null => {
  const state: SimulationState = {
    grid: deepCloneGrid(gameState.grid),
    score: gameState.score,
  };

  let bestMove: Direction | null = null;
  let bestScore = -Infinity;

  for (const direction of DIRECTIONS) {
    const result = simulate(state, direction);
    if (!result.moved) continue;

    const projected =
      depth > 1
        ? evaluateNode({ grid: result.grid, score: result.score }, depth - 1)
        : result.score;

    if (projected > bestScore) {
      bestScore = projected;
      bestMove = direction;
    }
  }

  if (bestMove) {
    return { move: bestMove, points: bestScore };
  }

  return null;
};
