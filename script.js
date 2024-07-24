let gamestarted = false;
const startbtn = document.querySelector('.startDiv');

// Hide the start button and initialize the game
function startGame() {
    gamestarted = true;
    startbtn.style.display = 'none';
}

startbtn.addEventListener('click', startGame);

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Populates the maze in the HTML
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



//Player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
player.style.width = '60%';
player.style.height = '60%';
playerMouth.style.height = '100%';
let playerTop = 0;
let playerLeft = 0;



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
            return true;
        }
    }

    // No collision with walls
    return false;
}

// Player movement
function movePlayer() {
    if (gamestarted) {
            if (downPressed) {
            playerTop++;
            player.style.top = playerTop + 'px';
            playerMouth.classList = 'down';

            if (checkWallCollision()) {
                playerTop--;
                player.style.top = playerTop + 'px';
            }
        } else if (upPressed) {
            playerTop--;
            player.style.top = playerTop + 'px';
            playerMouth.classList = 'up';

            if (checkWallCollision()) {
                playerTop++;
                player.style.top = playerTop + 'px';
            }
        } else if (leftPressed) {
            playerLeft--;
            player.style.left = playerLeft + 'px';
            playerMouth.classList = 'left';

            if (checkWallCollision()) {
                playerLeft++;
                player.style.left = playerLeft + 'px';
            }
        } else if (rightPressed) {
            playerLeft++;
            player.style.left = playerLeft + 'px';
            playerMouth.classList = 'right';

            if (checkWallCollision()) {
                playerLeft--;
                player.style.left = playerLeft + 'px';
            }
        }
    }
}

setInterval(movePlayer, 10);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);