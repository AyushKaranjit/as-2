
// Flag to track if the game has started
let gameStarted = false; 
const startBtn = document.querySelector('.startDiv');

// Function to start the game: hides the start button and sets gameStarted to true
function startGame() {
    gameStarted = true;
    startBtn.style.display = 'none';
    console.log('Game started');
}

// Event listener for the start button to trigger the startGame function
startBtn.addEventListener('click', startGame);

// Flag to track which keys are pressed
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');

// Maze layout: 1 = Wall, 2 = Player, 3 = Enemy, 0 = Point
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Number of enemies to place
const numEnemies = 3;

// Find all free spaces (0s) in the maze
let freeSpaces = [];
for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) {
            freeSpaces.push({ x, y });
        }
    }
}

// Randomly place enemies in free spaces
for (let i = 0; i < numEnemies; i++) {
    if (freeSpaces.length === 0) break; // No more free spaces available
    let randomIndex = Math.floor(Math.random() * freeSpaces.length);
    let { x, y } = freeSpaces.splice(randomIndex, 1)[0];
    maze[y][x] = 3; // Place enemy

}

// Populates the maze in the HTML based on the maze array
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

        // Add appropriate classes and IDs to each block based on maze value
        switch (x) {
            case 1:
                block.classList.add('wall');
                break;
            case 2:
                block.id = 'player';
                let mouth = document.createElement('div');
                mouth.classList.add('mouth');
                block.appendChild(mouth);
                break;
            case 3:
                block.classList.add('enemy');
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}



// Event handlers to track key press states
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
        console.log('ArrowUp released');
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
        console.log('ArrowDown released');
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
        console.log('ArrowLeft released');
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
        console.log('ArrowRight released');
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
        console.log('ArrowUp pressed');
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
        console.log('ArrowDown pressed');
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
        console.log('ArrowLeft pressed');
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
        console.log('ArrowRight pressed');
    }
}

//Enemy Movement
function randomNumber() {
    return Math.floor(Math.random() * 4) + 1;
};

let direction = randomNumber();

function moveEnemies() {
    if (!gameStarted) return;
    enemies = document.querySelectorAll('.enemy');

    for (let enemy of enemies){
        let enemyRect = enemy.getBoundingClientRect();
        let enemyTop = parseInt(enemy.style.top) || 0;
        let enemyLeft = parseInt(enemy.style.left) || 0;
        let direction = enemy.direction || randomNumber();

        switch (direction) {
            case 1: // MOVE DOWN
                newBottom = enemyRect.bottom + 12;
                BottomLeft = document.elementFromPoint(enemyRect.left, newBottom);
                BottomRight = document.elementFromPoint(enemyRect.right, newBottom);

                if (BottomLeft.classList.contains('wall') == false && BottomRight.classList.contains('wall') == false) {
                    enemyTop += 12;
                } else {
                    direction = randomNumber();
                }
                break;

            case 2: // MOVE UP
                newTop = enemyRect.top - 12;
                TopLeft = document.elementFromPoint(enemyRect.left, newTop);
                TopRight = document.elementFromPoint(enemyRect.right, newTop);

                if (TopLeft.classList.contains('wall') == false && TopRight.classList.contains('wall') == false) {
                    enemyTop -= 12;
                } else {
                    direction = randomNumber();
                }
                break;

            case 3: // MOVE LEFT
                newLeft = enemyRect.left - 12;
                TopLeft = document.elementFromPoint(newLeft, enemyRect.top);
                BottomLeft = document.elementFromPoint(newLeft, enemyRect.bottom);

                if (TopLeft.classList.contains('wall') == false && BottomLeft.classList.contains('wall') == false) {
                    enemyLeft -= 12;
                } else {
                    direction = randomNumber();
                }
                break;

            case 4: // MOVE RIGHT
                newRight = enemyRect.right + 12;
                TopRight = document.elementFromPoint(newRight, enemyRect.top);
                BottomRight = document.elementFromPoint(newRight, enemyRect.bottom);

                if (TopRight.classList.contains('wall') == false && BottomRight.classList.contains('wall') == false) {
                    enemyLeft += 12;
                } else {
                    direction = randomNumber();
                }
                break;
        }

        enemy.style.top = enemyTop + 'px';
        enemy.style.left = enemyLeft + 'px';
        enemy.direction = direction;
    };
}

// Periodically call moveEnemies to update enemy positions
setInterval(moveEnemies, 100);


// Initialize player and player mouth elements
const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
player.style.width = '85%';
playerMouth.style.height = '100%';
let playerTop = 0;
let playerLeft = 0;

