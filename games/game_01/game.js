
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let stack = [];
let currentBlock = null;
let speed = 2;
let direction = 1;
let score = 0;

function createBlock(y, width) {
  const x = Math.random() * (canvas.width - width);
  return { x, y, width, height: 20 };
}

function drawBlock(block, color = 'lime') {
  ctx.fillStyle = color;
  ctx.fillRect(block.x, block.y, block.width, block.height);
}

function resetGame() {
  stack = [];
  const base = createBlock(canvas.height - 20, 200);
  base.x = (canvas.width - base.width) / 2;
  stack.push(base);
  currentBlock = createBlock(canvas.height - 40, base.width);
  speed = 2;
  score = 0;
  document.getElementById('score').textContent = score;
}

function dropBlock() {
  const prev = stack[stack.length - 1];
  const overlap = Math.min(currentBlock.x + currentBlock.width, prev.x + prev.width) -
                  Math.max(currentBlock.x, prev.x);

  if (overlap <= 0) {
    alert("Game Over!\nYour Score: " + score);
    resetGame();
    return;
  }

  const newWidth = overlap;
  currentBlock.x = Math.max(currentBlock.x, prev.x);
  currentBlock.width = newWidth;
  stack.push({ ...currentBlock });
  score++;
  document.getElementById('score').textContent = score;

  const newY = currentBlock.y - 20;
  currentBlock = createBlock(newY, newWidth);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let block of stack) {
    drawBlock(block, '#0f0');
  }

  if (currentBlock) {
    currentBlock.x += direction * speed;
    if (currentBlock.x <= 0 || currentBlock.x + currentBlock.width >= canvas.width) {
      direction *= -1;
    }
    drawBlock(currentBlock, '#0ff');
  }

  requestAnimationFrame(update);
}

canvas.addEventListener('click', dropBlock);

resetGame();
update();
