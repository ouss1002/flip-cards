/*
 * Create a list that holds all of your cards
 */


//  I created more than one list obviously :D 

// total = total number of card variations 
// 		(i wanted the method to adapt to more than 
// 		8 variations in case someone wanted to 
// 		change the number of cards to 10 or a 100, 
// 		or maybe i was wrong)

// numStars = integer, the actual number of stars achieved

// numMoves = integer, the actual number of moves performed

// cards = array of Strings, the list that holds all of my cards

// listOpenCards = array of DOMElements (cards), 
// 		it contains the card elements after being opened

// numMatched = integer, the number of card matches 
// 		(it helps me determine the end of the game)

// listCouplesError = array of couples of DOMElements (cards) 
// 		(a matrix of DOMElements). if two cards don't match, 
// 		they get the 'error' class. I needed it to keep order
// 		of the cards i must remove the 'error' class from afterwards

// listCouplesRight = the same as listCouplesError but for 
// 		the matched cards

// starsFull = array of DOMElements (stars), figured out i needed 
// 		a naïve solution

let total, numStars, numMoves, cards, listOpenCards, numMatched, listCouplesError, listCouplesRight, starsFull;


// startTime = float, assigning performance.now() to it
// 		at the beginning of the game

// totalTime = the result of substracting 'startTime' from 
// 		performance.now() at the end of the game

// sec & miliSec = just what their names mean :D

let startTime, totalTime, sec, miliSec;


// rightSound & wrongSound = Sound objects which are triggered
// 		when the cards match or not (i actually made them using 
// 		FL Studio - trying to publicize the fact i don't know why xD)

let rightSound, wrongSound;


// eleMoves = DOMElement of the number of moves to be printed
// eleRestart = DOMElement of the restart button
// eStars = DOMElement (ul) of the stars
// eleTimer = DOMElement of the timer that syncs through time

let eleMoves = document.querySelector('.moves');
let eleRestart = document.querySelector('.restart');
let eStars = document.querySelector('.stars');
let eleTimer = document.querySelector('.timer');


// assigning the 'starting the game' functionality to the restart button
eleRestart.addEventListener('click', startGame);

// timerTimeout = the time it takes for the machine to refresh
// 		the timer (10 miliseconds), you can change it 
let timerTimeout = 10;

// hideTimeout = the time it takes for two cards not matching to recover
//		their original hidden format (1 second)
let hideTimeout = 1000;



// this function 'starts the game' by initializing the variables, resetting
// time and emptying the arrays
function startGame(){
	cards = ['fa-diamond', 'fa-diamond',
			 'fa-cube', 'fa-cube',
			 'fa-anchor', 'fa-anchor',
			 'fa-paper-plane-o', 'fa-paper-plane-o',
			 'fa-bolt', 'fa-bolt',
			 'fa-bicycle', 'fa-bicycle',
			 'fa-bomb', 'fa-bomb',
			 'fa-leaf', 'fa-leaf'
			 ];
	
	listCouplesError = [];
	listCouplesRight = [];
	listOpenCards = [];
	numMatched = 0;
	shuffle(cards);

	// aDaPtInG pUrPoSeS
	total = cards.length / 2;

	// we initialize the moves, the stars and build the grid 
	fillContent();

	// if the variable is already assigned, we don't have to reassign it,
	// it involves recreating and appending an 'audio' child element in 
	// the body multiple times. To avoid this, we verify if the variable 
	// is assigned (not null), if so we leave it as it was, else we assign 
	// it a new Sound object
	rightSound = rightSound ? rightSound : new Sound('sounds/right.mp3');
	wrongSound = wrongSound ? wrongSound : new Sound('sounds/wrong.mp3');
	
	// we start tracking time here
	startTime = performance.now();
	console.log('STARTING THE GAME');

	// recursion at its finest :D
	refreshTimer();
}

