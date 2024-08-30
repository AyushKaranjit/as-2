// START BUTTON

let gameStarted = false;
const startBtn = document.getElementsByClassName("start")[0];
const notice = document.getElementsByClassName("notice")[0];
let timerInterval;
const introSound = new Audio("assets/audio/intro.mp3");
const ghostSound = new Audio("assets/audio/ghost.mp3");
ghostSound.loop = true;
ghostSound.volume = 0.1;
introSound.volume = 0.1;

function startGame() {
  gameStarted = true;
  restartBtn.style.display = "none";
  startBtn.style.display = "none";
  notice.style.display = "none";
  introSound.play();

  // Play the ghost sound after 5 seconds
  setTimeout(() => {
    ghostSound.play();
  }, 5000);

  // Start the game timer and show the pause icon after 4.5 seconds
  setTimeout(() => {
    timerInterval = setInterval(timeplayed, 1000);
    pauseIcon.style.display = "block";
  }, 4500);
}

// ===========================================================================================

// MUTE BUTTON
let isMuted = false;
const soundIcon = document.getElementById("soundIcon");
const muteIcon = document.getElementById("muteIcon");

function toggleMute() {
  isMuted = !isMuted; // Toggle the mute state

  if (isMuted) {
    // Mute all sounds and update icons
    introSound.muted = true;
    ghostSound.muted = true;
    hitSound.muted = true;
    deathSound.muted = true;
    wakawakaSound.muted = true;
    soundIcon.style.display = "none";
    muteIcon.style.display = "block";
  } else {
    // Unmute all sounds and update icons
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
  isPaused = !isPaused; // Toggle the pause state

  if (isPaused) {
    pauseGame(); // Pause the game
    pauseIcon.style.display = "none";
    playIcon.style.display = "block";
  } else {
    resumeGame(); // Resume the game
    pauseIcon.style.display = "block";
    playIcon.style.display = "none";
  }
}

function pauseGame() {
  ghostSound.pause(); // Pause the ghost sound
  clearInterval(timerInterval); // Stop the game timer
  isMoving = false; // Stop game movements
}

function resumeGame() {
  if (ghostSound.paused) {
    ghostSound.play(); // Play the ghost sound if paused
  }
  timerInterval = setInterval(timeplayed, 1000); // Restart the game timer
  isMoving = true; // Resume game movements
}

//===========================================================================================

// RESTART BUTTON

const restartBtn = document.getElementsByClassName("restart")[0];

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

const main = document.getElementsByTagName("main")[0];

// Maze layout: 1 = Wall, 2 = Player, 3 = Enemy, 0 = Point, 4 = Solvable path
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 4, 4, 0, 0, 0, 4, 0, 1],
  [1, 0, 4, 0, 4, 4, 4, 4, 4, 1],
  [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
  [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
  [1, 0, 4, 0, 4, 4, 0, 4, 4, 1],
  [1, 0, 4, 4, 0, 4, 4, 4, 0, 1],
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

randomizedEnemy();

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

function getRandomHexColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomizeWalls() {
  const borderStyles = [
    "solid",
    "dashed",
    "dotted",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ];
  const randomBorderStyle =
    borderStyles[Math.floor(Math.random() * borderStyles.length)];
  const randomBorderColor = getRandomHexColor();
  const randomBackgroundColor = getRandomHexColor();

  const walls = document.getElementsByClassName("wall");
  for (let i = 0; i < walls.length; i++) {
    let wall = walls[i];
    wall.style.borderStyle = randomBorderStyle;
    wall.style.borderColor = randomBorderColor;
    wall.style.backgroundColor = randomBackgroundColor;
  }
}

randomizeWalls();
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
function enemyCollidesWithWall(enemy) {
  const enemyBoundary = enemy.getBoundingClientRect();
  const walls = document.getElementsByClassName("wall");

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    const WallBoundary = wall.getBoundingClientRect();

    if (
      enemyBoundary.top < WallBoundary.bottom &&
      enemyBoundary.bottom > WallBoundary.top &&
      enemyBoundary.left < WallBoundary.right &&
      enemyBoundary.right > WallBoundary.left
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

function enemyMovement() {
  if (gameStarted && isMoving && !isPaused) {
    const enemies = document.getElementsByClassName("enemy");

    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      let enemyTop = parseInt(enemy.style.top) || 0;
      let enemyLeft = parseInt(enemy.style.left) || 0;
      let direction = enemy.direction || randomNumber();

      switch (direction) {
        case 1:
          // MOVE DOWN
          enemy.style.top = enemyTop + 10 + "px";
          if (enemyCollidesWithWall(enemy)) {
            enemy.style.top = enemyTop + "px";
            direction = randomNumber();
          }
          break;
        case 2:
          // MOVE UP
          enemy.style.top = enemyTop - 10 + "px";
          if (enemyCollidesWithWall(enemy)) {
            enemy.style.top = enemyTop + "px";
            direction = randomNumber();
          }
          break;
        case 3:
          // MOVE LEFT
          enemy.style.left = enemyLeft - 10 + "px";
          if (enemyCollidesWithWall(enemy)) {
            enemy.style.left = enemyLeft + "px";
            direction = randomNumber();
          }
          break;
        case 4:
          // MOVE RIGHT
          enemy.style.left = enemyLeft + 10 + "px";
          if (enemyCollidesWithWall(enemy)) {
            enemy.style.left = enemyLeft + "px";
            direction = randomNumber();
          }
          break;
      }

      enemy.direction = direction;
    }
  }
}

// Periodically call enemyMovement to update enemy positions after 5.5 seconds
setTimeout(() => {
  setInterval(enemyMovement, 100);
}, 5500);

// ===========================================================================================

// PLAYER MOVEMENT

// Initialize player and player mouth elements
const player = document.getElementById("player");
const playerMouth = player.getElementsByClassName("mouth")[0];
player.style.width = "75%";
player.style.height = "75%";
let playerTop = 0;
let playerLeft = 0;

// Function to move the player based on key presses
function playerMovement() {
  if (gameStarted && isMoving && !isPaused) {
    switch (true) {
      case downPressed:
        playerTop = playerTop + 2;
        player.style.top = playerTop + "px";
        playerMouth.classList = "down";

        if (playerCollidesWithWall()) {
          playerTop = playerTop - 2;
          player.style.top = playerTop + "px";
        }
        playerCollideswithPoint();
        break;
      case upPressed:
        playerTop = playerTop - 2;
        player.style.top = playerTop + "px";
        playerMouth.classList = "up";

        if (playerCollidesWithWall()) {
          playerTop = playerTop + 2;
          player.style.top = playerTop + "px";
        }
        playerCollideswithPoint();
        break;
      case leftPressed:
        playerLeft = playerLeft - 2;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "left";

        if (playerCollidesWithWall()) {
          playerLeft = playerLeft + 2;
          player.style.left = playerLeft + "px";
        }
        playerCollideswithPoint();
        break;
      case rightPressed:
        playerLeft = playerLeft + 2;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "right";

        if (playerCollidesWithWall()) {
          playerLeft = playerLeft - 2;
          player.style.left = playerLeft + "px";
        }
        playerCollideswithPoint();
        break;
    }
  }
}

// Periodically call playerMovement to update player position after 5.5 seconds
setTimeout(() => {
  setInterval(playerMovement, 10);
}, 5500);

// Collision detection with walls for players
function playerCollidesWithWall() {
  const playerBoundary = player.getBoundingClientRect();
  const walls = document.getElementsByClassName("wall");

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    const WallBoundary = wall.getBoundingClientRect();

    if (
      playerBoundary.top < WallBoundary.bottom &&
      playerBoundary.bottom > WallBoundary.top &&
      playerBoundary.left < WallBoundary.right &&
      playerBoundary.right > WallBoundary.left
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
  document
    .getElementsByClassName("time")[0]
    .getElementsByTagName("p")[0].textContent = formatTime(time);
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

function playerCollideswithPoint() {
  const playerBoundary = player.getBoundingClientRect();
  const points = document.getElementsByClassName("point");

  if (points.length === 0) {
    nextLevel();
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const pointBoundary = point.getBoundingClientRect();

    if (
      playerBoundary.top < pointBoundary.bottom &&
      playerBoundary.bottom > pointBoundary.top &&
      playerBoundary.left < pointBoundary.right &&
      playerBoundary.right > pointBoundary.left
    ) {
      point.classList.remove("point");
      score += 10;
      document
        .getElementsByClassName("score")[0]
        .getElementsByTagName("p")[0].textContent = score;
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
}

function showGameOverPrompt() {
  const timePlayed = time; // Store the time played
  const currentLevel = level; // Store the current level
  let playerName = prompt("Enter your name below:");

  // Set playerName to "Anonymous" if the prompt is cancelled or empty
  if (!playerName) {
    playerName = "Anonymous";
  }

  // Retrieve playerInfo from local storage
  let playerInfo = JSON.parse(localStorage.getItem("playerInfo")) || [];

  // Check if the player name already exists
  const existingPlayerIndex = playerInfo.findIndex(
    (entry) => entry.name === playerName
  );

  if (existingPlayerIndex !== -1) {
    // Replace the old data with the new data
    playerInfo[existingPlayerIndex] = {
      name: playerName,
      score: score,
      time: timePlayed,
      level: currentLevel,
    };
  } else {
    // Add new data
    playerInfo.push({
      name: playerName,
      score: score,
      time: timePlayed,
      level: currentLevel,
    });
  }

  // Save the updated playerInfo to local storage
  localStorage.setItem("playerInfo", JSON.stringify(playerInfo));

  updateLeaderboard();
  restartBtn.style.display = "flex";
}

//===========================================================================================

// LEADERBOARD

const leaderboard = document.getElementById("leaderboard");
if (leaderboard) {
  leaderboard.style.wordWrap = "break-word";
  leaderboard.style.wordBreak = "break-all";
}

// Function to update the leaderboard
function updateLeaderboard() {
  const leaderboard = document
    .getElementsByClassName("leaderboard")[0]
    .getElementsByTagName("ol")[0];
  if (!leaderboard) return;

  // Retrieve playerInfo from local storage
  let playerInfo = JSON.parse(localStorage.getItem("playerInfo")) || [];

  // Sort playerInfo first by score in descending order, then by time in ascending order
  playerInfo.sort((a, b) => {
    if (b.score === a.score) {
      return a.time - b.time; // Less time is better
    }
    return b.score - a.score;
  });

  // Clear the current leaderboard
  leaderboard.innerHTML = "";

  // Populate the leaderboard with the sorted playerInfo
  for (let i = 0; i < playerInfo.length; i++) {
    const entry = playerInfo[i];
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
  }
}

// Call updateLeaderboard to display the leaderboard
updateLeaderboard();

// ===========================================================================================

// UPDATE LIVES

let lives = 3;

// Function to display lives
function displayLives() {
  const livesContainer = document.createElement("div");
  livesContainer.id = "lives";
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
  const livesContainer = document.getElementById("lives");
  if (livesContainer) {
    const livesUL = livesContainer.getElementsByTagName("ul")[0];
    if (livesUL && livesUL.children.length > 0) {
      livesUL.removeChild(livesUL.children[0]);
    }
  }
}

// ===========================================================================================

// ENEMY COLLISION

const hitSound = new Audio("assets/audio/hit.wav");
hitSound.volume = 0.1;
const deathSound = new Audio("assets/audio/death.mp3");
deathSound.volume = 1;
// Function to handle the hit animation and disable movement
function EnemyHit() {
  player.classList.add("hit");
  ghostSound.pause();
  ghostSound.currentTime = 0;
  isMoving = false;
  removeLife();
  hitSound.play();

  setTimeout(() => {
    // Stop hit.wav after 2 seconds
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

      gameOverImage.style.display = "flex";

      // Wait for 6 seconds before showing the prompt
      setTimeout(() => {
        gameOverImage.style.display = "none"; // Hide the game over image
        showGameOverPrompt();
      }, 6000);
    }
  }, 2000);
}
// Function to check for enemy collisions
let gameOverState = false;
let collisionCooldown = false;
let collisionInterval = setInterval(playerCollidesWithEnemy, 100);

function playerCollidesWithEnemy() {
  const playerBoundary = player.getBoundingClientRect();
  const enemies = document.getElementsByClassName("enemy");

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyBoundary = enemy.getBoundingClientRect();

    if (
      playerBoundary.top < enemyBoundary.bottom &&
      playerBoundary.bottom > enemyBoundary.top &&
      playerBoundary.left < enemyBoundary.right &&
      playerBoundary.right > enemyBoundary.left
    ) {
      if (!gameOverState && !collisionCooldown) {
        EnemyHit();
        lives--;

        collisionCooldown = true;
        clearInterval(collisionInterval);
        collisionInterval = setInterval(playerCollidesWithEnemy, 4000);

        setTimeout(() => {
          collisionCooldown = false;
          clearInterval(collisionInterval);
          collisionInterval = setInterval(playerCollidesWithEnemy, 100);
        }, 4000);

        if (lives == 0) {
          gameOverState = true;
          gameOver();
        }
      }
    }
  }
}

// Periodically check for enemy collisions
setInterval(playerCollidesWithEnemy, 100);

// ===========================================================================================

// NEXT LEVEL

let level = 1;
enemiesCreated = 1;
wallsCreated = 5;
function nextLevel() {
  main.innerHTML = "";
  maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 4, 4, 0, 0, 0, 4, 0, 1],
    [1, 0, 4, 0, 4, 4, 4, 4, 4, 1],
    [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
    [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
    [1, 0, 4, 0, 4, 4, 0, 4, 4, 1],
    [1, 0, 4, 4, 0, 4, 4, 4, 0, 1],
    [1, 4, 0, 0, 4, 0, 4, 4, 0, 1],
    [1, 4, 4, 4, 0, 0, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  wallsCreated += 1;
  let newWalls = Math.min(wallsCreated, 10);
  for (let i = 0; i < newWalls; i++) {
    randomizedMaze();
  }

  enemiesCreated++;

  let newEnemies = Math.min(enemiesCreated, 4);
  for (let i = 0; i < newEnemies; i++) {
    randomizedEnemy();
  }

  generateMaze(maze);

  level++;
  document
    .getElementsByClassName("level")[0]
    .getElementsByTagName("p")[0].textContent = level;

  randomizeWalls();

  const player = document.getElementById("player");
  const playerMouth = player.getElementsByClassName("mouth")[0];
  player.style.width = "75%";
  player.style.height = "75%";
  let playerTop = 0;
  let playerLeft = 0;
  let isMoving = true;

  // Function to move the player based on key presses
  function playerMovement() {
    if (gameStarted && isMoving && !isPaused) {
      switch (true) {
        case downPressed:
          playerTop = playerTop + 2;
          player.style.top = playerTop + "px";
          playerMouth.classList = "down";

          if (playerCollidesWithWall()) {
            playerTop = playerTop - 2;
            player.style.top = playerTop + "px";
          }
          playerCollideswithPoint();
          break;

        case upPressed:
          playerTop = playerTop - 2;
          player.style.top = playerTop + "px";
          playerMouth.classList = "up";

          if (playerCollidesWithWall()) {
            playerTop = playerTop + 2;
            player.style.top = playerTop + "px";
          }
          playerCollideswithPoint();
          break;

        case leftPressed:
          playerLeft = playerLeft - 2;
          player.style.left = playerLeft + "px";
          playerMouth.classList = "left";

          if (playerCollidesWithWall()) {
            playerLeft = playerLeft + 2;
            player.style.left = playerLeft + "px";
          }
          playerCollideswithPoint();
          break;

        case rightPressed:
          playerLeft = playerLeft + 2;
          player.style.left = playerLeft + "px";
          playerMouth.classList = "right";

          if (playerCollidesWithWall()) {
            playerLeft = playerLeft - 2;
            player.style.left = playerLeft + "px";
          }
          playerCollideswithPoint();
          break;
      }
    }
  }
  // Periodically call playerMovement to update player position
  setInterval(playerMovement, 10);

  function playerCollidesWithWall() {
    const playerBoundary = player.getBoundingClientRect();
    const walls = document.getElementsByClassName("wall");

    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      const WallBoundary = wall.getBoundingClientRect();

      if (
        playerBoundary.top < WallBoundary.bottom &&
        playerBoundary.bottom > WallBoundary.top &&
        playerBoundary.left < WallBoundary.right &&
        playerBoundary.right > WallBoundary.left
      ) {
        // Collision detected with wall
        return true;
      }
    }

    // No collision with walls
    return false;
  }

  function playerCollideswithPoint() {
    const playerBoundary = player.getBoundingClientRect();
    const points = document.getElementsByClassName("point");

    if (points.length === 0) {
      nextLevel();
    }

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const pointBoundary = point.getBoundingClientRect();

      if (
        playerBoundary.top < pointBoundary.bottom &&
        playerBoundary.bottom > pointBoundary.top &&
        playerBoundary.left < pointBoundary.right &&
        playerBoundary.right > pointBoundary.left
      ) {
        point.classList.remove("point");
        score += 10;
        document
          .getElementsByClassName("score")[0]
          .getElementsByTagName("p")[0].textContent = score;
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

  function gameOver() {
    ghostSound.pause();
    ghostSound.currentTime = 0;
    stopTimer();
    gameStarted = false;
    player.classList.add("dead");
  }

  function showGameOverPrompt() {
    const timePlayed = time; // Store the time played
    const currentLevel = level; // Store the current level
    let playerName = prompt("Enter your name below:");

    // Set playerName to "Anonymous" if the prompt is cancelled or empty
    if (!playerName) {
      playerName = "Anonymous";
    }

    // Retrieve playerInfo from local storage
    let playerInfo = JSON.parse(localStorage.getItem("playerInfo")) || [];

    // Check if the player name already exists
    const existingPlayerIndex = playerInfo.findIndex(
      (entry) => entry.name === playerName
    );

    if (existingPlayerIndex !== -1) {
      // Replace the old data with the new data
      playerInfo[existingPlayerIndex] = {
        name: playerName,
        score: score,
        time: timePlayed,
        level: currentLevel,
      };
    } else {
      // Add new data
      playerInfo.push({
        name: playerName,
        score: score,
        time: timePlayed,
        level: currentLevel,
      });
    }

    // Save the updated playerInfo to local storage
    localStorage.setItem("playerInfo", JSON.stringify(playerInfo));

    updateLeaderboard();
    restartBtn.style.display = "flex";
  }

  updateLeaderboard();

  function removeLife() {
    const livesContainer = document.getElementById("lives");
    if (livesContainer) {
      const livesUL = livesContainer.getElementsByTagName("ul")[0];
      if (livesUL && livesUL.children.length > 0) {
        livesUL.removeChild(livesUL.children[0]);
      }
    }
  }

  function EnemyHit() {
    player.classList.add("hit");
    ghostSound.pause();
    ghostSound.currentTime = 0;
    isMoving = false;
    removeLife();
    hitSound.play();

    setTimeout(() => {
      // Stop hit.wav after 2 seconds
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

        gameOverImage.style.display = "flex";

        // Wait for 6 seconds before showing the prompt
        setTimeout(() => {
          gameOverImage.style.display = "none"; // Hide the game over image
          showGameOverPrompt();
        }, 6000);
      }
    }, 2000);
  }

  let gameOverState = false;
  let collisionCooldown = false;
  let collisionInterval = setInterval(playerCollidesWithEnemy, 100);

  function playerCollidesWithEnemy() {
    const playerBoundary = player.getBoundingClientRect();
    const enemies = document.getElementsByClassName("enemy");

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const enemyBoundary = enemy.getBoundingClientRect();

      if (
        playerBoundary.top < enemyBoundary.bottom &&
        playerBoundary.bottom > enemyBoundary.top &&
        playerBoundary.left < enemyBoundary.right &&
        playerBoundary.right > enemyBoundary.left
      ) {
        if (!gameOverState && !collisionCooldown) {
          EnemyHit();
          lives--;

          collisionCooldown = true;
          clearInterval(collisionInterval);
          collisionInterval = setInterval(playerCollidesWithEnemy, 4000);

          setTimeout(() => {
            collisionCooldown = false;
            clearInterval(collisionInterval);
            collisionInterval = setInterval(playerCollidesWithEnemy, 100);
          }, 4000);

          if (lives == 0) {
            gameOverState = true;
            gameOver();
          }
        }
      }
    }
  }

  setInterval(playerCollidesWithEnemy, 100);
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
    localStorage.removeItem("playerInfo");
    updateLeaderboard();
  }
});

// Function to handle button events
function handleButtonEvent(event, direction, isPressed) {
  if (direction === "left") {
    leftPressed = isPressed;
  }
  if (direction === "right") {
    rightPressed = isPressed;
  }
  if (direction === "up") {
    upPressed = isPressed;
  }
  if (direction === "down") {
    downPressed = isPressed;
  }
}

// Array of button configurations
const buttons = [
  { id: "lbttn", direction: "left" },
  { id: "rbttn", direction: "right" },
  { id: "ubttn", direction: "up" },
  { id: "dbttn", direction: "down" },
];

// Loop through each button configuration
for (let i = 0; i < buttons.length; i++) {
  const button = buttons[i];

  // Get the button element by its ID
  const btnElement = document.getElementById(button.id);

  // Add event listeners for when the button is pressed
  btnElement.addEventListener("mousedown", function (event) {
    handleButtonEvent(event, button.direction, true);
  });

  // Add event listeners for when the button is released
  btnElement.addEventListener("mouseup", function (event) {
    handleButtonEvent(event, button.direction, false);
  });

  // Add event listener for when the mouse leaves the button
  btnElement.addEventListener("mouseleave", function (event) {
    handleButtonEvent(event, button.direction, false);
  });
}
