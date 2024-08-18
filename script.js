// START BUTTON

let gameStarted = false;
const startBtn = document.querySelector(".start");
let timerInterval;
const introSound = new Audio("assets/audio/intro.mp3");
const ghostSound = new Audio("assets/audio/ghost.mp3");
ghostSound.loop = true;
ghostSound.volume = 0.1;

// MUTE BUTTON
let isMuted = false;
const soundIcon = document.getElementById("soundIcon");
const muteIcon = document.getElementById("muteIcon");

function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    introSound.muted = true;
    ghostSound.muted = true;
    hitSound.muted = true;
    deathSound.muted = true;
    wakawakaSound.muted = true;
    soundIcon.style.display = "none";
    muteIcon.style.display = "block";
  } else {
    introSound.muted = false;
    ghostSound.muted = false;
    hitSound.muted = false;
    deathSound.muted = false;
    wakawakaSound.muted = false;
    soundIcon.style.display = "block";
    muteIcon.style.display = "none";
  }
}

//===========================================================================================

// PAUSE / PLAY BUTTON
// Add these lines at the top of your script.js file
const pauseIcon = document.getElementById("pauseIcon");
const playIcon = document.getElementById("playIcon");

let isPaused = false;

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseGame();
    pauseIcon.style.display = "none";
    playIcon.style.display = "block";
  } else {
    resumeGame();
    pauseIcon.style.display = "block";
    playIcon.style.display = "none";
  }
}

function pauseGame() {
  ghostSound.pause();
  clearInterval(timerInterval);
  isMoving = false;
}

function resumeGame() {
  if (ghostSound.paused) {
    ghostSound.play();
  }
  timerInterval = setInterval(timeplayed, 1000);
  isMoving = true;
}

//===========================================================================================

// Function to start the game
function startGame() {
  gameStarted = true;
  restartBtn.style.display = "none";
  startBtn.style.display = "none";
  introSound.play();
  setTimeout(() => {
    ghostSound.play();
  }, 4500);
  setTimeout(() => {
    timerInterval = setInterval(timeplayed, 1000);
    pauseIcon.style.display = "block";
  }, 4000);
}

// ===========================================================================================

// RESTART BUTTON

const restartBtn = document.querySelector(".restart");

function restartGame() {
  localStorage.setItem("restartFlag", "true");
  location.reload();
}
restartBtn.style.display = "none";

// Check if the page was reloaded to restart the game
if (localStorage.getItem("restartFlag") === "true") {
  localStorage.removeItem("restartFlag");
  startGame();
}

// ===========================================================================================

// MAZE LAYOUT

// Flag to track which keys are pressed
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const clearBtn = document.getElementById("clear");

const main = document.querySelector("main");

