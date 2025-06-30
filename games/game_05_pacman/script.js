
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,1],
  [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1],
  [1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,0,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,1,'P',1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

canvas.width = maze[0].length * tileSize;
canvas.height = maze.length * tileSize;

let pacman = {
  x: 0,
  y: 0,
  size: tileSize,
  speed: 1,
  direction: null
};

// Initialize Pac-Man position
for (let row = 0; row < maze.length; row++) {
  for (let col = 0; col < maze[row].length; col++) {
    if (maze[row][col] === 'P') {
      pacman.x = col;
      pacman.y = row;
      maze[row][col] = 2; // mark as visited
    }
  }
}

const pacmanImg = new Image();
pacmanImg.src = 'assets/pacman-right/1.png';

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && pacman.direction !== 'down') {
    pacman.direction = 'up';
    pacmanImg.src = 'assets/pacman-up/1.png';
  } else if (e.key === 'ArrowDown' && pacman.direction !== 'up') {
    pacman.direction = 'down';
    pacmanImg.src = 'assets/pacman-down/1.png';
  } else if (e.key === 'ArrowLeft' && pacman.direction !== 'right') {
    pacman.direction = 'left';
    pacmanImg.src = 'assets/pacman-left/1.png';
  } else if (e.key === 'ArrowRight' && pacman.direction !== 'left') {
    pacman.direction = 'right';
    pacmanImg.src = 'assets/pacman-right/1.png';
  }
});

let lastMoveTime = 0;
const moveInterval = 200;

function movePacman(timestamp) {
  if (timestamp - lastMoveTime > moveInterval) {
    lastMoveTime = timestamp;

    let newX = pacman.x;
    let newY = pacman.y;

    if (pacman.direction === 'up') newY--;
    else if (pacman.direction === 'down') newY++;
    else if (pacman.direction === 'left') newX--;
    else if (pacman.direction === 'right') newX++;

    if (maze[newY] && maze[newY][newX] !== 1) {
      pacman.x = newX;
      pacman.y = newY;

      if (maze[newY][newX] === 0) {
        maze[newY][newX] = 2;
      }
    }
  }
}

function drawMaze() {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      let tile = maze[row][col];
      if (tile === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      } else if (tile === 0) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  ctx.drawImage(
    pacmanImg,
    pacman.x * tileSize,
    pacman.y * tileSize,
    tileSize,
    tileSize
  );
}

// Ghosts
const ghosts = [
  { name: 'blinky', x: 5, y: 5, size: tileSize, img: new Image(), direction: 'up' },
  { name: 'pinky', x: 6, y: 5, size: tileSize, img: new Image(), direction: 'left' },
  { name: 'inky', x: 7, y: 5, size: tileSize, img: new Image(), direction: 'up' },
  { name: 'clyde', x: 8, y: 5, size: tileSize, img: new Image(), direction: 'down' }
];

ghosts.forEach(ghost => {
  ghost.img.src = `assets/ghosts/${ghost.name}.png`;
});

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.drawImage(
      ghost.img,
      ghost.x * tileSize,
      ghost.y * tileSize,
      ghost.size,
      ghost.size
    );
  });
}

let lastGhostMoveTime = 0;
const ghostMoveInterval = 150;

function moveGhosts(timestamp) {
  if (timestamp - lastGhostMoveTime > ghostMoveInterval+40) {
    lastGhostMoveTime = timestamp;

    ghosts.forEach(ghost => {
      let newX = ghost.x;
      let newY = ghost.y;

      if (ghost.direction === 'up') newY--;
      else if (ghost.direction === 'down') newY++;
      else if (ghost.direction === 'left') newX--;
      else if (ghost.direction === 'right') newX++;

      if (maze[newY] && maze[newY][newX] !== 1) {
        ghost.x = newX;
        ghost.y = newY;
      } else {
        const directions = ['up', 'down', 'left', 'right'];
        ghost.direction = directions[Math.floor(Math.random() * directions.length)];
      }
    });
  }
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  movePacman(timestamp);
  moveGhosts(timestamp);
  drawPacman();
  drawGhosts();
  requestAnimationFrame(gameLoop);
}

pacmanImg.onload = () => {
  requestAnimationFrame(gameLoop);
};


