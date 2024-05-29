const blueSquare = document.getElementById("blueSquare");
const leftEye = document.getElementById("leftEye");
const rightEye = document.getElementById("rightEye");

// Controls

const forwardSpeed = 30;
const backwardSpeed = 30;
const turnSpeed = 20;
const visionWidth = 50;

let pos = { x: 0, y: 0 };
let rotation = 0;
let direction = { x: 0, y: -1 };

let stopLearning = 0;

const simulationSpeedUp = 1;

document.documentElement.style.setProperty(
  "--transform-duration",
  `${0.15 / simulationSpeedUp}s`
);

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    moveForward();
  } else if (event.key === "ArrowDown") {
    moveBackward();
  } else if (event.key === "ArrowLeft") {
    rotateLeft();
  } else if (event.key === "ArrowRight") {
    rotateRight();
  } else if (event.key === "s") {
    stopLearning = 1;
    saveLearning();
  } else if (event.key === " ") {
    console.log(Q);
  }
});

// Senses

function getVision(point) {
  let leftVisionPixelReduced = [];
  let rightVisionPixelReduced = [];

  let rightDirection = { x: -direction.y, y: direction.x };
  let leftDirection = { x: direction.y, y: -direction.x };

  let rightDiagonalVector = {
    x: rightDirection.x + direction.x,
    y: rightDirection.y + direction.y,
  };
  let leftDiagonalVector = {
    x: leftDirection.x + direction.x,
    y: leftDirection.y + direction.y,
  };

  let xGap = (leftDiagonalVector.x - rightDiagonalVector.x) / 20;
  let yGap = (leftDiagonalVector.y - rightDiagonalVector.y) / 20;

  visionVectorArray = [];
  for (
    let i = 0, vectorX = leftDiagonalVector.x, vectorY = leftDiagonalVector.y;
    i < 21;
    i++, vectorX -= xGap, vectorY -= yGap
  ) {
    visionVectorArray.push({ x: vectorX, y: vectorY });
  }

  let rightEyeLocation = {
    x: pos.x + (visionWidth / 2) * rightDirection.x,
    y: pos.y + (visionWidth / 2) * rightDirection.y,
  };
  let leftEyeLocation = {
    x: pos.x + (visionWidth / 2) * leftDirection.x,
    y: pos.y + (visionWidth / 2) * leftDirection.y,
  };

  leftEye.style.transform = `translate(${leftEyeLocation.x - 5}px, ${
    leftEyeLocation.y - 5
  }px)`;
  rightEye.style.transform = `translate(${rightEyeLocation.x - 5}px, ${
    rightEyeLocation.y - 5
  }px)`;

  let leftVisionPixels = [];
  let rightVisionPixels = [];
  for (
    let vectorIndex = 0;
    vectorIndex < visionVectorArray.length - 1;
    vectorIndex++
  ) {
    let visual = getPixel(
      leftEyeLocation,
      visionVectorArray[vectorIndex],
      visionVectorArray[vectorIndex + 1],
      point
    );
    leftVisionPixels.push(visual);
    visual = getPixel(
      rightEyeLocation,
      visionVectorArray[vectorIndex],
      visionVectorArray[vectorIndex + 1],
      point
    );
    rightVisionPixels.push(visual);
  }

  leftVisionPixelReduced = [];
  for (let i = 0; i < leftVisionPixels.length; i += 4) {
    let pixel = 0;
    for (let j = 0; j < 4; j++) {
      pixel = pixel || leftVisionPixels[i + j];
    }
    leftVisionPixelReduced.push(pixel);
  }

  rightVisionPixelReduced = [];
  for (let i = 0; i < rightVisionPixels.length; i += 4) {
    let pixel = 0;
    for (let j = 0; j < 4; j++) {
      pixel = pixel || rightVisionPixels[i + j];
    }
    rightVisionPixelReduced.push(pixel);
  }

  return leftVisionPixelReduced.concat(rightVisionPixelReduced);
}

function getPixel(eyeLocation, leftVector, rightVector, point) {
  let rightDirection = { x: -leftVector.y, y: leftVector.x };
  let leftDirection = { x: rightVector.y, y: -rightVector.x };

  const pointVectorEye = {
    x: point.x - eyeLocation.x,
    y: point.y - eyeLocation.y,
  };

  const rightComponent =
    leftDirection.x * pointVectorEye.x + leftDirection.y * pointVectorEye.y;
  const leftComponent =
    rightDirection.x * pointVectorEye.x + rightDirection.y * pointVectorEye.y;

  if (rightComponent > 0 && leftComponent > 0) {
    return 1;
  } else {
    return 0;
  }
}

