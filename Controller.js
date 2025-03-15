//Const
const FRAME_PER_SECOND = 30;
const ANIMATION_TIME = 0.12;

const CANVAS_SIZE = 600;
const CANVAS_BACKGROUND_COLOD = 'rgb(187,173,160)';

const BLOCK_GRP = 16;
const GRID_SIZE = 4;
const BLOCK_WIDTH = 130;
const BLOCK_BACKGROUND_COLOR = '#E0F7FA';
const BLOCK_BACKGROUND_COLOR_START = 'FF6F91';
const BLOCK_BACKGROUND_COLOR_END = '4A90E2';
const TOTAL_BLOCKS = GRID_SIZE * BLOCK_WIDTH + (GRID_SIZE - 1) * BLOCK_GRP;
//计算左右间距
const BLOCK_SPACING = (600 - TOTAL_BLOCKS) / 2;
const BLOCK_FANT_SIZE = 50;
const NUMBER_COLOR = 'rgb(119,110,101)';

//Controller
let container = document.getElementById('game-container');
let pointBlock = document.getElementById('points');
let initializationGame = document.getElementById('initializationGame');
let totolStep = document.getElementById('total-step');

let game = new Game();
let view = new View(container, game);
view.drawGame();
const test = new Tests();
test.testShiftBlock();

initializationGame.addEventListener('click', () => {
  game.initializeData();
  view.drawGame();
});

let moves = 0;
let points = 0;
let count = 0;

document.addEventListener('keydown', (event) => {
  // 获取之前的分数
  let previousPoints = parseInt(pointBlock.innerHTML, 10);

  if (event.key === 'ArrowUp') {
    result = game.advance('up');
    moves = result.moves;
    points = result.points;
    count = result.step;
  } else if (event.key === 'ArrowDown') {
    result = game.advance('down');
    moves = result.moves;
    points = result.points;
    count = result.step;
  } else if (event.key === 'ArrowLeft') {
    result = game.advance('left');
    moves = result.moves;
    points = result.points;
    count = result.step;
  } else if (event.key === 'ArrowRight') {
    result = game.advance('right');
    moves = result.moves;
    points = result.points;
    count = result.step;
  }

  if (moves.length > 0) {
    totolStep.innerHTML = count;

    // 更新分数并添加动画效果
    if (points > previousPoints) {
      pointBlock.classList.add('score-increase');
      setTimeout(() => {
        pointBlock.classList.remove('score-increase');
      }, 300);
    }

    pointBlock.innerHTML = points;
    view.drawAnimate(moves);
  }
});

//移动端
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
  // Capture the starting touch position
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
  // Get the ending touch position
  let touchEndX = event.changedTouches[0].clientX;
  let touchEndY = event.changedTouches[0].clientY;

  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;

  // Swipe Up (Vertical)
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    if (deltaY < 0) {
      // Swipe Up
      result = game.advance('up');
      moves = result.moves;
      points = result.points;
      count = result.step;
    } else {
      // Swipe Down
      result = game.advance('down');
      moves = result.moves;
      points = result.points;
      count = result.step;
    }
  }
  // Swipe Left/Right (Horizontal)
  else {
    if (deltaX < 0) {
      // Swipe Left
      result = game.advance('left');
      moves = result.moves;
      points = result.points;
      count = result.step;
    } else {
      // Swipe Right
      result = game.advance('right');
      moves = result.moves;
      points = result.points;
      count = result.step;
    }
  }

  // If there were valid moves
  if (moves.length > 0) {
    totolStep.innerHTML = count;
    pointBlock.innerHTML = points;
    view.drawAnimate(moves);
  }
});
