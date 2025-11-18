import React from 'react';
import type { BlockProps } from '../types/game';
import {
  NUMBER_COLORS,
  TEXT_COLORS,
  BLOCK_WIDTH,
  BLOCK_FONT_SIZE,
} from '../constants/game';

const Block: React.FC<BlockProps> = ({
  value,
  row,
  col,
  isNew = false,
  isMerged = false,
}) => {
  if (value === null) {
    return null;
  }

  const backgroundColor = NUMBER_COLORS[value] || '#cdc1b4';
  const textColor = TEXT_COLORS[value] || '#776e65';

  const blockStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${BLOCK_WIDTH}px`,
    height: `${BLOCK_WIDTH}px`,
    backgroundColor,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${BLOCK_FONT_SIZE}px`,
    fontWeight: 'bold',
    color: textColor,
    zIndex: 5,
    boxShadow: '5px 5px 3px gray',
    fontFamily: "'Oswald', sans-serif",
    transition: isNew || isMerged ? 'all 0.12s ease' : 'none',
    transform: isNew ? 'scale(0.8)' : isMerged ? 'scale(1.1)' : 'scale(1)',
  };

  const top = row * (BLOCK_WIDTH + 16) + 10;
  const left = col * (BLOCK_WIDTH + 16) + 10;

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