function getTouch(point) {
  return ((pos.x - point.x) ** 2 + (pos.y - point.y) ** 2) ** (1 / 2) < 50;
}

// Actions

const actions = [0, 1, 2, 3, 4];

function moveForward() {
  pos.x += forwardSpeed * direction.x;
  pos.y += forwardSpeed * direction.y;
  updateCharacterHTML();
}

function moveBackward() {
  pos.x -= backwardSpeed * direction.x;
  pos.y -= backwardSpeed * direction.y;
  updateCharacterHTML();
}

function rotateLeft() {
  rotation -= turnSpeed * (Math.PI / 180);
  updateDirection();
  updateCharacterHTML();
}

function rotateRight() {
  rotation += turnSpeed * (Math.PI / 180);
  updateDirection();
  updateCharacterHTML();
}

function updateDirection() {
  direction.x = Math.sin(rotation);
  direction.y = -Math.cos(rotation);
}

function updateCharacterHTML() {
  blueSquare.style.transform = `translate(${pos.x - visionWidth / 2}px, ${
    pos.y - visionWidth / 2
  }px) rotate(${rotation}rad)`;

  let rightDirection = { x: -direction.y, y: direction.x };
  let leftDirection = { x: direction.y, y: -direction.x };

  let rightEyeLocation = {
    x: pos.x + (visionWidth / 2) * (rightDirection.x + direction.x),
    y: pos.y + (visionWidth / 2) * (rightDirection.y + direction.y),
  };
  let leftEyeLocation = {
    x: pos.x + (visionWidth / 2) * (leftDirection.x + direction.x),
    y: pos.y + (visionWidth / 2) * (leftDirection.y + direction.y),
  };

  leftEye.style.transform = `translate(${leftEyeLocation.x - 5}px, ${
    leftEyeLocation.y - 5
  }px)`;
  rightEye.style.transform = `translate(${rightEyeLocation.x - 5}px, ${
    rightEyeLocation.y - 5
  }px)`;
}

function chooseRandomAction() {
  const randomIndex = Math.floor(Math.random() * actions.length);
  return actions[randomIndex];
}

function performAction(action) {
  if (action == 1) {
    moveForward();
  } else if (action == 2) {
    moveBackward();
  } else if (action == 3) {
    rotateLeft();
  } else if (action == 4) {
    rotateRight();
  }
}

// Life Process

let foodStock = 5;
const maxFoodStock = 5;
const metabolism = 1; // count of food being digested each second

const foodDigestionInterval = 1000 / metabolism / simulationSpeedUp;
let foodDigestionIntervalID;

let hunger = 0;
const hungerPoint = 5;

const lifeStartTimeout = 500 / simulationSpeedUp;

function startLife() {
  return new Promise((resolve) => {
    setupCharacter();
    setupEnvironment();

    setTimeout(() => {
      resolve();
    }, lifeStartTimeout);
  });
}

function setupCharacter() {
  pos = { x: 0, y: 0 };
  rotation = 0;
  direction = { x: 0, y: -1 };
  updateCharacterHTML();

  startBodyFunctions();
}

function startBodyFunctions() {
  foodStock = 5;
  updateFoodStockHTML();
  startDigestion();
}

function stopBodyFunctions() {
  stopDigestion();
}

function updateFoodStockHTML() {
  const lifeValueElement = document.getElementById("lifeValue");
  lifeValueElement.textContent = foodStock;
}

function startDigestion() {
  foodDigestionIntervalID = setInterval(
    decreaseFoodStock,
    foodDigestionInterval
  );
}

function decreaseFoodStock() {
  foodStock--;
  updateFoodStockHTML();
  updateHunger();
}

function increaseFoodStock(amount) {
  foodStock += amount;
  if (foodStock > maxFoodStock) {
    foodStock = maxFoodStock;
  }
  updateFoodStockHTML();
  updateHunger();
}

function updateHunger() {
  if (foodStock >= hungerPoint) {
    hunger = 0;
  } else {
    hunger = hungerPoint - foodStock;
  }
}

function stopDigestion() {
  clearInterval(foodDigestionIntervalID);
}

function isEnd() {
  const isFoodStockEmpty = foodStock <= 0;
  return isFoodStockEmpty;
}

function endLife() {
  const endText = document.getElementById("endText");
  endText.style.display = "block";
  stopBodyFunctions();
}

// Character Status

