//Model
class Game {
  constructor() {
    this.data = [];
    this.points = 0;
    this.step = 0;
    this.loadGame();
    if (!this.data.length) {
      this.initializeData();
    }
  }

  initializeData() {
    this.data = [];
    this.points = 0;
    this.step = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      let temp = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        temp.push(null);
      }
      this.data.push(temp);
    }
    //初始有两个BLOCK
    totolStep.innerHTML = this.step;
    pointBlock.innerHTML = this.points;
    this.generateNewBlock();
    this.generateNewBlock();
  }

  // 保存游戏状态到本地存储
  saveGame() {
    const gameState = {
      data: this.data,
      points: this.points,
      step: this.step,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  // 从本地存储加载游戏状态
  loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      this.data = gameState.data;
      this.points = gameState.points;
      this.step = gameState.step;
      totolStep.innerHTML = this.step;
      pointBlock.innerHTML = this.points;
    }
  }

  generateNewBlock() {
    //1.收集所有null的Pos
    let possiblePositions = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (this.data[i][j] === null) {
          possiblePositions.push([i, j]);
        }
      }
    }
    // 2. 随机选择一个位置并放置新块
    let position = randomChoice(possiblePositions);
    this.data[position[0]][position[1]] = 2;
  }

  //2048移动算法
  shiftBlock(rowArr, isReverse) {
    //head->下一个可能撞击的元素
    //tail->遍历矩阵
    let head = 0;
    let tail = 1;
    let incr = 1;
    let points = 0;
    if (isReverse) {
      head = rowArr.length - 1;
      tail = head - 1;
      incr = -1;
    }
    let moves = [];
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
          rowArr[head] *= 2;
          rowArr[tail] = null;
          points += rowArr[head];
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
    return {
      rowArr,
      moves,
      points,
    };
  }

  //前进一步
  // command in ['left','right','up','down']
  advance(command) {
    //记录一维数组移动的初始位置和末位置
    //right or down reverse
    let moves = [];
    let isReverse = command === 'right' || command === 'down';
    if (command === 'left' || command === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        let rowMove = this.shiftBlock(this.data[i], isReverse);
        this.points += rowMove.points;
        //push二维点
        for (let move of rowMove.moves) {
          moves.push([
            [i, move[0]],
            [i, move[1]],
          ]);
        }
      }
    } else if (command === 'up' || command === 'down') {
      for (let i = 0; i < GRID_SIZE; i++) {
        let tmp = [];
        //转置数组
        for (let j = 0; j < GRID_SIZE; j++) {
          tmp.push(this.data[j][i]);
        }
        //合并数组
        let colMove = this.shiftBlock(tmp, isReverse);
        this.points += colMove.points;
        //push二维点
        for (let move of colMove.moves) {
          moves.push([
            [move[0], i],
            [move[1], i],
          ]);
        }
        //转置数组
        for (let j = 0; j < GRID_SIZE; j++) {
          this.data[j][i] = tmp[j];
        }
      }
    }
    if (moves.length !== 0) {
      this.step++;
      this.generateNewBlock();
    }
    this.saveGame();
    return {
      moves,
      points: this.points,
      step: this.step,
    };
  }
}
