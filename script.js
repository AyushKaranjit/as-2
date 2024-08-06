// IMPORTANT the local storage has a limited amount of storage capacity, so after the capacity has been exceeded, the local storage will be full and the game will not be able to save any more scores and the game will not work. To fix this, you can clear the local storage by running localStorage.clear() in the console.

// START BUTTON

let gameStarted = false; 
const startBtn = document.querySelector('.start');

// Function to start the game
function startGame() {
    gameStarted = true;
    restartBtn.style.display = 'none'; 
    startBtn.style.display = 'none';
    console.log('Game started');
}

// ===========================================================================================

// RESTART BUTTON

const restartBtn = document.querySelector('.restart');

function restartGame() {
    localStorage.setItem('restartFlag', 'true');
    location.reload();
}
restartBtn.style.display = 'none';

// Check if the page was reloaded to restart the game
if (localStorage.getItem('restartFlag') === 'true') {
    localStorage.removeItem('restartFlag');
    startGame();
}

// ===========================================================================================

// MAZE LAYOUT

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

// Randomized the maze layout each time the webpage is refreshed
// function randomizedMaze() {
//     let row = Math.floor(Math.random() * maze.length);
//     let column = Math.floor(Math.random() * maze[row].length);

//     if (maze[row][column] == 0) {
//         maze[row][column] = 1;
//     }
//     else {
//         randomizedMaze();
//     }
// }  

// for (let i = 0; i < 2; i++) {
//     randomizedMaze();
// }

// Randomized the enemy placement each time the webpage is refreshed
function randomizedEnemy() {
    let row = Math.floor(Math.random() * maze.length);
    let column = Math.floor(Math.random() * maze[row].length);

    if (maze[row][column] == 0) {
        maze[row][column] = 3;
    }
    else {
        randomizedEnemy();
    }
}

for (let i = 0; i < 3; i++) {
    randomizedEnemy();
}

// Populates the maze in the HTML based on the maze array
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

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

// ===========================================================================================

// EVENT HANDLERS TO TRACK KEY PRESS STATES

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

// ===========================================================================================

// ENEMY MOVEMENT

// Function to generate a random number between 1 and 4
function randomNumber() {
    return Math.floor(Math.random() * 4) + 1;
}

let direction = randomNumber();

// Collision detection with walls for enemies
function checkWallCollisionForEnemy(enemy) {
    const enemyRect = enemy.getBoundingClientRect();
    const walls = document.querySelectorAll('.wall');

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();

        if (
            enemyRect.top < wallRect.bottom &&
            enemyRect.bottom > wallRect.top &&
            enemyRect.left < wallRect.right &&
            enemyRect.right > wallRect.left
        ) {
            // Collision detected with wall
            console.log('Collision of enemy with wall detected');
            return true;
        }
    }

    // No collision with walls
    return false;
}

// Function to move the enemies
function moveEnemies() {
    if (!gameStarted) return; {
    enemies = document.querySelectorAll('.enemy');

        for (let enemy of enemies) {
            let enemyTop = parseInt(enemy.style.top) || 0;
            let enemyLeft = parseInt(enemy.style.left) || 0;
            let direction = enemy.direction || randomNumber();

            if (direction === 1) { // MOVE DOWN
                enemy.style.top = (enemyTop + 12) + 'px';
                if (checkWallCollisionForEnemy(enemy)) {
                    enemy.style.top = enemyTop + 'px';
                    direction = randomNumber();
                }
            }

            if (direction === 2) { // MOVE UP
                enemy.style.top = (enemyTop - 12) + 'px';
                if (checkWallCollisionForEnemy(enemy)) {
                    enemy.style.top = enemyTop + 'px';
                    direction = randomNumber();
                }
            }

            if (direction === 3) { // MOVE LEFT
                enemy.style.left = (enemyLeft - 12) + 'px';
                if (checkWallCollisionForEnemy(enemy)) {
                    enemy.style.left = enemyLeft + 'px';
                    direction = randomNumber();
                }
            }

            if (direction === 4) { // MOVE RIGHT
                enemy.style.left = (enemyLeft + 12) + 'px';
                if (checkWallCollisionForEnemy(enemy)) {
                    enemy.style.left = enemyLeft + 'px';
                    direction = randomNumber();
                }
            }

            enemy.direction = direction;
        }
    }
}

// Periodically call moveEnemies to update enemy positions
setInterval(moveEnemies, 100);

// ===========================================================================================

// PLAYER MOVEMENT

// Initialize player and player mouth elements
const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;
let isMoving = true;