// this function builds the grid of cards
function buildGrid(){
	
	// we get the DOMElement of the deck
	let deck = document.querySelector('.deck');
	// we empty it 
	// (in case it was filled already - restarting the game for instance)
	deck.innerHTML = '';

	let gridElements = [];

	// this is the string that contains the HTML code that will be appended
	// to the deck element (i know there is a .appendChild() method xD)
	let cardString = '';

	// we fill the array with the DOM card elements
	for(card of cards){
		gridElements.push(generateCard(card));
	}

	// now we append the elements to the string
	for(gridElement of gridElements){
		cardString += gridElement;
	}

	// we aPpEnD the children
	deck.innerHTML += cardString;

	// Evenet Delegation (I assigned the functionality to the whole deck)
	deck.addEventListener('click', turnOver);
}

// thanks to Ryan's webinar <3
function generateCard(card){
	return `<li class="card"><i class="fa ${card}"></i></li>`;
}

// the function that fills the content (grid, moves, stars)
function fillContent(){
	initMoves();

	initStars();

	buildGrid();
}

// This function speaks for itself xD
function initMoves(){
	numMoves = 0;
	let eMoves = document.querySelector('.moves');
	eMoves.innerHTML = numMoves;
}

// so does this one :D
function initStars(element){
	numStars = 3;
	eStars.innerHTML = '';

	// creating the star HTML element
	const star = '<li><i class="fa fa-star"></i></li>';

	// we need 3 whole stars
	eStars.innerHTML = star + star + star;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// this function takes a card (thanks to event delegation) as an argument, 
// fLiPs it by adding some classes ('open' & 'show')
function displaySymbol(target){
	target.classList.add('open');
	target.classList.add('show');
}

// in case of an error, we use this function to take the FIRST couple of the array
// listCouplesError (two cards that didn't match), reassign the original class 'card' 
// to them which makes them flip to the hidden side
// FIRST meaning: the user can be fast enough to make more errors before the first
// error fades away, this is a solution... somehow xD
function hideSymbol(){
	for(elem of listCouplesError[0]){
		// thought maybe assigning a class directly is faster than removing 
		// the other classes one by one... or am i wrong ?
		elem.className = 'card';
	}
	
	// after fixing the first error... we get rid of the first couple
	listCouplesError = listCouplesError.splice(1);
}

// 
function addCardToList(target){
	
	// we add the open card to the list of open cards
	listOpenCards.push(target);

	// if there are 2 cards in the list, we check if they match
	if(listOpenCards.length == 2){
		checkMatch();
	}
}

function checkMatch(){

	// we refresh the number of moves here (the ideal moment)
	refreshMoves();

	// either the cards match or don't
	if(listOpenCards[0].innerHTML === listOpenCards[1].innerHTML){
		// if the cards match
		console.log('YES');

		// we sync the number of cards matched 
		// (it helps us determine the end of the game)
		numMatched += 1;

		// I needed this variable to keep touch with the matched 
		// cards in order for me to add the 'done' class to them
		// afterwards
		listCouplesRight.push(listOpenCards[0]);
		listCouplesRight.push(listOpenCards[1]);

		// juggling with classes :D
		listOpenCards[0].classList.add('match');
		listOpenCards[1].classList.add('match');
		listOpenCards[0].classList.remove('open', 'show');
		listOpenCards[1].classList.remove('open', 'show');

		// i wanted to wait a little time before acknowledging 
		// the matching of the cards and triggering the sound 
		setTimeout(() => {
			listCouplesRight[0].classList.add('done');
			listCouplesRight[1].classList.add('done');
			// popping the first couple to make room for 
			// the second couple to be handled by this
			// function (timeout)
			listCouplesRight = listCouplesRight.splice(2);

			rightSound.play();
		}, 250);

		// we leave the cards open... and add some greenishness to them
		// i wanted to keep the cards open for some time (200ms) before 
		// acknowledging their matching

		// this condition checks for the end of the game
		// checking if the number of matched cards is equal to 
		// the total number initialized at the beginning of the 
		// game (in our case - 8)
		if(numMatched == total){
			console.log('FINISHED');

			// get the current time
			let curTime = getTimeNow();

			// translate the ending time to the number of seconds
			seconds = curTime[0] * 60 + curTime[1];

			// we get the modal DOMElement
			let modal = document.querySelector('#modal');

			// we fill in the details
			eleTime = modal.querySelector('#time');
			eleTime.innerHTML = seconds;

			modal.querySelector('#modal-moves').innerHTML = numMoves;

			modal.querySelector('#num-star').innerHTML = numStars;

			// conditional statement here was used to fix the 
			// singular - plural issue with the word 'star'
			// (I guess you missed it in the 3rd video of the 'Project Overview' xD) 
			modal.querySelector('#star-sing-plur').innerHTML = numStars > 1 ? 'Stars' : 'Star';

			// we copy the DOMElement of the stars and paste it directly in our modal
			modal.querySelector('#modal-stars').innerHTML = eStars.outerHTML;

			// this function shows the modal with all its up to date content
			congratz();
		}
	}
	else{
		// if the cards don't match
		console.log('NO');

		// we push the couple to the listCouplesError array
		listCouplesError.push(listOpenCards);

		// we add the 'error' class to the cards that didn't match
		let tmp1 = listOpenCards[0];
		let tmp2 = listOpenCards[1];
		setTimeout(() => {
			tmp1.classList.add('error');
			tmp2.classList.add('error');

			// we play the sound
			wrongSound.play();
		}, 200);

		// we keep the cards in the error state (red background) for a second
		// hideTimout = 1000 before reflipping them back to the hidden state
		setTimeout(() => {
			hideSymbol();
		}, hideTimeout);
	}

	// we empty the list of open cards
	listOpenCards = [];
}

// this is for updating the number of moves in the body
function refreshMoves(){

	numMoves += 1;
	eleMoves.innerHTML = numMoves;

	// this should be in a function called 'refreshStars', but i am lazy xD
	// if there is only one star... we don't have to bother checking if we 
	// need to remove another one, because ce can't
	if(numStars > 1){
		// i decided that the player loses a star if he performs more than
		// 10 moves and again after 15 moves 
		if(numMoves == 15 || numMoves == 11){
			removeStar();
			numStars -= 1;
		}
	}
}

// this function removes a star (i guess i don't have to explain xD)
function removeStar(){
	starsFull = eStars.querySelectorAll('.fa-star');
	starsFull[starsFull.length - 1].classList.add('fa-star-o');
	starsFull[starsFull.length - 1].classList.remove('fa-star');
}

// this is the function assigned with the event listener 'click' to the deck
// with event delegation, we check for the element that's been clicked and 
// we therefore perform the actions needed to flip the card and display the symbol
function turnOver(event){
	if(event.target && event.target.nodeName == 'LI' && event.target.className == 'card'){
		displaySymbol(event.target);
		addCardToList(event.target);
	}
}

// the function that shows the modal of winning the game
function congratz(){
	// the modal is already available in the HTML code, it's just hidden
	let modal = document.querySelector('.modal');

	// we add the class 'show-modal' to the modal and thus unveil it
	modal.classList.add('show-modal');

	// we remove the class 'old' to create the transition of opacity
	// (i liked it xD)
	modal.querySelector('.modal-content').classList.remove('old');
	modal.querySelector('.modal-title').classList.remove('old');
	modal.querySelector('.modal-text').classList.remove('old');

	// we assign functionalities to its buttons
	let backBtn = modal.querySelector('#butn-back');
	let restBtn = modal.querySelector('#butn-restart');

	backBtn.addEventListener('click', backToGame);
	restBtn.addEventListener('click', startNewGame);
	
	// doing it for the buttons too
	backBtn.classList.add('button');
	backBtn.classList.remove('old');
	restBtn.classList.add('button');
	restBtn.classList.remove('old');
}

// this function hides the modal
function backToGame(){
	document.querySelector('#modal').classList.remove('show-modal');

	// this time we reverse the process, we add the class old
	// and remove the classes added in the function congratz()
	modal.querySelector('.modal-content').classList.add('old');
	modal.querySelector('.modal-title').classList.add('old');
	modal.querySelector('.modal-text').classList.add('old');

	let backBtn = modal.querySelector('#butn-back');
	let restBtn = modal.querySelector('#butn-restart');
	
	backBtn.classList.remove('button');
	backBtn.classList.add('old');
	restBtn.classList.remove('button');
	restBtn.classList.add('old');
}

// starting a new game here means hiding the modal and then restarting the game
// xD
function startNewGame(){
	backToGame();
	startGame();
}

// the Sound object... I did some Object Oriented Programming with java, 
// I just had to google some things to put everything to work. I found 
// the OOP part in a later chapter and i'm looking forward to it <3
// This link helped me figure it out: 
// https://www.w3schools.com/graphics/game_sound.asp
function Sound(src){
	// it only happens once

	// we create the HTML audio element
	this.sound = document.createElement('audio');
	
	// we link the source to the filename (path)
	this.sound.setAttribute('src', src);

	// I used a className instead of an HTML attribute
	this.sound.classList.add('sound');

	// appending it to the body (happens once)
	document.body.appendChild(this.sound);

	// this method plays the sound from the file 
	this.play = function(){
		this.sound.play();
	}
}

// this function is meant for development purposes, i needed it 
// to solve the riddle automatically to test the modal, timer and
// some other things... you can use it as well
function winGame(){
	// if the game is won already... we exit the function
	if(numMatched == total){
		return ;
	}

	// preparing ingredients
	let eleDeck = document.querySelectorAll('.card');
	let domEls; //domEls = DOMElements (cards)
	let temp; // temp = temporary array full of ('fa-XYZ')
	// search = the element to be searched (e.g. 'fa-anchor')
	// index = integer that helps me permute elements
	// (in case this function is called upon when a card is opened already)
	let search, index;

	// we loop until we solve the riddle
	while(numMatched < total){
		// I know this is heavy for the CPU and could be optimized
		// but it's meant for development purposes so...
		eleDeck = document.querySelectorAll('.card');
		domEls = [];
		temp = [];

		// we only add the cards that are not matched
		for(ele of eleDeck){
			if(!ele.classList.contains('match')){
				domEls.push(ele);
			}
		}
	
		// now we fill the tmp array with the 'fa-XYZ' elements 
		// to be searched for
		for(ele of domEls){
			temp.push(ele.querySelector('i').classList[1]);
		}

		// this conditional statement is for the case when 
		// the developer executes this function in the 
		// console after he flipped one card open 
		// (so basically it fetches for its pair)
		if(listOpenCards.length == 1){
			for(let i = 0; i < domEls.length; i++){
				if(domEls[i].classList.contains('open')){
					let tmp = domEls[0];
					domEls[0] = domEls[i];
					domEls[i] = tmp;

					tmp = temp[0];
					temp[0] = temp[i];
					temp[i] = tmp;
				}
			}
		}

		// this is how it works
		// we save the 'fa-XYZ' of the first element
		// we look for its pair
		// we click both cards and we loop again
		search = temp[0];
		temp[0] = 'done';
		index = temp.indexOf(search);

		domEls[index].click();
		domEls[0].click();
	}
}

// it returns an array of [minutes, seconds, miliseconds]
function getTimeNow(){

	totalTime = performance.now() - startTime;
	totalTime /= 1000;
	seconds = Math.floor(totalTime);
	miliSec = Math.floor((totalTime - seconds) * 100);

	let tab = toMinSec(seconds);
	tab.push(miliSec);

	return tab;
}

// it takes 3 arguments and returns a timer XX:YY:ZZ in the form of a string
// I know that '...tab' is inappropriate but i wanted to use the rest operator somewhere xD
function getTimeString(...tab){
	
	// the conditional statements are here to solve the 
	// digits problem 
	// ==> it shows 09:07:01 instead of 9:7:1
	let str = (arguments[0] > 9 ? '' : '0') + arguments[0] + ' : ' + (arguments[1] > 9 ? '' : '0') + arguments[1] + ' : ' + (arguments[2] > 9 ? '' : '0') + arguments[2];
	
	return str;
}

// this returns an array of [minutes, seconds]
function toMinSec(seconds){
	return [Math.floor(seconds / 60), seconds - 60 * Math.floor(seconds / 60)];
}

// this function refreshes the timer in the document
function refreshTimer(){
	// we get the time, translate it to a string and paste it
	eleTimer.innerHTML = getTimeString(...getTimeNow());

	// if the game is won, we freeze the timer
	if(numMatched == total){
		return ;
	}
	// which means it won't get to this part of the function 
	// if the game is won

	// i used recursion as a solution, i hope it doesn't trigger
	// any performance issues xD
	// it happens every 10ms (timerTimeout = 10) to look more
	// realistic :D
	setTimeout(() => {
		refreshTimer();
	}, timerTimeout);
}

// we start the game <3
startGame();