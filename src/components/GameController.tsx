import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Direction } from '../types/game';
import { useGame } from '../hooks/useGame';
import GameGrid from './GameGrid';

const GameController: React.FC = () => {
  const { gameState, advance, initializeGame, setAnimating } = useGame();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState.isAnimating || gameState.gameOver) return;

      let direction: Direction | null = null;

      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          return;
      }

      if (direction) {
        advance(direction);
      }
    },
    [gameState.isAnimating, gameState.gameOver, advance]
  );

  // 移动端触摸处理
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (gameState.isAnimating || gameState.gameOver) return;

      const touchStartX = event.touches[0].clientX;
      const touchStartY = event.touches[0].clientY;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const touchEndX = endEvent.changedTouches[0].clientX;
        const touchEndY = endEvent.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        let direction: Direction | null = null;

        // 判断滑动方向
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          // 垂直滑动
          if (deltaY < 0) {
            direction = 'up';
          } else {
            direction = 'down';
          }
        } else {
          // 水平滑动
          if (deltaX < 0) {
            direction = 'left';
          } else {
            direction = 'right';
          }
        }

        if (direction) {
          advance(direction);
        }

        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchend', handleTouchEnd, { once: true });
    },
    [gameState.isAnimating, gameState.gameOver, advance]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleKeyDown, handleTouchStart]);

  const handleAnimationEnd = useCallback(() => {
    setAnimating(false);
  }, [setAnimating]);

  const handleRestart = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const gamePointStyle: React.CSSProperties = {
    fontFamily: "'Oswald', sans-serif",
    boxShadow: '5px 5px 3px gray',
    height: '60px',
    minWidth: '100px',
    flex: '1',
    color: 'white',
    backgroundColor: 'rgb(167, 141, 116)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '8px',
    margin: '5px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  };

  const clickableButtonStyle: React.CSSProperties = {
    ...gamePointStyle,
    cursor: 'pointer',
  };

  // 移除未使用的hoverButtonStyle

  const gameMenuStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  };

  const gameMenuContainerStyle: React.CSSProperties = {
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 10px',
  };

  const gameInfoStyle: React.CSSProperties = {
    margin: '0 auto',
    maxWidth: '600px',
    textAlign: 'center',
    color: '#776e65',
    fontWeight: 800,
    marginTop: '15px',
    padding: '0 20px',
  };

  const gameContainerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={gameContainerStyle}>
      <div
        style={{ textAlign: 'center', marginBottom: '10px', color: '#776e65' }}
      >
        <h2 style={{ margin: '10px 0' }}>React 2048 Game</h2>
      </div>

      {/* 游戏菜单 */}
      <div style={gameMenuStyle}>
        <div style={gameMenuContainerStyle}>
          <div style={gamePointStyle}>
            分数
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ fontWeight: 800 }}>{gameState.score}</span>
              <AnimatePresence>
                {gameState.scoreAnimation && (
                  <motion.span
                    key={gameState.scoreAnimation.key}
                    initial={{ opacity: 0, y: 0, scale: 1 }}
                    animate={{ opacity: 1, y: -30, scale: 1.1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '10px',
                      marginLeft: '8px',
                      color: '#f65e3b',
                      fontWeight: 'bold',
                      fontSize: '24px',
                      whiteSpace: 'nowrap',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                    }}
                  >
                    +{gameState.scoreAnimation.points}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div style={gamePointStyle}>
            最高分
            <span style={{ fontWeight: 800 }}>{gameState.highestScore}</span>
          </div>
          <div style={gamePointStyle}>
            步数<span style={{ fontWeight: 800 }}>{gameState.steps}</span>
          </div>
          <div
            style={clickableButtonStyle}
            onClick={handleRestart}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(187, 161, 136)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(167, 141, 116)';
              e.currentTarget.style.transform = '';
            }}
          >
            <span style={{ fontWeight: 800 }}>再来一局</span>
          </div>
        </div>
      </div>

      {/* 游戏网格 */}
      <GameGrid
        grid={gameState.grid}
        moves={gameState.moves}
        isAnimating={gameState.isAnimating}
        onAnimationEnd={handleAnimationEnd}
      />

      {/* 游戏信息 */}
      <div style={gameInfoStyle}>
        <div style={{ fontSize: '18px', marginBottom: '5px' }}>
          游戏方法：使用上下左右箭头移动（或者滑动屏幕）
        </div>
        <div>当相同的两个碰撞时，它们会合并成一个！</div>
      </div>

      {/* 游戏结束提示 */}
      {gameState.gameOver && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <h2>游戏结束！</h2>
          <p>最终得分: {gameState.score}</p>
          <p>最高分: {gameState.highestScore}</p>
          <button
            onClick={handleRestart}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#8f7a66',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            重新开始
          </button>
        </div>
      )}
    </div>
  );
};

export default GameController;
