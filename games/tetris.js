const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 300;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 10;
const blockSize = 30;

const tetrominoes = [
  [[1, 1, 1, 1]],  // I
  [[1, 1], [1, 1]],  // O
  [[1, 1, 0], [0, 1, 1]],  // S
  [[0, 1, 1], [1, 1, 0]],  // Z
  [[1, 1, 1], [0, 1, 0]],  // T
  [[1, 1, 1], [1, 0, 0]],  // L
  [[1, 1, 1], [0, 0, 1]]   // J
];

let currentPiece;
let gameInterval;
let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

function randomPiece() {
  const idx = Math.floor(Math.random() * tetrominoes.length);
  return {
    shape: tetrominoes[idx],
    x: Math.floor(cols / 2) - Math.floor(tetrominoes[idx][0].length / 2),
    y: 0
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar el fondo con efecto retro
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibuja las piezas fijas
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = "#FF5733";
        ctx.strokeStyle = "#E2E2E2";
        ctx.lineWidth = 2;
        ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        ctx.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
      }
    }
  }

  // Dibuja la pieza actual
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c]) {
        ctx.fillStyle = "#33FF57";
        ctx.strokeStyle = "#E2E2E2";
        ctx.lineWidth = 2;
        ctx.fillRect((currentPiece.x + c) * blockSize, (currentPiece.y + r) * blockSize, blockSize, blockSize);
        ctx.strokeRect((currentPiece.x + c) * blockSize, (currentPiece.y + r) * blockSize, blockSize, blockSize);
      }
    }
  }
}

function movePiece(dx, dy) {
  currentPiece.x += dx;
  currentPiece.y += dy;
  if (collides()) {
    currentPiece.x -= dx;
    currentPiece.y -= dy;
    return false;
  }
  return true;
}

function rotatePiece() {
  const newShape = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse();
  currentPiece.shape = newShape;
  if (collides()) {
    currentPiece.shape = newShape.reverse(); // Revert if collision occurs
  }
}

function collides() {
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c]) {
        const newX = currentPiece.x + c;
        const newY = currentPiece.y + r;
        if (newX < 0 || newX >= cols || newY >= rows || grid[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function placePiece() {
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c]) {
        grid[currentPiece.y + r][currentPiece.x + c] = 1;
      }
    }
  }
  currentPiece = randomPiece();
  if (collides()) {
    clearInterval(gameInterval);
    alert("Game Over!");
  }
}

function gameLoop() {
  if (!movePiece(0, 1)) {
    placePiece();
  }
  draw();
}

function startTetris() {
  currentPiece = randomPiece();
  gameInterval = setInterval(gameLoop, 500);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") movePiece(-1, 0);
  if (e.key === "ArrowRight") movePiece(1, 0);
  if (e.key === "ArrowDown") movePiece(0, 1);
  if (e.key === "ArrowUp") rotatePiece();
});
