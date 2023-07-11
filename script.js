let canvas = document.querySelector("canvas");
let info = document.querySelector(".info");
let description = document.querySelector(".info__description");
let message = document.querySelector(".info__message");
let score = document.querySelector(".info__score");
let lives = document.querySelector(".info__lives");
let restart = document.querySelector(".button--restart");
let start = document.querySelector(".button--start");

let leftPressed = false;
let rightPressed = false;
let gameCount = 3;
let count = 0;
let restartGame = false;
let width = 220;
let ballSize = 25;
let boardX = canvas.width / 2 - width / 2;
let lose = true;

let ctx = canvas.getContext("2d");

start.style.top = canvas.height / 2 + "px";

let board = {
  dx: 0,
  x: boardX,
  y: canvas.height - 50,
  width,
  height: 15,
  speed: 8,
};

let ball = {
  dx: 0,
  dy: 0,
  x: board.x + board.width / 2 - ballSize / 2,
  y: board.y - ballSize,
  radius: ballSize,
  speed: 3,
};

let blocks = [];

function randomColor() {
  let Red = Math.floor(Math.random() * 256);
  let Green = Math.floor(Math.random() * 256);
  let Blue = Math.floor(Math.random() * 256);
  return `rgb(${Red}, ${Green}, ${Blue})`;
}


function drawBoard() {
  ctx.fillStyle = "orange";
  ctx.fillRect(board.x, board.y, board.width, board.height);
}


function drawBall() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.roundRect(ball.x, ball.y, ball.radius, ball.radius, [ballSize]);
  ctx.fill();
}


function drawBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    ctx.fillStyle = blocks[i].color;
    ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
  }
}


function createBlocks() {
  let randomRows = Math.floor(Math.random() * 6) + 3;
  for (let j = 0; j < randomRows; j++) {
    let randomColumns = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < randomColumns; i++) {
      blocks.push({
        x: (i * canvas.width) / randomColumns,
        y: j * 40,
        width: canvas.width / randomColumns,
        height: 40,
        color: randomColor(),
      });
    }
  }
}


function touch(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.radius > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.radius > obj2.y
  );
}


function ballStartPosition() {
  ball.x = boardX + board.width / 2 - ballSize / 2;
  ball.y = board.y - ballSize;
  ball.dx = 0;
  ball.dy = 0;
  board.x = boardX;
}


function update() {
  if (leftPressed) {
    board.x += -board.speed;
    if (board.x + board.speed <= 0) {
      board.x = 0;
    }
  }

  if (rightPressed) {
    board.x += board.speed;
    if (board.x + board.width - board.speed >= canvas.width) {
      board.x = canvas.width - board.width;
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  lives.textContent = `YOUR LIVES : ${gameCount}`;
  score.textContent = `YOUR SCORE : ${count}`;

  if (ball.x <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.dx *= -1;
  }

  if (ball.y - ball.speed < 0) {
    ball.dy *= -1;
  }

  if (!blocks.length) {
    message.textContent = "YOU WIN";
    lose = true;
    ballStartPosition();
  }

  if (restartGame) {
    board.x += board.dx;

    if (!ball.dx && !ball.dy) {
      ball.x = board.x + board.width / 2 - ballSize / 2;
    }

    if (ball.y > canvas.height) {
      ballStartPosition();
      gameCount--;
      lose = true;
      if (gameCount > 0) {
        description.classList.remove("info__description--none");
      }

      if (gameCount === 0) {
        message.textContent = "YOU LOSE";
      }
    }

    if (touch(ball, board)) {
      if (ball.y + ball.radius - ball.speed <= board.y) {
        ball.dy *= -1;
        ball.y = board.y - ball.radius;
      } else if (ball.x <= board.x + ball.radius) {
        ball.dx *= -1;
        ball.x = board.x - ball.speed - ball.radius;
      } else {
        ball.dx *= -1;
        ball.x = board.x + board.width + ball.speed;
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      if (touch(ball, block)) {
        blocks.splice(i, 1);
        count++;
        if (
          ball.y + ball.radius + ball.speed <= block.y ||
          ball.y >= block.y + block.height - ball.speed
        ) {
          ball.dy *= -1;
        } else {
          ball.dx *= -1;
        }
        break;
      }
    }
  }
}


function draw() {
  drawBoard();
  drawBall();
  drawBlocks();
}


function loop() {
  if (lose) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  draw();
  requestAnimationFrame(loop);
}


document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    if (!ball.dx && !ball.dy) {
      if (board.x > 0) {
        board.x -= 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        (ball.x = board.x + board.width / 2 - ballSize / 2), draw();
      }
    } else {
      leftPressed = true;
    }
  } else if (event.code === "ArrowRight") {
    if (!ball.dx && !ball.dy) {
      if (board.x + board.width < canvas.width) {
        board.x += 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        (ball.x = board.x + board.width / 2 - ballSize / 2), draw();
      }
    } else {
      rightPressed = true;
    }
  } else if (event.code === "Space") {
    if (restartGame) {
      if (gameCount > 0) {
        if (!ball.dx && !ball.dy) {
          let arrow = Math.round(Math.random());
          ball.dx = arrow ? ball.speed : -ball.speed;
          ball.dy = -ball.speed;
          description.classList.add("info__description--none");
          lose = false;
          loop();
        }
      }
    }
  }
});


document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    leftPressed = false;
  }

  if (event.code === "ArrowRight") {
    rightPressed = false;
  }
});


restart.addEventListener("click", () => {
  lose = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  restartGame = true;
  count = 0;
  blocks.length = 0;
  createBlocks();
  ballStartPosition();
  draw();
  gameCount = 3;
  message.textContent = "";
  description.classList.remove("info__description--none");
});


start.addEventListener("click", () => {
  start.classList.add("button--start--none");
  restartGame = true;
  createBlocks();
  info.style.display = "block";
  draw();
});
