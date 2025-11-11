// PAIRS GAME
/*
    Coding a JavaScript memory matching game or pairs game is another 
    fun project you can build for fun (and for your portfolio!).

    The logic of the game is simple:

    There are a given number of cards on the table facing down. The player 
    needs to find all the pairs. However, you may want to add more difficulty 
    by limiting the number of guesses or by setting a time limit for the game 
    to be finished.
*/
window.onload = ()=>{
    beginPairsGame()
}

let arrayCards = [
    0, 1, 2, 3, 4
]

let currentGame = [];
let revealedCards = [];
let secs, mins;
let timer, intervalTimer, myMessage, myCards, canClick = true;
let counterCard;
let gameResult;

function beginPairsGame(){
    timer = document.getElementById("timer");
    myMessage = document.getElementById("message");

    generateCards(); // Generate the cards
    shuffle(currentGame); // Shuffle the cards
    generateImg(currentGame); // Generate the images on the page

    gameLogic(); // Begin game

}

// Function that generate the cards tha will be displayed
function generateCards(){
    for(let i=0; i<5; i++){
        currentGame.push(arrayCards[i]);
        currentGame.push(arrayCards[i]);
    }
    let last = Math.floor(Math.random()*4);
    currentGame.push(last);
    currentGame.push(last);
}

// Function that shuffles the contents of the array where the cards are kept
function shuffle(array) {
    let currentIndex = array.length;
    
    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

// Function that generates the divs and imgs where the cards will be stored
function generateImg(array){
    counterCard = 0;
    myCards = document.createElement("div");
    myCards.id = "cards";
    document.body.appendChild(myCards);
    array.forEach((card) => {
        counterCard++;
        let div = document.createElement("div");
        div.className = "divImage";

        let inner = document.createElement("div");
        inner.className = "flip-inner";

        // Front = backside
        let front = document.createElement("div");
        front.className = "flip-front";

        // Back = card's image
        let back = document.createElement("div");
        back.className = "flip-back";

        let imgBackside = document.createElement("img");
        imgBackside.src = "images/backside.png";
        imgBackside.className = "back-img image";
        imgBackside.nameType = card;
        imgBackside.id = card+""+counterCard;

        let imgCard = document.createElement("img");
        imgCard.src = "images/"+card+".png";
        imgCard.className = "front-img";

        front.appendChild(imgBackside);
        back.appendChild(imgCard);
        inner.appendChild(front);
        inner.appendChild(back);
        div.appendChild(inner);
        myCards.appendChild(div);
    })
}

// Function that contains all main game logic
function gameLogic(){
    let myTries = document.getElementById("tries");
    let cardsUp = 0;
    let card1, card2;
    let tries = 5;
    mins = 0; secs = 30;

    myMessage.innerHTML = "CLICK ANY CARD TO BEGIN";
    myTries.innerHTML = "You have tries "+tries+" left.";
    timer.innerHTML = "0"+mins+":"+secs;

    myCards.addEventListener("click", (e)=>{        
        if(e.target.classList.contains("image")){
        if(!intervalTimer) 
            intervalTimer = setInterval(startTimer, 1000); // Timer
            if(canClick){ // Condition that checks if you can click on the cards
                if(!checkRevealedCards(revealedCards, e.target.id)){
                    canClick = false
                    cardsUp++;
                    if(cardsUp==1){
                        card1 = e.target;
                        card1.closest(".divImage").classList.add("flipped");
                        canClick = true;
                    }else if(card1 != e.target){
                        card2 = e.target;
                        card2.closest(".divImage").classList.add("flipped");

                        if(card1.nameType==card2.nameType){
                            myMessage.innerHTML = "Correct";
                            cardsUp = 0;
                            canClick = true;
                            revealedCards.push(card1.id);
                            revealedCards.push(card2.id);
                            if(revealedCards.length == (currentGame.length)){
                                myMessage.innerHTML = "Congratulations, you've guessed them all correct!";
                                gameResult = true;
                                gameEnd();
                            }
                        }else{
                            myMessage.innerHTML = "Incorrect";
                            cardsUp = 0;
                            tries--
                            myTries.innerHTML = tries !=0? "You have tries "+tries+" left.":
                            "You don't have more tries left";
                            setTimeout(()=>{
                                myMessage.innerHTML="Try again";
                                card1.closest(".divImage").classList.remove("flipped");
                                card2.closest(".divImage").classList.remove("flipped");
                                canClick = true;
                            }, 1000);
                            if(tries == 0){
                            setTimeout(lose,1100)}
                        }
                    }else{
                        canClick = true;
                    }
                }
            }
        }
    })
}

// Function that starts the timer
function startTimer(){
    if(secs == 0) secs=60;
    if(secs == 60) mins--;
    secs--;
    secs = secs<10?"0"+secs:secs;
    mins = mins.toString().length == 1?"0"+mins:mins;
    timer.innerHTML = mins+":"+secs;
    if(mins == 0 && secs == 0) lose();
}

// Function that checks if a pair has already been permanently revealed so you it 
// can't be clicked on again
function checkRevealedCards(revealedCards, card){
    let revealed = false;
    for(let i=0; i<revealedCards.length && !revealed; i++){
        revealed = revealedCards[i] == card?
        true:false;
    }

    return revealed
}

// Function that flips the card
function showCard(card){
    return "images/"+card.nameType+".png";
}

// Function that stops that game, reveals all cards and tells the player
// they've lost
function lose(){
    gameResult = false;
    myMessage.innerHTML = "You've lost :(";
    let myImgs = document.getElementsByClassName("image")
    Array.from(myImgs).forEach((curImg)=>{curImg.src = showCard(curImg);})

    gameEnd();
}

// Function that triggers at the end of the game
function gameEnd(){
    canClick = false;
    clearInterval(intervalTimer);

    // Create a div that will contain a paragraph and a button
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "300px";
    div.style.height = "300px";
    div.style.marginLeft = "-1000px";
    div.style.marginTop = "270px";
    div.style.backgroundColor = "rgb(240, 128, 128, 0.5)";
    div.style.border = "5px solid firebrick";
    div.style.borderRadius = "15%";
    document.body.appendChild(div);

    let p = document.createElement("p"); // Paragraph with a message
    p.innerHTML = gameResult ? "Congratulations, you've guessed them all correct!": "You've lost";
    p.style.color = "darkorchid"
    div.appendChild(p);

    let btn = document.createElement("button"); // Button that resets the game
    btn.innerHTML = gameResult ? "Reset": "Retry";
    div.appendChild(btn);

    btn.addEventListener("click", (e) =>{
        div.remove();
        resetGame();    
    })
}

// Function that resets the game
function resetGame(){
    intervalTimer = 0;
    currentGame.length = 0;
    revealedCards.length = 0;
    myCards.remove();
    generateCards();
    shuffle(currentGame);
    generateImg(currentGame);
    canClick = true;
    gameLogic();
}