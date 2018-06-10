var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var up = false;     // says that wall must start from the bottom
var points = 0, angle = 0, v = 1;
var mouseX = 20, mouseY = 225;
var dX = 0, dY = 0;
var ballState = ["free", 20, 225, 0];
// free/hit, X, Y, height

var wallProperty = [[1, 222, 760, 0], [0, 5, 760, 0], [0, 5, 760, 0], [0, 5, 760, 0], [0, 5, 760, 0]]; 
//[woll visible?, height, X, Y]

var wallAnimation;
startMaze();

function generateWalls(){           //assigns all properties for the walls
    for(var i=0; i<5; i++)  
    {
        if(wallProperty[i][0] == 0)
        {
            var length = Math.floor(Math.random()*(0.5 * canvas.height) + (canvas.height/3));    
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
                document.getElementById("points").innerHTML = points;
            }
            if(wallProperty[i][2] == 600)
            {
                generateWalls();
            }
        }

    
    }
    
    /*
    ctx.beginPath();            // drawing circle
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
    */
    if(ballState[0] == "free")
    {
        document.getElementById("messages").innerHTML = dY + ballState[2];

        ctx.beginPath();            // drawing circle
        //ctx.arc(ballState[1], ballState[2], 10, 0, Math.PI*2);
        ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();

        angle = Math.atan((mouseY - ballState[2])/(mouseX - ballState[1]));
        //alert(angle);
        dX = v*(Math.cos(angle));
        dY = v*(Math.sin(angle));
         //ballState[1] += (v*(Math.cos(angle)));
         //ballState[1] += dX;
        // ballState[2] += dY;

        
        for(var i=0; i<5; i++)
        {
            if(mouseX > wallProperty[i][2] && mouseX<(wallProperty[i][2] + 40) && mouseY>wallProperty[i][3] && (mouseY< (wallProperty[i][3] + wallProperty[i][1])))
            {
                ballState[0] = "hit";
                ballState[1] = wallProperty[i][2];
                ballState[2] = wallProperty[i][3];      // Y
                ballState[3] = wallProperty[i][1];      // height

            
            }
        }

    }


    else if (ballState[0] == "hit")
    {
     
        if((mouseY>ballState[2] && mouseY>(ballState[2] + ballState[3])) || (mouseY<ballState[2] && mouseY<(ballState[2] + ballState[3])))
        {
            ballState[0] = "free";
            //alert("Hit and free");
        }
        else{
            ctx.beginPath();            // drawing circle
            ctx.arc(ballState[1], mouseY, 10, 0, Math.PI*2);
            //ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
            ballState[1] -= 5;
        }
        

        
    }

    /*
    
    for(var i=0; i<5; i++)      // loop to check for collisions
    {                           // each iteration tests againsts each wall
        
        
        if(mouseX > wallProperty[i][2] && mouseX<(wallProperty[i][2] + 40) && mouseY>wallProperty[i][3] && (mouseY< (wallProperty[i][3] + wallProperty[i][1])))
        {
           if(ballState[0] == "free")
           {
              ballState[0] = "hit";
              ballState[1] = wallProperty[i][2];
           }
         
        }
        else{
            ballState[0] = "free";
        }
        
        
    }


    */
    if(ballState[1]<10 && ballState[0] == "hit")
    {
        //alert("new death");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px arial';
        ctx.fillText('Game over', 222, 50);
        ctx.fillText('Your score : ' + points, 222, 100);

        wallAnimation = window.cancelAnimationFrame();
        document.getElementById("btn-dad").innerHTML = "<button onclick='location.reload()'>Play again</button>";
    }
    wallAnimation =  window.requestAnimationFrame(startMaze);
} // end of startMaze function

canvas.onmousemove = aaa;

function aaa(){
    mouseX = event.clientX;
    mouseY = event.clientY; 
}