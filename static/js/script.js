// Challenge 5: Black Jack 

let blackjackGame = {
    'you':{'scoreSpan': '#your-blackjack-result', 'div':'#your-box', 'score':0, 'hand':[]},
    'dealer':{'scoreSpan':'#dealer-blackjack-result', 'div':'#dealer-box', 'score':0, 'hand':[]},
    'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackDealer);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if (blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackDealer(){
    if (YOU['score'] > 0){
        blackjackGame['isStand'] = true;
        if (blackjackGame['turnsOver'] === false) {
            while (DEALER['score'] < 16){
                let card = randomCard();
                showCard(card, DEALER);
                updateScore(card, DEALER);
                showScore(DEALER);
                await sleep(1000);
            }
            blackjackGame['turnsOver'] = true;
            showResult(computeWinner());
        }
    }
    // console.log(blackjackGame['isStand'], blackjackGame['turnsOver']);
}

function blackjackDeal(){
    // showResult(computeWinner());
    if (blackjackGame['turnsOver'] === true){
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        console.log(yourImages);
        for (let i = 0; i < yourImages.length; i++){
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++){
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
    
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
    
        document.querySelector('#blackjack-result').textContent = "Let's play!";
        document.querySelector('#blackjack-result').style.color = 'black';
    
        blackjackGame['isStand'] = false;
        blackjackGame['turnsOver'] = false;
    
        console.log(blackjackGame['isStand'], blackjackGame['turnsOver']);    
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function randomSuite(){
    let randomIndex = Math.floor(Math.random() * 4);
    let suites = ['S','H','D','C'];
    return suites[randomIndex];
}
function showCard(card, activePlayer){
    if (activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        let suite = randomSuite();
        cardImage.src = `static/cards_52/${card}${suite}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function updateScore(card, activePlayer){
    if (card === 'A'){
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

// compute winner, return winner
function computeWinner(){
    let winner;

    if (YOU['score'] <= 21){
        // condition: higher score than dealer or when dealer busts
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            // console.log('You won!');
            blackjackGame['wins']++;
            winner = YOU;
        }
        // your score is less than dealer, neither busts
        else if (YOU['score'] < DEALER['score']){
            // console.log('You lost!');
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score'] && YOU['score'] <= 21) { 
            console.log('Draw!');
            blackjackGame['draws']++;
        }
    }
    // when YOU bust, but DEALER doesn't
    else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        // console.log('You lost!');
        blackjackGame['losses']++;
        winner = DEALER;
    }

    // both YOU and DEALER bust;
    else if (YOU['score'] > 21 && DEALER['score'] > 21){
        // console.log('Draw!');
        blackjackGame['draws']++;
    }

    console.log('Winner is ', winner);
    return winner;
}

function showResult(winner){
    let msg, msgColor;

    if (blackjackGame['turnsOver'] === true){
        if (winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            msg = 'You won!';
            msgColor = 'green';
            winSound.play();
        }
        else if (winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            msg = 'You loss!';
            msgColor = 'red';
            lossSound.play();
        }
        else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            msg = 'You drew!';
            msgColor = 'black';
        }
    document.querySelector('#blackjack-result').textContent = msg;
    document.querySelector('#blackjack-result').style.color = msgColor;
    }
}