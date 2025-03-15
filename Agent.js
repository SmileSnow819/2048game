class GameEvaluation extends Game {
  constructor(game) {
    super();
    //深拷贝
    this.data = JSON.parse(JSON.stringify(game.data));
    this.children = {};
    this.parent = null;
    this.points = game.points;
    this.bestChildren = null;
    this.move = null;
  }
  //备份自己
  copy() {
    let ret = new GameEvaluation(this);
    return ret;
  }
  //模拟移动
  evaluateNextStep() {
    for (let command of ['left', 'right', 'up', 'down']) {
      let next = this.copy();
      let result = next.advance(command);

      if (result.moves.length > 0) {
        next.move = command;
        this.children[command] = next;
        next.parent = this;
      } else {
        this.children[command] = null;
      }
    }
  }
  //计算最佳得分
  backPropagate() {
    let node = this;
    let points = this.points;
    while (node.parent) {
      if (
        node.parent.bestChildren === null ||
        node.parent.bestChildren.points < points
      ) {
        node.parent.bestChildren = {
          move: node.move,
          points,
        };
      }
      node = node.parent;
    }
  }
}

class GameAgent {
  constructor(game) {
    this.game = game;
  }
  //深度优先搜索（DFS）
  evaluate(depth = 6) {
    let currGame = new GameEvaluation(this.game);
    let queue = [currGame];
    let nextQueue = [];

    for (let i = 0; i < depth; i++) {
      for (let currentGameEvaluation of queue) {
        currentGameEvaluation.evaluateNextStep();
        for (let cmd in g.children) {
          if (currentGameEvaluation.children[cmd]) {
            nextQueue.push(g.children[cmd]);
          }
        }
      }
      queue = nextQueue;
      nextQueue = [];
    }
    for (let currentGameEvaluation of queue) {
      currentGameEvaluation.backPropagate();
    }
    return currGame.bestChildren;
  }

  issueCommand(command) {
    let mapping = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown',
    };
    let e = new KeyboardEvent('keydown', { key: mapping[command] });
    document.dispatchEvent(e);
  }

  play(rounds = 10) {
    if (rounds > 0) {
      let result = this.evaluate();
      this.issueCommand(result.move);
      setTimeout(() => {
        this.play(rounds - 1);
      }, 200);
    }
  }
}

const tryTen = document.getElementById('AI_Test');
tryTen.addEventListener('click', () => {
  a = new GameAgent(game);
  a.play();
});
