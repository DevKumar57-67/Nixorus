// Add JS here

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let health = 5;

let player = {
x:50,
y:200,
size:40,
speed:5
};

let bullets = [];
let enemies = [];
let coins = [];

let enemySpeed = 2;

let shootSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
let coinSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
let hitSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

let keys = {};

let buttonMove = {
up:false,
down:false,
left:false,
right:false
};

const music = document.getElementById("bgMusic");

document.body.addEventListener("click",function(){

if(music.paused){
music.volume = 0.3;
music.play();
}

});

document.addEventListener("keydown",function(e){

keys[e.key]=true;

if(e.key===" "){
shoot();
}

});

document.addEventListener("keyup",function(e){
keys[e.key]=false;
});

function moveUp(){ buttonMove.up=true }
function moveDown(){ buttonMove.down=true }
function moveLeft(){ buttonMove.left=true }
function moveRight(){ buttonMove.right=true }

function stopMove(){
buttonMove.up=false
buttonMove.down=false
buttonMove.left=false
buttonMove.right=false
}

function shoot(){

shootSound.play();

bullets.push({
x:player.x+player.size,
y:player.y+player.size/2,
size:10,
speed:8
});

}

function movePlayer(){

if(keys["ArrowUp"] || buttonMove.up) player.y -= player.speed;
if(keys["ArrowDown"] || buttonMove.down) player.y += player.speed;
if(keys["ArrowLeft"] || buttonMove.left) player.x -= player.speed;
if(keys["ArrowRight"] || buttonMove.right) player.x += player.speed;

}

function moveBullets(){

bullets.forEach((b,i)=>{

b.x+=b.speed;

if(b.x>canvas.width){
bullets.splice(i,1);
}

});

}

function moveEnemies(){

enemies.forEach(enemy=>{

enemy.x-=enemySpeed;

if(enemy.x<-enemy.size){

enemy.x=canvas.width+Math.random()*300;
enemy.y=Math.random()*(canvas.height-enemy.size);

}

});

}

function moveCoins(){

coins.forEach(coin=>{

coin.x-=2;

if(coin.x<-coin.size){

coin.x=canvas.width+Math.random()*500;
coin.y=Math.random()*(canvas.height-coin.size);

}

});

}

function collision(){

enemies.forEach(enemy=>{

if(
player.x < enemy.x + enemy.size &&
player.x + player.size > enemy.x &&
player.y < enemy.y + enemy.size &&
player.y + player.size > enemy.y
){

health--;
hitSound.play();

document.getElementById("health").innerText=health;

enemy.x=canvas.width+200;

if(health<=0){

alert("Game Over! Score: "+score);

score=0;
health=5;

document.getElementById("score").innerText=score;
document.getElementById("health").innerText=health;

}

}

});

bullets.forEach((b,bi)=>{

enemies.forEach(enemy=>{

if(
b.x < enemy.x + enemy.size &&
b.x + b.size > enemy.x &&
b.y < enemy.y + enemy.size &&
b.y + b.size > enemy.y
){

score+=5;
document.getElementById("score").innerText=score;

enemy.x=canvas.width+Math.random()*300;

bullets.splice(bi,1);

}

});

});

coins.forEach(coin=>{

if(
player.x < coin.x + coin.size &&
player.x + player.size > coin.x &&
player.y < coin.y + coin.size &&
player.y + player.size > coin.y
){

score+=10;
coinSound.play();

document.getElementById("score").innerText=score;

coin.x=canvas.width+Math.random()*500;

}

});

}

let stars=[];

for(let i=0;i<120;i++){

stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});

}

function drawBackground(){

let gradient = ctx.createLinearGradient(0,0,0,canvas.height);

gradient.addColorStop(0,"#0f2027");
gradient.addColorStop(0.5,"#203a43");
gradient.addColorStop(1,"#2c5364");

ctx.fillStyle = gradient;
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";

stars.forEach(s=>{
ctx.fillRect(s.x,s.y,s.size,s.size);
});

}

for(let i=0;i<4;i++){

enemies.push({
x:canvas.width + Math.random()*400,
y:Math.random()*(canvas.height-40),
size:40
});

}

for(let i=0;i<3;i++){

coins.push({
x:canvas.width + Math.random()*600,
y:Math.random()*(canvas.height-30),
size:25
});

}

function draw(){

drawBackground();

ctx.fillStyle="blue";
ctx.fillRect(player.x,player.y,player.size,player.size);

ctx.fillStyle="orange";
enemies.forEach(e=>{
ctx.fillRect(e.x,e.y,e.size,e.size);
});

ctx.fillStyle="yellow";
coins.forEach(c=>{
ctx.fillRect(c.x,c.y,c.size,c.size);
});

ctx.fillStyle="white";
bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,b.size,b.size);
});

}

function gameLoop(){

movePlayer();
moveBullets();
moveEnemies();
moveCoins();
collision();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();