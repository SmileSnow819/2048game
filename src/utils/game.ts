// 工具函数
import type { Grid, GridValue, GameState } from '../types/game';

// 产生a~b的随机整数
export const randomInt = (a: number, b: number): number => {
  return a + Math.floor(Math.random() * (b + 1 - a));
};

// 数组中随机位置
export const randomChoice = <T>(arr: T[]): T => {
  return arr[randomInt(0, arr.length - 1)];
};

// 创建空网格
export const createEmptyGrid = (): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < 4; i++) {
    const row: GridValue[] = [];
    for (let j = 0; j < 4; j++) {
      row.push(null);
    }
    grid.push(row);
  }
  return grid;
};

// 检查游戏是否结束
export const isGameOver = (grid: Grid): boolean => {
  // 检查是否有空格
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === null) {
        return false;
      }
    }
  }

  // 检查是否有可以合并的相邻格子
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];

      // 检查右侧
      if (j < 3 && grid[i][j + 1] === current) {
        return false;
      }

      // 检查下方
      if (i < 3 && grid[i + 1][j] === current) {
        return false;
      }
    }
  }

  return true;
};

// 深拷贝网格
export const deepCloneGrid = (grid: Grid): Grid => {
  return JSON.parse(JSON.stringify(grid));
};

// 保存游戏状态到本地存储
export const saveGameState = (state: GameState): void => {
  localStorage.setItem('gameState', JSON.stringify(state));
};

// 从本地存储加载游戏状态
export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem('gameState');
  return savedState ? JSON.parse(savedState) : null;
};

// 保存最高分到本地存储
export const saveHighestScore = (score: number): void => {
  localStorage.setItem('highestScore', score.toString());
};

// 从本地存储加载最高分
export const loadHighestScore = (): number => {
  const savedScore = localStorage.getItem('highestScore');
  return savedScore ? parseInt(savedScore, 10) : 0;
};