function characterStatus() {
  // const hungerStatus = hungerPoint - hunger;
  const hungerStatus = foodStock;

  return hungerStatus;
}

function updateCharacterStatus() {
  isFoodCaptured();
}

// Environment

let food = { x: 0, y: -100 };

const foodSpan = 400;

function spawnFood() {
  let foodX;
  let foodY;
  do {
    foodX = Math.floor((Math.random() - 0.5) * foodSpan);
    foodY = Math.floor((Math.random() - 0.5) * foodSpan);
  } while (((foodX - pos.x) ** 2 + (foodY - pos.y) ** 2) ** (1 / 2) < 100);
  food.x = foodX;
  food.y = foodY;
  updateFoodHTML(food);
}

function updateFoodHTML(newfood) {
  const foodElement = document.getElementById("circle");
  foodElement.style.transform = `translate(${newfood.x}px, ${newfood.y}px)`;
}

function setupEnvironment() {
  spawnFood();
}

// Interactions

function isFoodCaptured() {
  if (getTouch(food)) {
    spawnFood();
    increaseFoodStock(5);
    return 1;
  }
  return 0;
}

// ----- Reinforcement Learning -----

// Parameters

const numStates = 529;
const numActions = 5;
const numEpisodes = 50;
const alpha = 0.5;
const gamma = 0.5;

const actionInterval = 100 / simulationSpeedUp;

// State

function getState() {
  const foodState = getFoodState();
  return foodState;
}

function getFoodState() {
  let foodVision = getVision(food);
  let state = 0;
  for (let i = 0; i < foodVision.length; i++) {
    if (foodVision[i]) {
      state += 2 ** i;
    }
  }
  return state;
}

// Learning

let Q = [];

function loadLearning() {
  fetch("/load-learning")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server coudn't send learning data !");
      }
      return response.text();
    })
    .then((csvData) => {
      Q = csvData.split("\n").map((row) => row.split(","));
      console.log("Learning data loaded successfully:", Q);
      for (let i = 0; i < Q.length; i++) {
        const row = Q[i];
        for (let j = 0; j < row.length; j++) {
          const record = row[j];
          Q[i][j] = parseFloat(record);
        }
      }
    })
    .catch((error) => {
      console.error("Error loading learning data:", error);
    });
}

loadLearning();

let reward;
let decision;

async function startLearning() {
  while (!stopLearning) {
    await startLife();
    let state = getState();
    while (!isTerminal() && !stopLearning) {
      const action = epsilonGreedyPolicy(state);
      await takeAction(action);
      let nextState = getState();
      console.log(
        "State:",
        state,
        decision,
        "Action:",
        action,
        "Reward:",
        reward
      );
      QLearning(state, action, reward, nextState, alpha, gamma);
      state = nextState;
    }
    endLife();
  }
  console.log(Q);
}

startLearning();

function epsilonGreedyPolicy(state) {
  let maxProb = 0;
  let actionMaxProb = 0;
  let maxWeight = 0;
  let actionMaxWeight = 0;
  for (let i = 0; i < Q[state].length; i++) {
    const actionWeight = Q[state][i];
    const randomProb = Math.random();
    if (actionWeight * randomProb > maxProb) {
      actionMaxProb = i;
      maxProb = actionWeight * randomProb;
    }
    if (actionWeight > maxWeight) {
      actionMaxWeight = i;
      maxWeight = actionWeight;
    }
  }
  if (actionMaxProb == actionMaxWeight) {
    decision = "Exploit";
  } else {
    decision = "Explore";
  }
  return actionMaxProb;
}

function takeAction(action) {
  return new Promise((resolve) => {
    const status = characterStatus();
    performAction(action);
    updateCharacterStatus();
    const newStatus = characterStatus();
    const statusImprovement = newStatus - status;
    reward = statusImprovement * newStatus;
    setTimeout(() => {
      resolve();
    }, actionInterval);
  });
}

function QLearning(state, action, reward, nextState, alpha, gamma) {
  const currentQ = Q[state][action];
  const maxNextQ = Math.max(...Q[nextState]);
  Q[state][action] = currentQ + alpha * (reward + gamma * maxNextQ - currentQ);
}

function isTerminal() {
  return isEnd();
}

function saveLearning() {
  const jsonData = JSON.stringify(Q);

  fetch("/save-learning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Couldn't save learning data to server !");
      }
      console.log(response.text());
    })
    .then((data) => {
      console.log("Learning data saved successfully:", data);
    })
    .catch((error) => {
      console.error("Error sending learning data:", error);
    });
}
