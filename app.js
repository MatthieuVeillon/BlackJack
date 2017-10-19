// app state
// ===================
// These variables represent the state of our application, they tell us at
// any given moment the state of our blackjack game. You might find it useful
// to use these to debug issues by console logging them in the functions below.
let deckID = '';
let dealerCards = [];
let playerCards = [];
let playerScore = 0;
let dealerScore = 0;
let roundLost = false;
let roundWon = false;
let roundTied = false;

// game play nodes:
// ===================
// These nodes will be used often to update the UI of the game.

// assign this variable to the DOM node which has id="dealer-number"
const dealerScoreNode = $('#dealer-number');

// select the DOM node which has id="player-number"
const playerScoreNode = $('#player-number');

// select the DOM node which has id="dealer-cards"
const dealerCardsNode = $('#dealer-cards');

// select the DOM node which has id="player-cards"
const playerCardsNode = $('#player-cards');

// selec the DOM node which has id="announcement"
const announcementNode = $('#announcement');

// selec the DOM node which has id=new-game"
const newDeckNode = $('#new-game');

// selec the DOM node which has id="next-hand"
const nextHandNode = $('#next-hand');

// selec the DOM node which has id=""hit-me""
const hitMeNode = $('#hit-me');

// selec the DOM node which has id="stay"
const stayNode = $('#stay');

// Game mechanics functions
// ========================

// function handleErrors(response) {
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   return response;
// }

// This function receives an array of cards and returns the total score.
// ...

function computeScore(cards) {
  console.log(cards);

  // forEach approach

  let totalScore = 0;
  cards.forEach((card) => {
    switch (card.value) {
      case 'ACE':
        card.value = 11;
        break;
      case 'KING':
        card.value = 10;
        break;
      case 'QUEEN':
        card.value = 10;
        break;
      case 'JACK':
        card.value = 10;
        break;
      default:
        card.value = parseInt(card.value);
    }
    totalScore += card.value;
  });
  console.log(totalScore);
  return totalScore;
}

function resetPlayingArea() {
  dealerCards = [];
  playerCards = [];
  playerScore = 0;
  dealerScore = 0;
  roundLost = false;
  roundWon = false;
  roundTied = false;

  $('#dealer-number').text('');
  $('#player-number').text('');
  announcementNode.text('');

  dealerCardsNode.empty();
  playerCardsNode.empty();

  /* DONE  This function needs to:
  1) Reset all state variables to their defaults - DONE
  2) Reset the gameplay UI by updating textContent of all Nodes which may
  be displaying data from a previous round in the game. (ex: dealerScoreNode) - DONE
  3) Remove all <img> elements inside dealerCardsNode and playerCardsNode. - DONE
  */
}

function getNewDeck() {
  const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6';
  resetPlayingArea();
  // use Jquery to skip the the .then(response => response.json());

  return (
    $.getJSON(url)
      // .then(handleErrors)
      .then((data) => {
        deckID = data.deck_id;
        $('#next-hand').removeClass('hidden');
        $('#hit-me').addClass('hidden');
        $('#stay').addClass('hidden');
        console.log(deckID);
        return deckID;
      })
  );

  // .catch((error) => {
  //   console.log(error);
  // });
}

/* DONE  This function needs to:
  1) Call the resetPlayingArea function - DONE
  2) Make a call to deckofcardsapi in order to retrieve a new deck_id - DONE
  3) Set the value of our state variable deckID to the retrieved deck_id - DONE
  4) Change the display property of style on the nextHandNode element in order
  to provide the player with the Next Hand button. -DONE
  5) Hide the hit-me and stay buttons by changing their style.display to "none" - DONE
  6) TO DO - Catch any errors that may occur on the fetch and log them - DONE */

// console.log(`I return${getNewDeck(6)}`);

// 5) ForEach card in playerCards and dealerCards, create an <img> element
// and assign the src of these to their respective card images. Don't forget to
// append these newly created <img> elements to the respective #dealer-cards and
// #player-cards DOM elements in order to have them show up in the html.

function displayCards(array, DOMelement) {
  array.forEach((card) => {
    console.log(card.image);
    const img = $(`<img src=${card.image} alt="">`);
    DOMelement.append(img);
  });
}

