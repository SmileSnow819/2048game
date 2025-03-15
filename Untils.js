//utils fun

//产生a~b的随机整数
randomInt = (a, b) => a + Math.floor(Math.random() * (b + 1 - a));

//数组中随机位置
randomChoice = (arr) => arr[randomInt(0, arr.length - 1)];
