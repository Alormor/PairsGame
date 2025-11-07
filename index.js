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

/*let pairLower = [
    "hornet", "maiden", "sherma", "shakra",
    "mooshka", "grindle", "daughter", "lace", 
    "garmond", "nuu", "phantom", "trobbio"
]

let pairUpper = [
    "HORNET", "MAIDEN", "SHERMA", "SHAKRA",
    "MOOSHKA", "GRINDLE", "DAUGHTER", "LACE",
    "GARMOND", "NUU", "PHANTOM", "TROBBIO"
]*/

let arrayCards = [
    0, 1, 2, 3, 4
]

let currentGame = [];
let revealedCards = [];
let secs = 60, mins = 2;
let timer, intervalTimer, myMessage, myCards;

function beginPairsGame(){
    timer = document.getElementById("timer");
    myMessage = document.getElementById("message");
    myCards = document.getElementById("cards");
    let myTries = document.getElementById("tries");
    let canClick = true;
    let cardsUp = 0;
    let card1, card2;
    let tries = 5;


    generateCards(); // Generate the cards
    shuffle(currentGame); // Shuffle the cards
    generateImg(currentGame); // Generate the images on the page
    myTries.innerHTML = "You have tries "+tries+" left.";

    // Change hte logic from id names to custom attribute plus array check in new branch
    myCards.addEventListener("click", (e)=>{        
        if(e.target.className == "image"){
        if(!intervalTimer) 
            intervalTimer = setInterval(startTimer, 1000); // Timer
            if(canClick){ // Condition that checks if you can click on the cards
                if(!checkRevealedCards(revealedCards, e.target.nameType)){
                    canClick = false
                    cardsUp++;
                    if(cardsUp==1){
                        card1 = e.target;
                        card1.src = showCard(card1);
                        canClick = true;
                    }else if(card1 != e.target){
                        card2 = e.target;
                        card2.src = showCard(card2);

                        if(card1.nameType==card2.nameType){
                            myMessage.innerHTML = "Correct";
                            cardsUp = 0;
                            canClick = true;
                            revealedCards.push(card1.nameType); // Saves only one card's nameType, both cards of the pair have the same
                            if(revealedCards.length == (currentGame.length/2)){
                                myMessage.innerHTML = "Congratulations, you've guessed them all correct!";
                                clearInterval(intervalTimer);
                            }
                        }else{
                            myMessage.innerHTML = "Incorrect";
                            cardsUp = 0;
                            tries--
                            myTries.innerHTML = tries !=0? "You have tries "+tries+" left.":
                            "You don't have more tires left";
                            setTimeout(()=>{
                                myMessage.innerHTML="Try again";
                                card1.src = "images/backside.png";
                                card2.src = "images/backside.png";
                                canClick = true;
                            }, 1000);
                            setTimeout(()=>{
                                if(tries == 0){
                                    lose();
                                }
                            },1100)
                        }
                    }else{
                        canClick = true;
                    }
                }
            }
        }
    })
}

// Function that generate the cards tha will be displayed
function generateCards(){
    for(let i=0; i<5; i++){
        currentGame.push(arrayCards[i]);
        currentGame.push(arrayCards[i]);
    }
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
    array.forEach((card) => {
        let div = document.createElement("div");
        div.className = "divImage";

        let img = document.createElement("img");
        img.src = "images/backside.png";
        img.id = "img"+card;
        img.nameType = card;
        img.className = "image";
        
        let myDiv = myCards.appendChild(div);
        myDiv.appendChild(img);
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
    canClick = false;
    myMessage.innerHTML = "You've lost :(";
    currentGame.forEach(card => {
        let myImg = document.getElementById(card);
        myImg.src = "images/"+card.charAt(3)+".png";
    });
    clearInterval(intervalTimer);
}