// Maze layout: 1 = Wall, 2 = Player, 3 = Enemy, 0 = Point
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 4, 1, 0, 0, 0, 4, 0, 1],
  [1, 0, 4, 0, 4, 4, 4, 4, 4, 1],
  [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
  [1, 0, 4, 1, 0, 0, 4, 4, 4, 1],
  [1, 0, 4, 0, 4, 4, 0, 1, 1, 1],
  [1, 0, 4, 1, 0, 4, 4, 4, 0, 1],
  [1, 4, 0, 0, 4, 0, 4, 4, 0, 1],
  [1, 4, 4, 4, 0, 0, 0, 4, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Randomized the maze layout each time the webpage is refreshed
function randomizedMaze() {
  let row = Math.floor(Math.random() * maze.length);
  let column = Math.floor(Math.random() * maze[row].length);

  if (maze[row][column] == 0) {
    maze[row][column] = 1;
  } else {
    randomizedMaze();
  }
}

for (let i = 0; i < 5; i++) {
  randomizedMaze();
}

// Randomized the enemy placement each time the webpage is refreshed
function randomizedEnemy() {
  let row = Math.floor(Math.random() * maze.length);
  let column = Math.floor(Math.random() * maze[row].length);

  if (maze[row][column] == 0) {
    maze[row][column] = 3;
  } else {
    randomizedEnemy();
  }
}

for (let i = 0; i < 3; i++) {
  randomizedEnemy();
}

// Populates the maze in the HTML based on the maze array
function generateMaze() {
  for (let y of maze) {
    for (let x of y) {
      let block = document.createElement("div");
      block.classList.add("block");

      switch (x) {
        case 1:
          block.classList.add("wall");
          break;
        case 2:
          block.id = "player";
          let mouth = document.createElement("div");
          mouth.classList.add("mouth");
          block.appendChild(mouth);
          break;
        case 3:
          block.classList.add("enemy");
          break;
        default:
          block.classList.add("point");
          block.style.height = "1vh";
          block.style.width = "1vh";
      }

      main.appendChild(block);
    }
  }
}

generateMaze();
// ===========================================================================================

// EVENT HANDLERS TO TRACK KEY PRESS STATES

function keyUp(event) {
  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function keyDown(event) {
  if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
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
  const walls = document.querySelectorAll(".wall");

  for (let wall of walls) {
    const wallRect = wall.getBoundingClientRect();

    if (
      enemyRect.top < wallRect.bottom &&
      enemyRect.bottom > wallRect.top &&
      enemyRect.left < wallRect.right &&
      enemyRect.right > wallRect.left
    ) {
      // Collision detected with wall
      return true;
    }
  }

  // No collision with walls
  return false;
}

// Function to move the enemies
let isMoving = true;

function moveEnemies() {
  if (gameStarted && isMoving && !isPaused) {
    enemies = document.querySelectorAll(".enemy");

    for (let enemy of enemies) {
      let enemyTop = parseInt(enemy.style.top) || 0;
      let enemyLeft = parseInt(enemy.style.left) || 0;
      let direction = enemy.direction || randomNumber();

      if (direction === 1) {
        // MOVE DOWN
        enemy.style.top = enemyTop + 12 + "px";
        if (checkWallCollisionForEnemy(enemy)) {
          enemy.style.top = enemyTop + "px";
          direction = randomNumber();
        }
      }

      if (direction === 2) {
        // MOVE UP
        enemy.style.top = enemyTop - 12 + "px";
        if (checkWallCollisionForEnemy(enemy)) {
          enemy.style.top = enemyTop + "px";
          direction = randomNumber();
        }
      }

      if (direction === 3) {
        // MOVE LEFT
        enemy.style.left = enemyLeft - 12 + "px";
        if (checkWallCollisionForEnemy(enemy)) {
          enemy.style.left = enemyLeft + "px";
          direction = randomNumber();
        }
      }

      if (direction === 4) {
        // MOVE RIGHT
        enemy.style.left = enemyLeft + 12 + "px";
        if (checkWallCollisionForEnemy(enemy)) {
          enemy.style.left = enemyLeft + "px";
          direction = randomNumber();
        }
      }

      enemy.direction = direction;
    }
  }
}

// Periodically call moveEnemies to update enemy positions
setTimeout(() => {
  setInterval(moveEnemies, 100);
}, 5000);

// ===========================================================================================

// PLAYER MOVEMENT

// Initialize player and player mouth elements
const player = document.querySelector("#player");
const playerMouth = player.querySelector(".mouth");
player.style.width = "75%";
player.style.height = "75%";
let playerTop = 0;
let playerLeft = 0;

// Function to move the player based on key presses
function movePlayer() {
  if (gameStarted && isMoving && !isPaused) {
    // Move player down
    if (downPressed) {
      playerTop = playerTop + 2;
      player.style.top = playerTop + "px";
      playerMouth.classList = "down";

      if (checkWallCollisionForPlayer()) {
        playerTop = playerTop - 2;
        player.style.top = playerTop + "px";
      }
      checkPointCollision();
    }
    // Move player up
    else if (upPressed) {
      playerTop = playerTop - 2;
      player.style.top = playerTop + "px";
      playerMouth.classList = "up";

      if (checkWallCollisionForPlayer()) {
        playerTop = playerTop + 2;
        player.style.top = playerTop + "px";
      }
      checkPointCollision();
    }
    // Move player left
    else if (leftPressed) {
      playerLeft = playerLeft - 2;
      player.style.left = playerLeft + "px";
      playerMouth.classList = "left";

      if (checkWallCollisionForPlayer()) {
        playerLeft = playerLeft + 2;
        player.style.left = playerLeft + "px";
      }
      checkPointCollision();
    }
    // Move player right
    else if (rightPressed) {
      playerLeft = playerLeft + 2;
      player.style.left = playerLeft + "px";
      playerMouth.classList = "right";

      if (checkWallCollisionForPlayer()) {
        playerLeft = playerLeft - 2;
        player.style.left = playerLeft + "px";
      }
      checkPointCollision();
    }
  }
}

// Periodically call movePlayer to update player position
setTimeout(() => {
  setInterval(movePlayer, 10);
}, 5000);

// Collision detection with walls for players
function checkWallCollisionForPlayer() {
  const playerRect = player.getBoundingClientRect();
  const walls = document.querySelectorAll(".wall");

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

// ===========================================================================================
// TIME PLAYED
let time = 0;

function timeplayed() {
  time++;
  document.querySelector(".time p").textContent = formatTime(time);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
}

function formatTimeForLeaderboard(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// ===========================================================================================

// Points Detection
let score = 0;
const wakawakaSound = new Audio("assets/audio/wakawaka.wav");
wakawakaSound.volume = 0.1; // Adjust the volume as needed
let wakawakaTimer; // Timer to stop the sound

function checkPointCollision() {
  const playerRect = player.getBoundingClientRect();
  const points = document.querySelectorAll(".point");

  if (points.length === 0) {
    nextLevel();
  }

  for (let point of points) {
    const pointRect = point.getBoundingClientRect();

    if (
      playerRect.top < pointRect.bottom &&
      playerRect.bottom > pointRect.top &&
      playerRect.left < pointRect.right &&
      playerRect.right > pointRect.left
    ) {
      point.classList.remove("point");
      score += 10;
      document.querySelector(".score p").textContent = score;
      wakawakaSound.play();
      wakawakaSound.play();

      if (wakawakaTimer) {
        clearTimeout(wakawakaTimer);
      }

      // Set a new timer to stop the sound after 2 seconds
      wakawakaTimer = setTimeout(() => {
        wakawakaSound.pause();
        wakawakaSound.currentTime = 0;
      }, 250);
    }
  }
}

//===========================================================================================

// GAME OVER
function stopTimer() {
  clearInterval(timerInterval);
}

function gameOver() {
  ghostSound.pause();
  ghostSound.currentTime = 0;
  stopTimer();
  gameStarted = false;
  player.classList.add("dead");

  const timePlayed = time; // Store the time played
  const currentLevel = level; // Store the current level
  setTimeout(() => {
    let playerName = prompt(
      "                    Game Over\nEnter your name below:\n(Ps: Enter the same name if you want to update your previous score or click cancel to remain anonymous) "
    );

    // Set playerName to "Anonymous" if the prompt is cancelled or empty
    if (!playerName) {
      playerName = "Anonymous";
    }

    // Retrieve scores from local storage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Check if the player name already exists
    const existingPlayerIndex = scores.findIndex(
      (entry) => entry.name === playerName
    );

    if (existingPlayerIndex !== -1) {
      // Replace the old data with the new data
      scores[existingPlayerIndex] = {
        name: playerName,
        score: score,
        time: timePlayed,
        level: currentLevel,
      };
    } else {
      // Add new data
      scores.push({
        name: playerName,
        score: score,
        time: timePlayed,
        level: currentLevel,
      });
    }

    // Save the updated scores to local storage
    localStorage.setItem("scores", JSON.stringify(scores));

    updateLeaderboard();
    restartBtn.style.display = "flex";
  }, 3000);
}

//===========================================================================================

// LEADERBOARD

const leaderboard = document.querySelector(".leaderboard");
if (leaderboard) {
  leaderboard.style.wordWrap = "break-word";
  leaderboard.style.wordBreak = "break-all";
}

// Function to update the leaderboard
// Function to update the leaderboard
function updateLeaderboard() {
  const leaderboard = document.querySelector(".leaderboard ol");
  if (!leaderboard) return;

  // Retrieve scores from local storage
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  // Sort scores first by score in descending order, then by time in ascending order
  scores.sort((a, b) => {
    if (b.score === a.score) {
      return a.time - b.time; // Less time is better
    }
    return b.score - a.score;
  });

  // Clear the current leaderboard
  leaderboard.innerHTML = "";

  // Populate the leaderboard with the sorted scores
  scores.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `${
      entry.name
    }<br><p style="font-size: 1em; margin-top: 0.5em; margin-left: 0em;">Score: ${
      entry.score
    }<br><p style="font-size: 1em; margin-top: 0.5em; margin-left: 0em;"> Level: ${
      entry.level
    }<br> <p style="font-size: 1em; margin-top: 0.5em; margin-left: 0em;">Time : ${formatTimeForLeaderboard(
      entry.time
    )}</p>`;
    leaderboard.appendChild(li);
  });
}

// Call updateLeaderboard to display the leaderboard
updateLeaderboard();

// ===========================================================================================

// UPDATE LIVES

let lives = 3;

// Function to display lives
function displayLives() {
  const livesContainer = document.createElement("div");
  livesContainer.classList.add("lives");

  // Create and add the h1 element
  const livesHeader = document.createElement("h1");
  livesHeader.textContent = "Lives:";
  livesContainer.appendChild(livesHeader);

  const livesList = document.createElement("ul");

  for (let i = 0; i < lives; i++) {
    const life = document.createElement("li");
    life.classList.add("life");
    livesList.appendChild(life);
  }

  livesContainer.appendChild(livesList);
  document.body.appendChild(livesContainer);
}

// Call displayLives at the start of the game
displayLives();

// Function to remove one life
function removeLife() {
  const livesUL = document.querySelector(".lives ul");
  if (livesUL.children.length > 0) {
    livesUL.removeChild(livesUL.children[0]);
  }
}

// ===========================================================================================

// ENEMY COLLISION

// Function to handle the hit animation and disable movement
// Create a new Audio object for hit.mp3
const hitSound = new Audio("assets/audio/hit.mp3");
hitSound.volume = 0.1;
const deathSound = new Audio("assets/audio/death.wav");
deathSound.volume = 0.1;
// Function to handle the hit animation and disable movement
function EnemyHit() {
  player.classList.add("hit");
  ghostSound.pause();
  ghostSound.currentTime = 0;
  isMoving = false;
  ghostSound.pause();
  ghostSound.currentTime = 0;
  removeLife();

  // Play hit.mp3
  hitSound.play();

  setTimeout(() => {
    // Stop hit.mp3 after 2 seconds
    hitSound.pause();
    hitSound.currentTime = 0;

    // Resume ghost.mp3
    ghostSound.play();
    player.classList.remove("hit");
    isMoving = true;
    if (lives == 0) {
      isMoving = false;
      ghostSound.pause();
      ghostSound.currentTime = 0;
      deathSound.play();
    }
  }, 2000);
}
// Function to check for enemy collisions
let gameOverState = false;
let collisionCooldown = false;
let collisionInterval = setInterval(checkEnemyCollision, 100);

function checkEnemyCollision() {
  const playerRect = player.getBoundingClientRect();
  const enemies = document.querySelectorAll(".enemy");

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

        collisionCooldown = true;
        clearInterval(collisionInterval);
        collisionInterval = setInterval(checkEnemyCollision, 3000);

        setTimeout(() => {
          collisionCooldown = false;
          clearInterval(collisionInterval);
          collisionInterval = setInterval(checkEnemyCollision, 100);
        }, 3000);

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

// NEXT LEVEL

let level = 1;

function nextLevel() {
  main.innerHTML = "";
  maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 4, 1, 0, 0, 0, 4, 0, 1],
    [1, 0, 4, 0, 4, 4, 4, 4, 4, 1],
    [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
    [1, 0, 4, 1, 0, 0, 4, 4, 4, 1],
    [1, 0, 4, 0, 4, 4, 0, 1, 1, 1],
    [1, 0, 4, 1, 0, 4, 4, 4, 0, 1],
    [1, 4, 0, 0, 4, 0, 4, 4, 0, 1],
    [1, 4, 4, 4, 0, 0, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  for (let i = 0; i < 5; i++) {
    randomizedMaze();
  }

  function randomizedEnemy() {
    let row = Math.floor(Math.random() * maze.length);
    let column = Math.floor(Math.random() * maze[row].length);

    if (maze[row][column] == 0) {
      maze[row][column] = 3;
    } else {
      randomizedEnemy();
    }
  }

  for (let i = 0; i < 3; i++) {
    randomizedEnemy();
  }

  generateMaze(maze);

  level++;
  document.querySelector(".level p").textContent = level;

  const player = document.querySelector("#player");
  const playerMouth = player.querySelector(".mouth");
  player.style.width = "75%";
  player.style.height = "75%";
  let playerTop = 0;
  let playerLeft = 0;
  let isMoving = true;

  // Function to move the player based on key presses
  function movePlayer() {
    if (gameStarted && isMoving && !isPaused) {
      // Move player down
      if (downPressed) {
        playerTop = playerTop + 2;
        player.style.top = playerTop + "px";
        playerMouth.classList = "down";

        if (checkWallCollisionForPlayer()) {
          playerTop = playerTop - 2;
          player.style.top = playerTop + "px";
        }
        checkPointCollision();
      }
      // Move player up
      else if (upPressed) {
        playerTop = playerTop - 2;
        player.style.top = playerTop + "px";
        playerMouth.classList = "up";

        if (checkWallCollisionForPlayer()) {
          playerTop = playerTop + 2;
          player.style.top = playerTop + "px";
        }
        checkPointCollision();
      }
      // Move player left
      else if (leftPressed) {
        playerLeft = playerLeft - 2;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "left";

        if (checkWallCollisionForPlayer()) {
          playerLeft = playerLeft + 2;
          player.style.left = playerLeft + "px";
        }
        checkPointCollision();
      }
      // Move player right
      else if (rightPressed) {
        playerLeft = playerLeft + 2;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "right";

        if (checkWallCollisionForPlayer()) {
          playerLeft = playerLeft - 2;
          player.style.left = playerLeft + "px";
        }
        checkPointCollision();
      }
    }
  }
  // Periodically call movePlayer to update player position
  setInterval(movePlayer, 10);

  function checkWallCollisionForPlayer() {
    const playerRect = player.getBoundingClientRect();
    const walls = document.querySelectorAll(".wall");

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

  function checkPointCollision() {
    const playerRect = player.getBoundingClientRect();
    const points = document.querySelectorAll(".point");

    if (points.length === 0) {
      nextLevel();
    }

    for (let point of points) {
      const pointRect = point.getBoundingClientRect();

      if (
        playerRect.top < pointRect.bottom &&
        playerRect.bottom > pointRect.top &&
        playerRect.left < pointRect.right &&
        playerRect.right > pointRect.left
      ) {
        point.classList.remove("point");
        score += 10;
        document.querySelector(".score p").textContent = score;
        wakawakaSound.play();
        wakawakaSound.play();

        if (wakawakaTimer) {
          clearTimeout(wakawakaTimer);
        }

        wakawakaTimer = setTimeout(() => {
          wakawakaSound.pause();
          wakawakaSound.currentTime = 0;
        }, 250);
      }
    }
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function formatTimeForLeaderboard(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  function gameOver() {
    ghostSound.pause();
    ghostSound.currentTime = 0;
    stopTimer();
    gameStarted = false;
    player.classList.add("dead");

    const timePlayed = time; // Store the time played
    const currentLevel = level; // Store the current level
    setTimeout(() => {
      let playerName = prompt(
        "                    Game Over\nEnter your name below:\n(Ps: Enter the same name if you want to update your previous score or click cancel to remain anonymous) "
      );

      // Set playerName to "Anonymous" if the prompt is cancelled or empty
      if (!playerName) {
        playerName = "Anonymous";
      }

      // Retrieve scores from local storage
      let scores = JSON.parse(localStorage.getItem("scores")) || [];

      // Check if the player name already exists
      const existingPlayerIndex = scores.findIndex(
        (entry) => entry.name === playerName
      );

      if (existingPlayerIndex !== -1) {
        // Replace the old data with the new data
        scores[existingPlayerIndex] = {
          name: playerName,
          score: score,
          time: timePlayed,
          level: currentLevel,
        };
      } else {
        // Add new data
        scores.push({
          name: playerName,
          score: score,
          time: timePlayed,
          level: currentLevel,
        });
      }

      // Save the updated scores to local storage
      localStorage.setItem("scores", JSON.stringify(scores));

      updateLeaderboard();
      restartBtn.style.display = "flex";
    }, 3000);
  }

  const leaderboard = document.querySelector(".leaderboard");
  if (leaderboard) {
    leaderboard.style.wordWrap = "break-word";
    leaderboard.style.wordBreak = "break-all";
  }

  // Function to update the leaderboard
  function updateLeaderboard() {
    const leaderboard = document.querySelector(".leaderboard ol");
    if (!leaderboard) return;

    // Retrieve scores from local storage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Sort scores first by score in descending order, then by time in ascending order
    scores.sort((a, b) => {
      if (b.score === a.score) {
        return a.time - b.time; // Less time is better
      }
      return b.score - a.score;
    });

    // Clear the current leaderboard
    leaderboard.innerHTML = "";

    // Populate the leaderboard with the sorted scores
    scores.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `${
        entry.name
      }<br><p style="font-size: 1em; margin-top: 0.5em; margin-left: 0em;">Score: ${
        entry.score
      }<br><p style="font-size: 1em; margin-top: 0.5em; margin-left: 0em;"> Level: ${
        entry.level
      }<br> <p style="font-size: 1em; margin-top: 0.5em; margin-left: 0em;">Time : ${formatTimeForLeaderboard(
        entry.time
      )}</p>`;
      leaderboard.appendChild(li);
    });
  }

  // Call updateLeaderboard to display the leaderboard
  updateLeaderboard();

  function removeLife() {
    const livesUL = document.querySelector(".lives ul");
    if (livesUL.children.length > 0) {
      livesUL.removeChild(livesUL.children[0]);
    }
  }

  function EnemyHit() {
    player.classList.add("hit");
    ghostSound.pause();
    ghostSound.currentTime = 0;
    wakawakaSound.pause();
    wakawakaSound.currentTime = 0;
    isMoving = false;
    removeLife();

    // Play hit.mp3
    hitSound.play();

    setTimeout(() => {
      // Stop hit.mp3 after 2 seconds
      hitSound.pause();
      hitSound.currentTime = 0;

      // Resume ghost.mp3
      ghostSound.play();
      player.classList.remove("hit");
      isMoving = true;
      if (lives == 0) {
        isMoving = false;
        ghostSound.pause();
        ghostSound.currentTime = 0;
        deathSound.play();
      }
    }, 2000);
  }

  let gameOverState = false;
  let collisionCooldown = false;
  let collisionInterval = setInterval(checkEnemyCollision, 100);

  function checkEnemyCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemies = document.querySelectorAll(".enemy");

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

          collisionCooldown = true;
          clearInterval(collisionInterval);
          collisionInterval = setInterval(checkEnemyCollision, 3000);

          setTimeout(() => {
            collisionCooldown = false;
            clearInterval(collisionInterval);
            collisionInterval = setInterval(checkEnemyCollision, 100);
          }, 3000);

          if (lives == 0) {
            gameOverState = true;
            gameOver();
          }
        }
      }
    }
  }

  setInterval(checkEnemyCollision, 100);
}

// ===========================================================================================

// ALL THE EVENT LISTENERS

// Event listeners for key down and up events
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

soundIcon.addEventListener("click", toggleMute);
muteIcon.addEventListener("click", toggleMute);

pauseIcon.addEventListener("click", togglePause);
playIcon.addEventListener("click", togglePause);

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

clearBtn.addEventListener("click", function () {
  const confirmation = confirm(
    "Are you sure you want to clear the leaderboard?"
  );
  if (confirmation) {
    localStorage.removeItem("scores");
    updateLeaderboard();
  }
});

// Function to handle button events
const handleButtonEvent = (event, direction, isPressed) => {
  if (direction === "left") leftPressed = isPressed;
  if (direction === "right") rightPressed = isPressed;
  if (direction === "up") upPressed = isPressed;
  if (direction === "down") downPressed = isPressed;
};

// Add event listeners for the buttons
const buttons = [
  { id: "lbttn", direction: "left" },
  { id: "rbttn", direction: "right" },
  { id: "ubttn", direction: "up" },
  { id: "dbttn", direction: "down" },
];

buttons.forEach((button) => {
  const btnElement = document.getElementById(button.id);
  ["mousedown"].forEach((event) => {
    btnElement.addEventListener(event, () =>
      handleButtonEvent(event, button.direction, true)
    );
  });
  ["mouseup", "mouseleave"].forEach((event) => {
    btnElement.addEventListener(event, () =>
      handleButtonEvent(event, button.direction, false)
    );
  });
});
