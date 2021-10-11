//const för dino
const dino = document.getElementById("dino");

//const för cactus
const cactus = document.getElementById("cactus");

//Variabel för poäng
var counter=0;

//Spelar ljud när man hoppar.
let hit = new Audio();
hit.src = "Sounds/halenjump.mp3";

//Funktion för jump
function jump() {
    //Loop för att kolla om dino har jump eller inte
    if (dino.classList != "jump") {
    //lägger till jump på dino
    dino.classList.add("jump")
    //Tar bort classen jump från dino efter 300ms
    setTimeout(function () {
        dino.classList.remove("jump");
    }, 300)
  }
}

let isAlive = setInterval(function () {
    //Tar ut dino Y position
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    //Tar ut cactus X position
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left")
    );

    //Tar reda på om cactus och dino kolliderar
    if (cactusLeft <50 && cactusLeft > 0 && dinoTop >= 140){
        //Om collision sker
        alert("Game Over! Your score: "+Math.floor(counter/200));
        counter=0;
    }
    //Om inte kollision sker så fortsätter poängen räkna
    else{
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter/200);
    }

    
    
}, 10);

//Ställer in så att man hoppar med mellanslag
document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        jump();
        hit.play();
    }
});

