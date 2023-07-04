let canvas = document.querySelector("canvas");
let info = document.querySelector(".info");
let message = document.querySelector(".info__message");
let score = document.querySelector(".info__score");
let lives = document.querySelector(".info__lives");
let restart = document.querySelector(".button--restart");
let start = document.querySelector(".button--start");
let gameCount = 3;
let count = 0;
let resGame = false;
let width = 220;
let size = 20;
let boardX = canvas.width / 2 - width / 2;

let ctx = canvas.getContext("2d");

start.style.top = canvas.height / 2 + "px";

let board = {
  xDelta: 0,
  x: boardX,
  y: canvas.height - 100,
  width,
  height: 70,
  speed: 10,
};

let boll = {
  xDelta: 0,
  yDelta: 0,
  x: board.x + board.width / 2 - size / 2,
  y: board.y - size,
  radius: size,
  speed: 2,
};

let blocks = [];

function randomColor() {
  let myRed = Math.floor(Math.random() * 256);
  let myGreen = Math.floor(Math.random() * 256);
  let myBlue = Math.floor(Math.random() * 256);
  return `rgb(${myRed}, ${myGreen}, ${myBlue})`;
}

function createBoard() {
  ctx.fillStyle = "black";
  ctx.fillRect(board.x, board.y, board.width, board.height);
}

function createBoll() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.roundRect(boll.x, boll.y, boll.radius, boll.radius, [size]);
  ctx.fill();
}

function createBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    ctx.fillStyle = blocks[i].color;
    ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
  }
}

function addBlocks() {
  let random = Math.floor(Math.random() * 6) + 3;
  for (let j = 0; j < random; j++) {
    let randomXNum = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < randomXNum; i++) {
      blocks.push({
        x: (i * canvas.width) / randomXNum,
        y: j * 40,
        width: canvas.width / randomXNum,
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

function bollStartPosition() {
  boll.x = boardX + board.width / 2 - size / 2;
  boll.y = board.y - size;
  boll.xDelta = 0;
  boll.yDelta = 0;
  board.x = boardX;
}

function update() {
  board.x += board.xDelta;

  boll.x += boll.xDelta;
  boll.y += boll.yDelta;

  lives.textContent = `YOUR LIVES : ${gameCount}`;
  score.textContent = `YOUR SCORE : ${count}`;

  if (boll.x <= 0 || boll.x + boll.radius >= canvas.width) {
    boll.xDelta *= -1;
  }

  if (boll.y - boll.speed < 0) {
    boll.yDelta *= -1;
  }

  if (board.x + board.speed < 0) {
    board.x = 0;
  } else if (board.x + board.width - board.speed > canvas.width) {
    board.x = canvas.width - board.width;
  }

  if (!blocks.length) {
    message.textContent = "YOU WIN";
    bollStartPosition();
  }

  if (resGame) {
    board.x += board.xDelta;

    if (!boll.xDelta && !boll.yDelta) {
      boll.x = board.x + board.width / 2 - size / 2;
    }

    if (boll.y > canvas.height) {
      bollStartPosition();
      gameCount--;

      if (gameCount === 0) {
        message.textContent = "YOU LOSE";
      }
    }

    if (touch(boll, board)) {
      if (boll.y + boll.radius - boll.speed <= board.y) {
        boll.yDelta *= -1;
        boll.y = board.y - boll.radius;
      } else if (boll.x <= board.x + boll.radius) {
        boll.xDelta *= -1;
        boll.x = board.x - boll.speed - boll.radius;
      } else {
        boll.xDelta *= -1;
        boll.x = board.x + board.width + boll.speed;
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      if (touch(boll, block)) {
        blocks.splice(i, 1);
        count++;
        if (
          boll.y + boll.radius + boll.speed <= block.y ||
          boll.y >= block.y + block.height - boll.speed
        ) {
          boll.yDelta *= -1;
        } else {
          boll.xDelta *= -1;
        }
        break;
      }
    }
  }
}

function draw() {
  createBoard();
  createBoll();
  createBlocks();
}

function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  draw();
}

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    board.xDelta = -board.speed;
  } else if (event.code === "ArrowRight") {
    board.xDelta = board.speed;
  } else if (event.code === "Space") {
    if (resGame) {
      if (gameCount > 0) {
        if (!boll.xDelta && !boll.yDelta) {
          let arrow = Math.round(Math.random());
          boll.xDelta = arrow ? boll.speed : -boll.speed;
          boll.yDelta = -boll.speed;
        }
      }
    }
  }
});

document.addEventListener("keyup", () => {
  board.xDelta = 0;
  if (!boll.xDelta && !boll.yDelta) {
    boll.xDelta = 0;
  }
});

restart.addEventListener("click", () => {
  resGame = true;
  count = 0;
  blocks.length = 0;
  addBlocks();
  bollStartPosition();
  gameCount = 3;
  message.textContent = "";
});

start.addEventListener("click", () => {
  start.classList.add("button--start--none");
  resGame = true;
  addBlocks();
  info.style.display = "block";
  loop();
});
