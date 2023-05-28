window.onload = function () {
  let canvasWidth = 900;
  let canvasHeight = 600;
  let blockSize = 30;
  let ctx;
  let delay = 100;
  let Snakee;
  let applee;
  let widthInBloocks = canvasWidth / blockSize;
  let heightInBlocks = canvasHeight / blockSize;
  let score;

  init();

  function init() {
    let canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd"
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    Snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }
  function refreshCanvas() {
    Snakee.advance();
    if (Snakee.checkCollision()) {
      gameOver();
    } else {
      if (Snakee.isEatingApple(applee)) {
        score++;
        Snakee.eatApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(Snakee));
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
     drawScore();
      Snakee.draw();
      applee.draw();
      
      setTimeout(refreshCanvas, delay);
    }
  }
  function gameOver() {
    ctx.save();
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.texteBaseline = "middle";
    ctx.strokStyle = "white";
    ctx.lineWidth = 5;
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    ctx.fillText("Game Over", 5, 15);
    ctx.fillText("Appuiez sur la touche espace pour rejouer", 5, 30);
    ctx.restore();
  }
  function restart() {
    Snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }
  function drawScore() {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.texteBaseline = "middle";
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;  
     
    ctx.fillText(score.toString(), centerX, centerY);
    ctx.restore();
  }
  function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }
  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.isEatingApple;
    false;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };
    this.advance = function () {
      let nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw "invalid direction";
      }
      if (this.eatApple) {
        this.body.unshift(nextPosition);
        this.body.pop();
      } else {
        this.eatApple = false;
      }
    };
    this.setDirection = function (newDirection) {
      let allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw "invalid direction";
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };
    this.checkCollision = function () {
      let wallCollision = false;
      let snakeCollision = false;
      let head = this.body[0];
      let rest = this.body.slice(1);
      let snakX = head[0];
      let snakY = head[1];
      let minX = 0;
      let minY = 0;
      let maxX = widthInBloocks - 1;
      let maxY = heightInBlocks - 1;
      let isNotBetweenHorizontalWalls = snakX < minX || snakX > maxX;
      let isNotBetweenVerticalWalls = snakY < minY || snakY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      }
      for (let i = 0; i < rest.length; i++) {
        if (snakX === rest[i][0] && snakY === rest[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function (appleToEat) {
      let head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      )
        return true;
      else return false;
    };
  }
  function Apple(position) {
    this.position = position;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "green";
      ctx.beginPath();
      let radius = blockSize / 2;
      let x = this.position[0] * blockSize + radius;
      let y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPosition = function () {
      let newX = Math.round(Math.random() * (widthInBloocks - 1));
      let newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function (snakeToCheck) {
      this.isOnSnake = false;
      for (let i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck.body[i][1]
        ) {
          this.isOnSnake = true;
        }
      }
      return this.isOnSnake;
    };
  }
  document.onkeydown = function handleKeyDown(e) {
    let key = e.key;
    let newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    Snakee.setDirection(newDirection);
  };
};
