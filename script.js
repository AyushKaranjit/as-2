document.addEventListener('DOMContentLoaded', () => {
    let gameStarted = false;
    let score = 0;
    let lives = 3;
    const playerSpeed = 10;

    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');
    const livesList = document.getElementById('livesList');
    const main = document.querySelector('main');

    const player = document.createElement('div');
    player.id = 'player';
    main.appendChild(player);

    let playerTop = 0;
    let playerLeft = 0;

    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1]
    ];

    function populateMaze() {
        main.innerHTML = ''; // Clear the main element
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                let block = document.createElement('div');
                block.classList.add('block');

                if (maze[y][x] === 1) {
                    block.classList.add('wall');
                } else {
                    block.classList.add('point');
                }

                block.style.top = `${y * playerSpeed}px`;
                block.style.left = `${x * playerSpeed}px`;

                main.appendChild(block);

                if (y === 1 && x === 1) {
                    player.style.top = `${y * playerSpeed}px`;
                    player.style.left = `${x * playerSpeed}px`;
                }
            }
        }
    }

    function initializeLives() {
        for (let i = 0; i < lives; i++) {
            let life = document.createElement('li');
            livesList.appendChild(life);
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function movePlayer(event) {
        if (!gameStarted) return;

        let nextTop = playerTop;
        let nextLeft = playerLeft;

        switch (event.key) {
            case 'ArrowUp':
                nextTop -= playerSpeed;
                break;
            case 'ArrowDown':
                nextTop += playerSpeed;
                break;
            case 'ArrowLeft':
                nextLeft -= playerSpeed;
                break;
            case 'ArrowRight':
                nextLeft += playerSpeed;
                break;
        }

        if (!isCollision(nextTop, nextLeft)) {
            playerTop = nextTop;
            playerLeft = nextLeft;
            player.style.top = `${playerTop}px`;
            player.style.left = `${playerLeft}px`;
        }
    }

    function isCollision(top, left) {
        let row = Math.floor(top / playerSpeed);
        let col = Math.floor(left / playerSpeed);
        return maze[row][col] === 1;
    }

    startButton.addEventListener('click', () => {
        gameStarted = true;
        startButton.style.display = 'none';
        populateMaze();
        initializeLives();
        updateScore();
    });

    document.addEventListener('keydown', movePlayer);
});
