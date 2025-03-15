//Tests
class Tests {
  compareArray(fun_output, output) {
    //遍历fun_output和output数组判断每一个元素
    if (fun_output.length !== output.length) return false;
    for (let i = 0; i < output.length; i++) {
      if (output[i] !== fun_output[i]) return false;
    }
    return true;
  }

  testShiftBlock() {
    let gameTest = new Game();
    let testCases = [
      [
        [2, 2, null, null],
        [4, null, null, null],
      ],
      [
        [4, 2, null, 2],
        [4, 4, null, null],
      ],
      [
        [2, null, null, null],
        [2, null, null, null],
      ],
      [
        [null, null, null, null],
        [null, null, null, null],
      ],
      [
        [4, 8, 8, null],
        [4, 16, null, null],
      ],
      [
        [2, 4, 8, 4],
        [2, 4, 8, 4],
      ],
      [
        [2, 2, 4, 4],
        [4, 8, null, null],
      ],
      [
        [4, 8, 8, 4],
        [4, 16, 4, null],
      ],
    ];
    let errFlag = false;
    for (let test of testCases) {
      for (let isReverse of [true, false]) {
        let input = test[0].slice();
        let result = test[1].slice();
        if (isReverse === true) {
          input.reverse();
          result.reverse();
        }
        let fun_result = gameTest.shiftBlock(input, isReverse).rowArr;
        if (!this.compareArray(fun_result, result)) {
          errFlag = true;
          console.log('error');
          console.log(input, result, fun_result);
        }
      }
    }
    if (!errFlag) {
      console.log('pass!');
    }
  }
}
