// 游戏类型定义
export type GridValue = number | null;
export type Grid = GridValue[][];
export type Position = [number, number];
export type Move = [Position, Position];
export type Direction = 'left' | 'right' | 'up' | 'down';

export interface GameState {
  grid: Grid;
  score: number;
  steps: number;
  gameOver: boolean;
  isAnimating: boolean;
  moves: Move[];
  highestScore: number;
}

export interface ShiftResult {
  rowArr: GridValue[];
  moves: [number, number][];
  points: number;
}

export interface AdvanceResult {
  moves: Move[];
  points: number;
  steps: number;
}

export interface BlockProps {
  value: number | null;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameEvaluationState extends GameState {
  children: Record<Direction, GameEvaluationState | null>;
  parent: GameEvaluationState | null;
  bestChildren: { move: Direction; points: number } | null;
  move: Direction | null;
}
