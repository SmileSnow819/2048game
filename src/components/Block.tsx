import React, { useMemo } from 'react';
import type { BlockProps } from '../types/game';
import {
  NUMBER_COLORS,
  TEXT_COLORS,
  BLOCK_WIDTH,
  BLOCK_FONT_SIZE,
  GRID_SIZE,
  BLOCK_GRP,
} from '../constants/game';

const Block: React.FC<BlockProps> = ({
  value,
  row,
  col,
  isNew = false,
  isMerged = false,
}) => {
  // 响应式格子大小计算
  const { responsiveBlockWidth, responsiveFontSize } = useMemo(() => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const maxCanvasWidth = Math.min(window.innerWidth * 0.9, 500);
      const responsiveBlockWidth = Math.floor(
        (maxCanvasWidth - 60) / GRID_SIZE
      );
      const responsiveFontSize =
        responsiveBlockWidth >= 100 ? 50 : responsiveBlockWidth >= 80 ? 40 : 30;

      return {
        responsiveBlockWidth,
        responsiveFontSize,
      };
    }

    return {
      responsiveBlockWidth: BLOCK_WIDTH,
      responsiveFontSize: BLOCK_FONT_SIZE,
    };
  }, []);

  if (value === null) {
    return null;
  }

  const backgroundColor = NUMBER_COLORS[value] || '#cdc1b4';
  const textColor = TEXT_COLORS[value] || '#776e65';

  const blockStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${responsiveBlockWidth}px`,
    height: `${responsiveBlockWidth}px`,
    backgroundColor,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${responsiveFontSize}px`,
    fontWeight: 'bold',
    color: textColor,
    zIndex: 5,
    boxShadow: '5px 5px 3px gray',
    fontFamily: "'Oswald', sans-serif",
    transition: isNew || isMerged ? 'all 0.12s ease' : 'none',
    transform: isNew ? 'scale(0.8)' : isMerged ? 'scale(1.1)' : 'scale(1)',
  };

  const top = row * (responsiveBlockWidth + BLOCK_GRP) + 10;
  const left = col * (responsiveBlockWidth + BLOCK_GRP) + 10;

  return (
    <div
      style={{
        ...blockStyle,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {value}
    </div>
  );
};

export default Block;
