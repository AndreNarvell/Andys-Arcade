//Hämtar canvas element.
const canvas = document.getElementById("pong");

//Hämtar contexten av canvas.
const ctx = canvas.getContext("2d");

//Hämtar ljudfiler.
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

//Specar ljudfilerna.
hit.src = "Sounds/sounds_hit.mp3";
wall.src = "Sounds/sounds_wall.mp3";
comScore.src = "Sounds/sounds_comScore.mp3";
userScore.src = "Sounds/sounds_userScore.mp3";

//Bollen.
const ball = {
    color : "WHITE",
    radius : 10,
    speed : 7,
    velocityX : 5,
    velocityY : 5,
    x : canvas.width/2,
    y : canvas.height/2
};

//Spelarens racket.
const user = {
    color : "WHITE",
    height : 150,
    score : 0,
    width : 10,
    //Vänster sida av canvasen.
    x : 0,
    //Höjden på racket.
    y : (canvas.height - 100)/2

};

//AI racket.
const com = {
    color : "WHITE",
    height : 150,
    score : 0,
    width : 10,
    //Bredden på racket.
    x : canvas.width - 10,
    //Höjden på racket.
    y : (canvas.height - 100)/2
};

//Nätet i mitten.
const net = {
    color : "WHITE",
    height : 10,
    width : 2,
    x : (canvas.width - 2)/2,
    y : 0
    };

//Ritar en rektangel som används för racket.
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//Ritar en cirkel med hjälp av pi för boll.
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

//Kopplar in så att man spelar med sin mus.
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

//När någon får poäng så återställs bollen.
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

//Ritar nätet.
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//Text för poäng.
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

//Kollision.
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

//Uppdateringsfunktion.
function update(){

    //Ändrar poäng för spelet, ifall bollen går ut åt vänster "ball.x<0" AI får poäng, else if "ball.x > canvas.width" spelaren får poäng.
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }

    //Volociteten för bollen.
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //AI som jagar bollen.
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;

    //När bollen kolliderar med nedre eller över väggarna så inverterar den y velociteten.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    //Kollar ifall bollen nuddar spelarens eller AI'ns racket.
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

    //Ifall bollen nuddar ett racket.
    if(collision(ball,player)){
        //Spelar ljudet "hit".
        hit.play();
        //Kollar var någonstans på racket bollen träffar.
        let collidePoint = (ball.y - (player.y + player.height/2));

        //Normaliserar kollisionen.
        collidePoint = collidePoint / (player.height/2);

        //När bollen träffar övre delen av racket så ska den åka iväg med -45 graders vinkel.
        //När bollen träffar mitten av racket så ska den åka iväg med 0 graders vinkel.
        //När bollen träffar nedre delen av racket så ska den åka iväg med 45 graders vinkel.
        //Math.PI/4 = 45 grader.
        let angleRad = (Math.PI/4) * collidePoint;

        //Ändrar X och Y velocitetens riktning.
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        //Ökar hastigheten på bollen varje gång den nuddar något.
        ball.speed += 1;
    }
}

//Funktion för render. All ritning.
function render(){

    //Rensar canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    //Ritar spelarpoäng till vänster.
    drawText(user.score,canvas.width/4,canvas.height/5);

    //Ritar AI poäng till höger.
    drawText(com.score,3*canvas.width/4,canvas.height/5);

    //Ritar nätet.
    drawNet();

    //Ritar spelarens racket.
    drawRect(user.x, user.y, user.width, user.height, user.color);

    //Ritar AI racket.
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //Ritar bollen.
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

//Funktion för spelet i helhet.
function game(){
    update();
    render();
}
// Antalet FPS och hastighet på spelet, ju lägre fps desto långsammare
let framePerSecond = 50;

//Uppdaterar 50 gånger per sekund.
let loop = setInterval(game,1000/framePerSecond);