//View
class View {
  constructor(container, game, blocks) {
    this.game = game;
    this.container = container;
    this.blocks = [];
    this.initializeContainer();
  }

  initializeContainer() {
    this.container.style.width = CANVAS_SIZE + 'px';
    this.container.style.height = CANVAS_SIZE + 'px';
    this.container.style.backgroundColor = CANVAS_BACKGROUND_COLOD;
    this.container.style.zIndex = 1;
    this.container.style.borderRadius = 20 + 'px';
  }

  gridToPosition(i, j) {
    let top = i * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
    let left = j * (BLOCK_WIDTH + BLOCK_GRP) + BLOCK_SPACING;
    return [top, left];
  }

  drawAnimate(moves) {
    this.drawDoFrame(moves, 0, ANIMATION_TIME);
  }

  drawDoFrame(moves, currTime, totalTime) {
    if (currTime < totalTime) {
      setTimeout(() => {
        this.drawDoFrame(moves, currTime + 1 / FRAME_PER_SECOND, totalTime);
      }, (1 / FRAME_PER_SECOND) * 1000);
      for (let move of moves) {
        //定位block
        let block = this.blocks[[move[0][0]]][move[0][1]];
        //转换像素坐标
        let origin = this.gridToPosition(move[0][0], move[0][1]);
        let destination = this.gridToPosition(move[1][0], move[1][1]);
        //计算当前时间位置
        let currPosition = [
          origin[0] + (currTime / totalTime) * (destination[0] - origin[0]),
          origin[1] + (currTime / totalTime) * (destination[1] - origin[1]),
        ];
        //更新位置
        if (block) {
          block.style.top = currPosition[0] + 'px';
          block.style.left = currPosition[1] + 'px';
        }
      }
    } else {
      this.drawGame();
    }
  }

  //把数字放入背景格子+画背景格子
  drawGame() {
    //清空上一次的block
    this.container.innerHTML = '';
    //清空blocks
    this.blocks = [];
    //放入4*4格子
    for (let i = 0; i < GRID_SIZE; i++) {
      let tmp = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        //画背景
        this.drawBackgroundBlock(i, j, BLOCK_BACKGROUND_COLOR);
        let block = null;
        //如果data不为null则画数字
        if (this.game.data[i][j]) {
          block = this.drawBlock(i, j, this.game.data[i][j]);
        }
        tmp.push(block);
      }
      this.blocks.push(tmp);
    }
  }

  //画背景格子
  drawBackgroundBlock(i, j, color) {
    const block = document.createElement('div');
    block.className = 'bacc-block';
    block.style.position = 'absolute';
    block.style.zIndex = 3;
    block.style.width = BLOCK_WIDTH + 'px';
    block.style.height = BLOCK_WIDTH + 'px';
    block.style.backgroundColor = color;
    block.style.borderRadius = 5 + 'px';

    // 计算left 和 top 位置
    block.style.left = BLOCK_SPACING + j * (BLOCK_WIDTH + BLOCK_GRP) + 'px';
    block.style.top = BLOCK_SPACING + i * (BLOCK_WIDTH + BLOCK_GRP) + 'px';

    container.appendChild(block);
    return block;
  }

  //把数字放入背景格子
  drawBlock(i, j, number) {
    let span = document.createElement('span');
    span.style.fontSize = BLOCK_FANT_SIZE + 'px';
    span.style.lineHeight = BLOCK_WIDTH + 'px';
    span.style.color = NUMBER_COLOR;
    let text = document.createTextNode(number); //or innerHTML()
    let block = this.drawBackgroundBlock(i, j, this.getColor(number));
    block.style.textAlign = 'center';
    block.style.zIndex = 5;
    span.appendChild(text);
    block.appendChild(span);
    return block;
  }

  getColor(number) {
    let level = Math.log(number);
    let rgbStart = this.hexToRGB(BLOCK_BACKGROUND_COLOR_START);
    let rgbEnd = this.hexToRGB(BLOCK_BACKGROUND_COLOR_END);
    let color = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      //求等差数列
      color[i] = Math.floor(
        rgbStart[i] + (rgbEnd[i] - rgbStart[i] * (level / 12))
      );
    }
    return `rgb(${color[0]},${color[1]},${color[2]})`;
  }

  hexToRGB(coloStr) {
    let red = coloStr.slice(0, 2);
    let green = coloStr.slice(2, 4);
    let blue = coloStr.slice(4, 6);
    return [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)];
  }
}
