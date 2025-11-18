// 游戏常量
export const GRID_SIZE = 4;
export const CANVAS_SIZE = 600;
export const CANVAS_BACKGROUND_COLOR = 'rgb(187,173,160)';

export const BLOCK_GRP = 16;
export const BLOCK_WIDTH = 130;
export const BLOCK_BACKGROUND_COLOR = '#E0F7FA';
export const BLOCK_BACKGROUND_COLOR_START = 'FF6F91';
export const BLOCK_BACKGROUND_COLOR_END = '4A90E2';
export const TOTAL_BLOCKS =
  GRID_SIZE * BLOCK_WIDTH + (GRID_SIZE - 1) * BLOCK_GRP;
export const BLOCK_SPACING = (CANVAS_SIZE - TOTAL_BLOCKS) / 2;
export const BLOCK_FONT_SIZE = 50;
export const NUMBER_COLOR = 'rgb(119,110,101)';

export const ANIMATION_TIME = 120; // 毫秒
export const FRAME_PER_SECOND = 60;

// 数字对应的颜色
export const NUMBER_COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

// 数字对应的文字颜色
export const TEXT_COLORS: Record<number, string> = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
};
