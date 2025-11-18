import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Move } from '../types/game';
import {
  CANVAS_SIZE,
  CANVAS_BACKGROUND_COLOR,
  BLOCK_WIDTH,
  BLOCK_BACKGROUND_COLOR,
  BLOCK_SPACING,
  BLOCK_GRP,
} from '../constants/game';

interface GameGridProps {
  grid: (number | null)[][];
  moves: Move[];
  isAnimating: boolean;
  onAnimationEnd: () => void;
}

interface AnimatedBlock {
  value: number;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  isAnimating: boolean;
  isNew?: boolean;
  isMerged?: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({
  grid,
  moves,
  isAnimating,
  onAnimationEnd,
}) => {
  const [animatedBlocks, setAnimatedBlocks] = useState<AnimatedBlock[]>([]);

  useEffect(() => {
    // 当动画状态变为 true 且有移动时，开始动画
    if (isAnimating && moves.length > 0) {
      // 创建动画块
      const newAnimatedBlocks: AnimatedBlock[] = [];

      moves.forEach(([[fromRow, fromCol], [toRow, toCol]]) => {
        const value = grid[toRow][toCol];
        if (value !== null) {
          const isMerged = grid[fromRow][fromCol] !== value;
          const isNew = fromRow === toRow && fromCol === toCol; // 新生成的块

          newAnimatedBlocks.push({
            value,
            fromRow,
            fromCol,
            toRow,
            toCol,
            isAnimating: true,
            isMerged,
            isNew,
          });
        }
      });

      setAnimatedBlocks(newAnimatedBlocks);

      // 动画结束后更新状态 - 缩短动画时间提升游戏体验
      const timer = setTimeout(() => {
        setAnimatedBlocks([]);
        onAnimationEnd();
      }, 120); // 缩短动画时间，提升响应速度

      return () => clearTimeout(timer);
    } else if (!isAnimating) {
      // 当动画状态变为 false 时，确保清除动画块
      setAnimatedBlocks([]);
    }
  }, [isAnimating, moves, grid, onAnimationEnd]);

  const containerStyle: React.CSSProperties = {
    width: `${CANVAS_SIZE}px`,
    height: `${CANVAS_SIZE}px`,
    backgroundColor: CANVAS_BACKGROUND_COLOR,
    borderRadius: '20px',
    position: 'relative',
    margin: '0 auto',
    maxWidth: '90vw',
    maxHeight: '90vw',
  };

  // 渲染背景格子
  const renderBackgroundGrid = () => {
    const backgroundBlocks = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const top = i * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
        const left = j * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;

        const blockStyle: React.CSSProperties = {
          position: 'absolute',
          width: `${BLOCK_WIDTH}px`,
          height: `${BLOCK_WIDTH}px`,
          backgroundColor: BLOCK_BACKGROUND_COLOR,
          borderRadius: '5px',
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 3,
          boxShadow: '5px 5px 3px gray',
        };

        backgroundBlocks.push(<div key={`bg-${i}-${j}`} style={blockStyle} />);
      }
    }

    return backgroundBlocks;
  };

  // 渲染静态数字方块
  const renderStaticBlocks = () => {
    const staticBlocks = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const value = grid[i][j];
        // 跳过正在动画的块
        const isAnimating = animatedBlocks.some(
          (block) => block.toRow === i && block.toCol === j
        );

        if (value !== null && !isAnimating) {
          const top = i * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
          const left = j * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;

          const blockStyle: React.CSSProperties = {
            position: 'absolute',
            width: `${BLOCK_WIDTH}px`,
            height: `${BLOCK_WIDTH}px`,
            backgroundColor: getBlockColor(value),
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            color: getTextColor(value),
            zIndex: 5,
            boxShadow: '5px 5px 3px gray',
            fontFamily: "'Oswald', sans-serif",
            top: `${top}px`,
            left: `${left}px`,
          };

          staticBlocks.push(
            <div key={`static-${i}-${j}`} style={blockStyle}>
              {value}
            </div>
          );
        }
      }
    }

    return staticBlocks;
  };

  // 渲染动画方块
  const renderAnimatedBlocks = () => {
    return animatedBlocks.map((block, index) => {
      const fromTop = block.fromRow * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
      const fromLeft =
        block.fromCol * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
      const toTop = block.toRow * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
      const toLeft = block.toCol * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;

      const blockStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${BLOCK_WIDTH}px`,
        height: `${BLOCK_WIDTH}px`,
        backgroundColor: getBlockColor(block.value),
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '50px',
        fontWeight: 'bold',
        color: getTextColor(block.value),
        zIndex: 6,
        boxShadow: '5px 5px 3px gray',
        fontFamily: "'Oswald', sans-serif",
      };

      return (
        <motion.div
          key={`animated-${index}`}
          style={{
            ...blockStyle,
            top: `${toTop}px`,
            left: `${toLeft}px`,
          }}
          initial={{
            top: `${fromTop}px`,
            left: `${fromLeft}px`,
            scale: 1,
          }}
          animate={{
            top: `${toTop}px`,
            left: `${toLeft}px`,
            scale: block.isMerged ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.08,
            ease: 'easeOut',
            scale: block.isMerged
              ? {
                  duration: 0.15,
                  times: [0, 0.7, 1],
                }
              : undefined,
          }}
        >
          {block.value}
        </motion.div>
      );
    });
  };

  const getBlockColor = (value: number): string => {
    const colors: Record<number, string> = {
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
    return colors[value] || '#cdc1b4';
  };

  const getTextColor = (value: number): string => {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  };

  return (
    <div style={containerStyle}>
      {renderBackgroundGrid()}
      <AnimatePresence>{renderStaticBlocks()}</AnimatePresence>
      <AnimatePresence>{renderAnimatedBlocks()}</AnimatePresence>
    </div>
  );
};

export default GameGrid;