function newHand() {
  const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`;
  // $.getJSON(url).then(data => console.log(data))
  resetPlayingArea();
  $('#hit-me').removeClass('hidden');
  $('#stay').removeClass('hidden');
  $.getJSON(url).then((data) => {
    // display cards
    playerCards.push(data.cards[0], data.cards[2]);
    dealerCards.push(data.cards[1], data.cards[3]);
    dealerScore = '?';
    dealerScoreNode.text(dealerScore);
    displayCards(playerCards, playerCardsNode);

    const img1 = $('<img src=card.png alt="">');
    dealerCardsNode.append(img1);
    const img2 = $('<img src=card.png alt="">');
    dealerCardsNode.append(img2);

    playerScore = computeScore(playerCards);
    console.log(`playerScore is ${playerScore}`);
    playerScoreNode.text(playerScore);

    if (playerScore === 21) {
      roundWon = true;
      announcementNode.text('BlackJack! You Win!');
    }
    //  else if (dealerScore === 21 || dealerScore > playerScore) {
    //   roundLost = true;
    //   announcementNode.text('BlackJack from the bank! You Lost!');
    // }
  });
}

/* This function needs to:
  DONE 1) Call the resetPlayingArea function - DONE
  DONE 2) Make a call to deckofcardsapi using the deckID state variale in order
  to retrieve draw 4 cards from the deck. - DONE
  DONE 3) Once 4 cards have been drawn, push 2 of them to our dealerCards state
  array and 2 to our playerCards state array. - DONE
  DONE 4) Set our dealerScore state variable to "?" and then set the textContent
  value of the dealerScoreNode to dealerScore; - DONE
  DONE 5) ForEach card in playerCards and dealerCards, create an <img> element
  and assign the src of these to their respective card images. Don't forget to
  append these newly created <img> elements to the respective #dealer-cards and
  #player-cards DOM elements in order to have them show up in the html. - DONE
  DONE 6) Finally, compute the player's score by calling computeScore() and update
  the playerScoreNode to reflect this.
  DONE 7) If player score is 21, announce immediate victory by setting:
  roundWon = true;
  announcementNode.textContent = "BlackJack! You Win!";
  8) catch and log possible error from the fetch.
  */

function dealerPlays() {
  /* This function needs to:
  DONE 1) If any of roundLost or roundWon or roundTied is true, return immediately.
    2) Compute the dealer's score by calling the computeScore() function and
    update the UI to reflect this.
    */
  if (roundLost || roundWon || roundTied) {
    return;
  }
  dealerCardsNode.empty();
  displayCards(dealerCards, dealerCardsNode);
  dealerScore = computeScore(dealerCards);
  dealerScoreNode.text(dealerScore);

  if (dealerScore < 17) {
    // a delay here makes for nicer game play because of suspence.
    setTimeout(() => hitMe('dealer'), 900);
  } else if (dealerScore > 21) {
    roundWon = true;
    announcementNode.text('You Win!');
  } else if (dealerScore > playerScore) {
    roundLost = true;
    announcementNode.text('Bad news you lost');
  } else if (dealerScore === playerScore) {
    roundTied = true;
    announcementNode.text('Bad news you lost');
  } else if (dealerScore === 21) {
    roundLost = true;
    announcementNode.text('Bad news you lost');
  } else {
    roundWon = true;
    announcementNode.text('You Win!');
  }
}

function hitMe(target) {
  if (roundLost || roundWon) {
    return;
  }
  const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
  console.log(deckID);
  $.getJSON(url).then((data) => {
    console.log(`just drew a new card ${data}`);

    if (target === 'player') {
      playerCards.push(data.cards[0]);
      computeScore(playerCards);
      const img = $(`<img src=${data.cards[0].image} alt="">`);
      playerCardsNode.append(img);
      playerScore = computeScore(playerCards);
      playerScoreNode.text(playerScore);

      if (playerScore > 21) {
        roundLost = true;
        announcementNode.text('Bad news you lost');
      }
    } else if (target === 'dealer') {
      dealerCards.push(data.cards[0]);
      const img = $(`<img src=${data.cards[0].image} alt="">`);
      dealerCardsNode.append(img);
      dealerPlays();
    }
  });
}

/* This function needs to:
 DONE  1) If any of roundLost or roundWon or roundTied is true, return immediately.
 DONE  2) Using the same deckID, fetch to draw 1 card
 DONE  3) Depending on wether target is 'player' or 'dealer', push the card to the
  appropriate state array (playerCards or dealerCards).
 DONE 4) Create an <img> and set it's src to the card image and append it to the
  appropriate DOM element for it to appear on the game play UI.
 DONE 5) If target === 'player', compute score and immediately announce loss if
  score > 21 by setting:
  roundLost = true;
  and updating announcementNode to display a message delivering the bad news.
 DONE 6) If target === 'dealer', just call the dealerPlays() function immediately
  after having appended the <img> to the game play UI.
  7) Catch error and log....
  */

// attaching functions using jquery

// On click events
// ==================
// These events define the actions to occur when a button is clicked.
// These are provided for you and serve as examples for creating further
// possible actions of your own choosing.
newDeckNode.click(getNewDeck);
nextHandNode.click(newHand);
hitMeNode.click(() => {
  hitMe('player');
});
stayNode.click(() => {
  console.log('stay clicked');
  setTimeout(() => dealerPlays(), 600);
});

// ==================