// Function to move the player based on key presses
function movePlayer() {
    if (gameStarted) {
        // Move player down
        if (downPressed) {
            playerTop = playerTop + 2;
            player.style.top = playerTop + 'px';
            playerMouth.classList = 'down';

            if (checkWallCollision()) {
                playerTop = playerTop - 2;
                player.style.top = playerTop + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        } 
        // Move player up
        else if (upPressed) {
            playerTop = playerTop - 2;
            player.style.top = playerTop + 'px';
            playerMouth.classList = 'up';

            if (checkWallCollision()) {
                playerTop = playerTop + 2;
                player.style.top = playerTop + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        } 
        // Move player left
        else if (leftPressed) {
            playerLeft = playerLeft - 2;
            player.style.left = playerLeft + 'px';
            playerMouth.classList = 'left';

            if (checkWallCollision()) {
                playerLeft = playerLeft + 2;
                player.style.left = playerLeft + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        } 
        // Move player right
        else if (rightPressed) {
            playerLeft = playerLeft + 2;
            player.style.left = playerLeft + 'px';
            playerMouth.classList = 'right';

            if (checkWallCollision()) {
                playerLeft = playerLeft - 2;
                player.style.left = playerLeft + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        }
    }
}

// Periodically call movePlayer to update player position
setInterval(movePlayer, 10);

// Collision detection with walls
function checkWallCollision() {
    const playerRect = player.getBoundingClientRect();
    const walls = document.querySelectorAll('.wall');

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();

        if (
            playerRect.top < wallRect.bottom &&
            playerRect.bottom > wallRect.top &&
            playerRect.left < wallRect.right &&
            playerRect.right > wallRect.left
        ) {
            // Collision detected with wall
            console.log('Collision with wall detected');
            return true;
        }
    }

    // No collision with walls
    return false;
}

// Points Detection
let score = 0;
let maxScore = document.querySelectorAll('.point').length;

function checkPointCollision() {
    const playerRect = player.getBoundingClientRect();
    const points = document.querySelectorAll('.point');

    if (points.length === 0) {
        if (confirm('Congratulations! You have collected all points. Your total score was ' + score + '. Do you want to play again?')) {
            console.log('All points collected. Reloading game.');
            setTimeout(() => {
            window.location.reload();
            }, 1);
        }
    }

    for (let point of points) {
        const pointRect = point.getBoundingClientRect();

        if (
            playerRect.top < pointRect.bottom &&
            playerRect.bottom > pointRect.top &&
            playerRect.left < pointRect.right &&
            playerRect.right > pointRect.left
        ) {
            // Collision detected with point
            console.log('Point collected');
            point.classList.remove('point');
            score += 10;
            document.querySelector('.score p').textContent = score;
        }
    }
}

// Enemy Collision Detection
function checkEnemyCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemies = document.querySelectorAll('.enemy');

    for (let enemy of enemies) {
        const enemyRect = enemy.getBoundingClientRect();

        if (
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top &&
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left
        ) {
            // Collision detected with enemy
            console.log('Collision with enemy detected. Game Over');
            player.classList.add('dead');
            setTimeout(() => {
                if (confirm('Game Over. Your total score was ' + score + '. Do you want to play again?')) {
                window.location.reload();
                }
            }, 1);
        }
    }
}

// Periodically check for enemy collisions
setInterval(checkEnemyCollision, 10);



// Event listeners for key down and up events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Add event listeners for the 'lbttn' button (left movement)
document.getElementById('lbttn').addEventListener('mousedown', () => {
    movePlayer('left');
    leftPressed = true;
    console.log('Left button pressed.');
});
  
document.getElementById('lbttn').addEventListener('mouseup', () => {
    leftPressed = false;
    console.log('Left button released.');
});

document.getElementById('lbttn').addEventListener('touchstart', () => {
    movePlayer('left');
    leftPressed = true;
    console.log('Left button pressed.');
});
  
document.getElementById('lbttn').addEventListener('touchend', () => {
    leftPressed = false;
    console.log('Left button released.');
});

// Add event listeners for the 'ubttn' button (up movement)
document.getElementById('ubttn').addEventListener('mousedown', () => {
    movePlayer('up');
    upPressed = true; 
    console.log('Up button pressed.');
});
  
document.getElementById('ubttn').addEventListener('mouseup', () => {
    upPressed = false;
    console.log('Up button released.');
});

document.getElementById('ubttn').addEventListener('touchstart', () => {
    movePlayer('up');
    upPressed = true; 
    console.log('Up button pressed.');
});
  
document.getElementById('ubttn').addEventListener('touchend', () => {
    upPressed = false;
    console.log('Up button released.');
});

// Add event listeners for the 'rbttn' button (right movement)
document.getElementById('rbttn').addEventListener('mousedown', () => {
    movePlayer('right');
    rightPressed = true;
    console.log('Right button pressed.');
});
  
document.getElementById('rbttn').addEventListener('mouseup', () => {
    rightPressed = false;
    console.log('Right button released.');
});

document.getElementById('rbttn').addEventListener('touchstart', () => {
    movePlayer('right');
    rightPressed = true;
    console.log('Right button pressed.');
});
  
document.getElementById('rbttn').addEventListener('touchend', () => {
    rightPressed = false;
    console.log('Right button released.');
});

// Add event listeners for the 'dbttn' button (down movement)
document.getElementById('dbttn').addEventListener('mousedown', () => {
    movePlayer('down');
    downPressed = true;
    console.log('Down button pressed.');
});
  
document.getElementById('dbttn').addEventListener('mouseup', () => {
    downPressed = false;
    console.log('Down button released.');
});

document.getElementById('dbttn').addEventListener('touchstart', () => {
    movePlayer('down');
    downPressed = true;
    console.log('Down button pressed.');
});
  
document.getElementById('dbttn').addEventListener('touchend', () => {
    downPressed = false;
    console.log('Down button released.');
});

  