// Function to move the player based on key presses
function movePlayer() {
    if (gameStarted && isMoving) {
        // Move player down
        if (downPressed) {
            playerTop = playerTop + 1.4;
            player.style.top = playerTop + 'px';
            playerMouth.classList = 'down';

            if (checkWallCollisionForPlayer()) {
                playerTop = playerTop - 1.4;
                player.style.top = playerTop + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        } 
        // Move player up
        else if (upPressed) {
            playerTop = playerTop - 1.4;
            player.style.top = playerTop + 'px';
            playerMouth.classList = 'up';

            if (checkWallCollisionForPlayer()) {
                playerTop = playerTop + 1.4;
                player.style.top = playerTop + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        } 
        // Move player left
        else if (leftPressed) {
            playerLeft = playerLeft - 1.4;
            player.style.left = playerLeft + 'px';
            playerMouth.classList = 'left';

            if (checkWallCollisionForPlayer()) {
                playerLeft = playerLeft + 1.4;
                player.style.left = playerLeft + 'px';
            }
            if (checkPointCollision()) {
                console.log('Point collected');
            }
        } 
        // Move player right
        else if (rightPressed) {
            playerLeft = playerLeft + 1.4;
            player.style.left = playerLeft + 'px';
            playerMouth.classList = 'right';

            if (checkWallCollisionForPlayer()) {
                playerLeft = playerLeft - 1.4;
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

// Collision detection with walls for players
function checkWallCollisionForPlayer() {
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
            console.log('Collision of player with wall detected');
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
        gameStarted = false; 
        setTimeout(() => {
            const playerName = prompt('🎉🥳 Congratulations!! 🎉🥳 Your total score was ' + score + '. Please enter your name:');

             // Save the player's name and score to local storage
            let scores = JSON.parse(localStorage.getItem('scores')) || [];
            scores.push({ name: playerName, score: score });
            localStorage.setItem('scores', JSON.stringify(scores));
            updateLeaderboard();
            restartBtn.style.display = 'flex';
        }, 100);
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

//===========================================================================================

// GAME OVER
function gameOver() {
    gameStarted = false;
    player.classList.add('dead');
    setTimeout(() => {
        const playerName = prompt('Game Over. Your total score was ' + score + '. Please enter your name:');

         // Save the player's name and score to local storage
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({ name: playerName, score: score });
        localStorage.setItem('scores', JSON.stringify(scores));
         
        updateLeaderboard();
        restartBtn.style.display = 'flex';
    }, 3000);
}

//===========================================================================================

// LEADERBOARD

const leaderboard = document.querySelector('.leaderboard');
if (leaderboard) {
    leaderboard.style.wordWrap = 'break-word';
    leaderboard.style.wordBreak = 'break-all';
}

// Function to update the leaderboard
function updateLeaderboard() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    
    // Ensure all scores have a valid name
    scores.forEach(score => {
        if (!score.name) {
            score.name = 'Anonymous';
        }
    });

    // Sort scores first by score in descending order, then by name in ascending order
    scores.sort((a, b) => {
        if (b.score === a.score) {
            return a.name.localeCompare(b.name);
        }
        return b.score - a.score;
    });

    // Get the top 5 scores
    let topScores = scores.slice(0, 5);

    // Display the top 5 scores in the .leaderboard div
    const leaderboard = document.querySelector('.leaderboard');
    leaderboard.innerHTML = '<h2>Leaderboard</h2><ol style="font-size: 1.5em;"></ol>';
    const ol = leaderboard.querySelector('ol');
    topScores.forEach(score => {
        ol.innerHTML += `<li>${score.name}: ${score.score}</li>`;
    });
}

// Call updateLeaderboard to display the leaderboard
updateLeaderboard();


// ===========================================================================================

// UPDATE LIVES

let lives = 3;

// Function to display lives
function displayLives() {
    const livesContainer = document.createElement('div');
    livesContainer.classList.add('lives');
    
    // Create and add the h1 element
    const livesHeader = document.createElement('h1');
    livesHeader.textContent = 'Lives:';
    livesContainer.appendChild(livesHeader);
    
    const livesList = document.createElement('ul');
    
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('li');
        life.classList.add('life');
        livesList.appendChild(life);
    }
    
    livesContainer.appendChild(livesList);
    document.body.appendChild(livesContainer);
}

// Call displayLives at the start of the game
displayLives();

// Function to remove one life
function removeLife() {
    const livesUL = document.querySelector('.lives ul');
    if (livesUL.children.length > 0) {
        livesUL.removeChild(livesUL.children[0]);

    }
}

// ===========================================================================================

// ENEMY COLLISION

// Function to handle the hit animation and disable movement
function EnemyHit() {
    player.classList.add('hit');
    isMoving = false;
    removeLife();
    setTimeout(() => {
        player.classList.remove('hit');
        isMoving = true;
        if (lives == 0) {
            isMoving = false;
        }
    }, 1500);
}



// Function to check for enemy collisions
let gameOverState = false;
let collisionCooldown = false;
let collisionInterval = setInterval(checkEnemyCollision, 100);

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
            if (!gameOverState && !collisionCooldown) {
                EnemyHit();
                lives--;
                console.log(`Life lost! Lives remaining: ${lives}`);
                 

                collisionCooldown = true;
                clearInterval(collisionInterval);
                collisionInterval = setInterval(checkEnemyCollision, 1500);
        
                setTimeout(() => {
                    collisionCooldown = false;
                    clearInterval(collisionInterval);
                    collisionInterval = setInterval(checkEnemyCollision, 100);
                }, 1500);
        
                if (lives == 0) {
                    gameOverState = true;
                    gameOver();
                }
            }
        }
    }
}

// Periodically check for enemy collisions
setInterval(checkEnemyCollision, 100);

// ===========================================================================================

// ALL THE EVENT LISTENERS

// Event listeners for key down and up events
document.addEventListener('keydown', keyDown);

document.addEventListener('keyup', keyUp);

startBtn.addEventListener('click', startGame);

restartBtn.addEventListener('click', restartGame);

// Add event listeners for the 'lbttn' button (left movement)
document.getElementById('lbttn').addEventListener('mousedown', () => {
    movePlayer('fgkfngjnfj,n');
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