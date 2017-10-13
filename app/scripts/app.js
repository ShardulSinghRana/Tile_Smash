var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
//Space between the bricks
var brickPadding = 10;
//so the bricks don't start from Canvas edge
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var score = 0;
var lives = 3;

for ( c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for ( r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0,y: 0,status:1};
  }
}
document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);

document.addEventListener("mousemove", mouseMoveHandler);

function drawBricks() {
  for ( c = 0; c < brickColumnCount; c++) {
    for ( r = 0; r < brickRowCount; r++) {
      //positioning the bricks
      if(bricks[c][r].status == 1){
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function keyDownHandler(e) {
  if(e.keyCode == 39){
    rightPressed = true;
  }
  else if(e.keyCode == 37){
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 39){
    rightPressed = false;
  }
  else if(e.keyCode == 37){
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  //relativeX - pos in vieport
  //Adjust the code for stopping the paddle going in to canvas
  var relativeX = e.clientX - canvas.offsetLeft;// e.clientX gives x pos of mouse and sets relativeX to middle of paddle
  if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
    //Pointer is withing the Canvas widths,
    paddleX = relativeX - paddleWidth/2;
  }
}

function drawball() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth,paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//balls collision Detection With Bricks
function collisionDetection() {
  for ( c = 0; c < brickColumnCount; c++) {
    for ( r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1){
        if( x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
            dy = -dy;
            b.status = 0;
            score++;
            if(score == brickRowCount*brickColumnCount){
              alert("YOU WIN \n Your Score is "+score);
              document.location.reload();
            }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Ariel";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+ score , 8 ,20)
}

function drawLives() {
  ctx.font = "16px Ariel";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+ lives , canvas.width-65 ,20)
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();
  drawball();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  //-10 and <10 -> reducing radius of ball so that the doesn't sink when striking
  //ball touching up and moving away from canvas
  if(y + dy < ballRadius ){
    dy = -dy;
  }
  else if (y + dy > canvas.height-ballRadius) {
    //ball touching bottom of canvas  (above else if condition)
    if(x > paddleX && x < paddleX + paddleWidth){
      //ball touching the left and right of edges of paddle then bounce back
      dy = -dy;
    } else {
      //decrease lives and check if finished then Game over
      lives--;
      if(!lives){
        alert("Game Over \n Your Score is "+score);
        document.location.reload();
      } else {
        //reset the position of ball and paddle if lives left
        x = canvas.width/2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth)/2;
      }
    }
  }

  //ball touching left/right of canvas and moving away so bounce back by reversing direction
  if(x + dx < ballRadius || x + dx > canvas.width-ballRadius){
    dx = -dx;
  }

  //on key press paddle moves 7px right/left respectively
  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX +=7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);// Draw function getting executed again & again under the request animation loop
  //Giving control of frame rate back to browser , So it will sync the frame rate accordingly and render the shapes only when needed
  //producs more efficient animation

}

draw();
