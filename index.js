const chess = document.querySelector('.chess');
const restart = document.querySelector('.restart');
const title = document.querySelector('.title');
const context = chess.getContext('2d');
context.strokeStyle = '#3F291A';

let me,
  over,
  myWin = [],
  rebotWin = [],
  chessBoard = [];

window.addEventListener('load', () => {
  drawChessBoard();
  init();
  chess.addEventListener('click', (e) => {
    judeg(e);
  });
});

function drawChessBoard() {
  for (let i = 0; i < 15; i++) {
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
  }
}

//筛选出所有赢的可能
let wins = [];
for (let i = 0; i < 15; i++) {
  wins[i] = [];
  for (let j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}

let idx = 0;
//横线
for (let i = 0; i < 11; i++) {
  for (let j = 0; j < 15; j++) {
    for (let k = 0; k < 5; k++) {
      wins[i + k][j][idx] = true;
    }
    idx++;
  }
}
//竖线
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 11; j++) {
    for (let k = 0; k < 5; k++) {
      wins[i][j + k][idx] = true;
    }
    idx++;
  }
}
//左上到右下
for (let i = 0; i < 11; i++) {
  for (let j = 0; j < 11; j++) {
    for (let k = 0; k < 5; k++) {
      wins[i + k][j + k][idx] = true;
    }
    idx++;
  }
}
//左下到右上
for (let i = 0; i < 11; i++) {
  for (let j = 14; j >= 4; j--) {
    for (let k = 0; k < 5; k++) {
      wins[i + k][j - k][idx] = true;
    }
    idx++;
  }
}

function init() {
  //标记人是否可以下棋
  me = true;
  //判断游戏是否结束
  over = false;
  //初始化
  for (let i = 0; i < idx; i++) {
    myWin[i] = 0;
    rebotWin[i] = 0;
  }
  //判重 当前位置如果下了棋则不能在该位置下
  for (let i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (let j = 0; j < 15; j++) {
      chessBoard[i][j] = false;
    }
  }
}

let timer = 0;
function judeg(e) {
  if (over || !me) {
    return;
  }
  //获取鼠标相对于chess的位置
  let x = e.offsetX;
  let y = e.offsetY;
  //鼠标点击的位置离棋盘哪个位置近就放哪
  x = parseInt(x / 30);
  y = parseInt(y / 30);
  if (!chessBoard[x][y]) {
    //下棋
    oneStep(x, y, me);
    chessBoard[x][y] = true;
    for (let k = 0; k < idx; k++) {
      if (wins[x][y][k]) {
        // console.log(x, y, k);
        myWin[k]++;
        if (myWin[k] === 5) {
          title.innerHTML = '~~你赢了~~';
          over = true;
        }
      }
    }
  }
  if (!over) {
    me = !me;
    //机器人下棋
    timer = setTimeout(rebot, 500);
  }
}

function oneStep(x, y, me) {
  context.beginPath();
  //画旗子
  context.arc(15 + x * 30, 15 + y * 30, 12, 0, 2 * Math.PI);
  context.closePath();

  let color;
  if (me) {
    color = '#000000';
  } else {
    color = '#FFFFFF';
  }
  context.fillStyle = color;
  context.fill();
}

function rebot() {
  clearTimeout(timer);
  let myScore = [];
  let rebotScore = [];
  for (let i = 0; i < 15; i++) {
    myScore[i] = [];
    rebotScore[i] = [];
    for (let j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      rebotScore[i][j] = 0;
    }
  }

  let maxScore = 0;
  //最大分值的坐标
  let x = 0,
    y = 0;

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (!chessBoard[i][j]) {
        for (k = 0; k < idx; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] === 1) {
              myScore[i][j] += 200;
              console.log(i, j);
              console.log('hh');
            } else if (myWin[k] === 2) {
              myScore[i][j] += 800;
            } else if (myWin[k] === 3) {
              myScore[i][j] += 2000;
            } else if (myWin[k] === 4) {
              myScore[i][j] += 10000;
            }

            if (rebotWin[k] === 1) {
              rebotScore[i][j] += 220;
            } else if (rebotWin[k] === 2) {
              rebotScore[i][j] += 420;
            } else if (rebotWin[k] === 3) {
              rebotScore[i][j] += 2200;
            } else if (rebotWin[k] === 4) {
              rebotScore[i][j] += 20000;
            }
          }
        }

        if (myScore[i][j] > maxScore) {
          x = i;
          y = j;
          console.log(x, y, myScore[i][j], maxScore);
          maxScore = myScore[i][j];
        } else if (myScore[i][j] === maxScore) {
          if (rebotScore[i][j] > maxScore) {
            maxScore = rebotScore[i][j];
            x = i;
            y = i;
          }
        }

        if (rebotScore[i][j] > maxScore) {
          maxScore = rebotScore[i][j];
          x = i;
          y = j;
        } else if (rebotScore[i][j] === maxScore) {
          if (myScore[i][j] > maxScore) {
            maxScore = myScore[i][j];
            x = i;
            y = i;
          }
        }
      }
    }
  }
  oneStep(x, y, me);
  chessBoard[x][y] = true;
  for (let k = 0; k < idx; k++) {
    if (wins[x][y][k]) {
      rebotWin[k]++;
      if (rebotWin[k] === 5) {
        title.innerHTML = '~~抱歉，ai赢了~~';
        over = true;
      }
    }
  }
  if (!over) me = !me;
}

//重新开始
restart.addEventListener('click', () => {
  window.location.reload();
});
