var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var up = false;     // says that wall must start from the bottom
var points = 0, angle = 0, v = 5.5;
var mouseX = 20, mouseY = 225;

/*var hitSound = new Audio('hit-sound.mp3');
var deathSound = new Audio('death-sound.mp3');*/ // Doesn't work :(

var dX = 0, dY = 0, slope = 0;
var ballState = ["free", 20, 225, 0, 0];
// [free/hit, X, Y, wallStart, wallEnd]

var wallProperty = [[1, 222, 760, 0], [0, 5, 760, 0], [0, 5, 760, 0], [0, 5, 760, 0], [0, 5, 760, 0]];
//[woll visible?, height, X, Y]

var wallAnimation;
startMaze();

function generateWalls(){           //assigns all properties for the walls
    for(var i=0; i<5; i++)
    {
        if(wallProperty[i][0] == 0)
        {
            var length = Math.floor(Math.random()*(0.5 * canvas.height) + (canvas.height/4));

            if(points>15)   // games gets a bit tought
            {
                var length = Math.floor(Math.random()*(0.55 * canvas.height) + (canvas.height/4));
            }
            else if ( points>33){     // game gets even harder
              var length = Math.floor(Math.random()*(0.57 * canvas.height) + (canvas.height/3.5));
            }

            if(up)
            {
                wallProperty[i] = [1, length, 760, 0];
                up = false;
            }
            else{
                wallProperty[i] = [1, length, 760, canvas.height - length];
                up = true;
            }

            break;
        }
    }


} // end of generateWalls function

function startMaze (){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i=0; i<5; i++)      // loop to draw walls
    {
        if(wallProperty[i][0] == 1)
        {
            ctx.fillRect(wallProperty[i][2], wallProperty[i][3], 40, wallProperty[i][1]);
            wallProperty[i][2] -= 5;

            if(wallProperty[i][2] < 5)
            {
                wallProperty[i][0] = 0;     // deletes the wall when it reaches near the end
                points += 1;
                v -= 0.05;      // ball's speed decreases to increase difficulty

                document.getElementById("points").innerHTML = points;
            }
            if(wallProperty[i][2] == 600)
            {
                generateWalls();
            }
        }


    }
  //  ballState[2] += 0.001;

    if(mouseX != ballState[1] && mouseY!=ballState[2])    // prevents slope = infinity
    {
      slope = (mouseY - ballState[2])/(mouseX - ballState[1]);
    }
    angle = Math.atan(slope);
    //dX = v*(Math.cos(angle));
    //dY = v*(Math.sin(angle));

    if(ballState[0] == "free")
    {
      //  document.getElementById("messages").innerHTML = ballState[2];

        ctx.beginPath();            // drawing circle
        ctx.arc(ballState[1], ballState[2], 10, 0, Math.PI*2);
      //  ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
        ctx.fillStyle = "#0D47A1";
        ctx.fill();
        ctx.closePath();
        //var slope = 0;

        if(mouseX<ballState[1])         // mouse is behind ball
        {
          angle += (Math.PI);
        }

        dX = v*(Math.cos(angle));
        dY = v*(Math.sin(angle));

         ballState[1] += dX;
         ballState[2] += dY;

        for(var i=0; i<5; i++)
        {
            if(ballState[1] > wallProperty[i][2] && ballState[1]<(wallProperty[i][2] + 35) && ballState[2]>wallProperty[i][3] && (ballState[2]< (wallProperty[i][3] + wallProperty[i][1])))
            {
                ballState[0] = "hit";
                //hitSound.play();

                ballState[3] = wallProperty[i][3];      // wallStart
                ballState[4] = wallProperty[i][3]  + wallProperty[i][1]; //wallEnd

        //    alert(ballState[3] + " " +ballState[4]);
            }
        }

    }


    else if (ballState[0] == "hit")
    {

      //  if((mouseY>ballState[2] && mouseY>(ballState[2] + ballState[3])) || (mouseY<ballState[2] && mouseY<(ballState[2] + ballState[3])))
        if((ballState[2] > ballState[3] && ballState[2] > ballState[4]) || (ballState[2]<ballState[3] && ballState[2]<ballState[4]))
        {
            ballState[0] = "free";
            //alert("Hit and free");
        }
        else{
            ctx.beginPath();            // drawing circle
            ctx.arc(ballState[1], ballState[2], 10, 0, Math.PI*2);
            //ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
            ctx.fillStyle = "#BF360C";
            ctx.fill();
            ctx.closePath();

            if(mouseX<ballState[1])
            {
              angle += (Math.PI);
            }
            dY = v*(Math.sin(angle));

            ballState[1] -= 5;
            ballState[2] += dY;
        }
    }
    if(ballState[1]<5 && ballState[0] == "hit")
    {
        //deathSound.play();
        //document.getElementById("death-sound").play();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px arial';
        ctx.fillText('Game over', 222, 50);
        ctx.fillText('Your score : ' + points, 222, 100);

        wallAnimation = window.cancelAnimationFrame();
        document.getElementById("btn-dad").innerHTML = "<button onclick='location.reload()'>Play again</button>";
    }
    wallAnimation =  window.requestAnimationFrame(startMaze);
} // end of startMaze function

canvas.onmousemove = updateMouseCoordianates;

function updateMouseCoordianates(){
    mouseX = event.clientX;
    mouseY = event.clientY;
}
