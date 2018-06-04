var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var up = false;     // says that wall must start from the bottom
var points = 0;
var mouseX = 20, mouseY = 225;

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
    
    ctx.beginPath();            // drawing circle
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI*2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
    for(var i=0; i<5; i++)      // loop to check for collisions
    {                           // each iteration tests againsts each wall
        if(mouseX > wallProperty[i][2] && mouseX<(wallProperty[i][2] + 40) && mouseY>wallProperty[i][3] && (mouseY< (wallProperty[i][3] + wallProperty[i][1])))
        {
            //alert("BANG");
            
            document.getElementById("btn-dad").innerHTML = "<button onclick='location.reload()'>Play again</button>";

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '48px arial';
            ctx.fillText('Game over', 222, 50);
            ctx.fillText('Your score : ' + points, 222, 100);

            wallAnimation = window.cancelAnimationFrame();
        }
    }

    wallAnimation =  window.requestAnimationFrame(startMaze);
} // end of startMaze function

canvas.onmousemove = aaa;

function aaa(){
    mouseX = event.clientX;
    mouseY = event.clientY; 
}