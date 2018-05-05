
var Word = require("./Word.js");
var inquirer = require("inquirer");
var clc = require('cli-color');
var cfonts = require('cfonts');
var isLetter = require('is-letter');
const boxen = require('boxen');
var incorrect = clc.red.bold;
var correct = clc.green.bold;
var gameTextColor = clc.yellowBright;
var userGuessedCorrectly = false;
var wordList = ["Bears", "Bengals", "Browns", "Colts", "Cowboys", "Eagles", "Flacons", "Forty-Niners", "Packers"];
var randomWord;
var someWord;
var wins = 0;
var losses = 0;
var userGuess = "";
var lettersAlreadyGuessedList = "";
var lettersAlreadyGuessedListArray = [];
var guessesRemaining = 5;
var slotsFilledIn = 0;




function intro(err, data) {
	cfonts.say("NFL HANGMAN!", {
		colors: ['bluebright']
	});
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }

    console.log(gameTextColor("Welcome to the NFL Hangman Game!"));

    var howToPlay = 
    "=====================================" + "\r\n" +
    "YOU KNOW HOW TO PLAY...FOOL!" + "\r\n" +
    "=====================================" 
    console.log(gameTextColor(howToPlay));
    confirmStart();
};

function confirmStart() {
	var readyToStartGame = [
	 {
	 	type: 'text',
	 	name: 'playerName',
	 	message: 'What is your name?'
	 },
	{
	 	type: "checkbox",
  		message: "What is the best NFL team?",
  		name: "bestteam",
  			choices: [
				{
				name: "Patriots",
				checked: true
				},
				{
				name: "Eagles",
				},
				{
				name: "49ers",
				},
			],
	},	
	{
	    type: 'confirm',
	    name: 'readyToPlay',
	    message: 'Are you ready to play?',
	    default: true
	  },
	];

	inquirer.prompt(readyToStartGame).then(answers => {
		if (answers.readyToPlay){
			console.log(gameTextColor("Great! Welcome, " + answers.playerName + ". Let's begin..."));
			startGame();
		}
		else {
			console.log(gameTextColor("Good bye, " + answers.playerName + "! Come back soon."));
			return;
		}
	});
}


function startGame(){
	guessesRemaining = 7;
	chooseRandomWord();
	lettersAlreadyGuessedList = "";
	lettersAlreadyGuessedListArray = [];
}


function chooseRandomWord() {
randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
someWord = new Word (randomWord);
console.log(gameTextColor("Your word contains " + randomWord.length + " letters."));
console.log(gameTextColor("WORD TO GUESS:"));
someWord.splitWord();
someWord.generateLetters();
guessLetter();
}


function guessLetter(){
	if (slotsFilledIn < someWord.letters.length || guessesRemaining > 0) {
	inquirer.prompt([
  {
    name: "letter",
    message: "Shout out a letter!:",
    validate: function(value) {
        if(isLetter(value)){
          return true;
        } 
        else {
          return false;
        }
      }
  }
]).then(function(guess) {
	guess.letter.toUpperCase();
	console.log(gameTextColor("You guessed: " + guess.letter.toUpperCase()));
	userGuessedCorrectly = false;

	if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) > -1) {
		console.log(gameTextColor("You already guessed that letter. Enter another one."));
		console.log(gameTextColor("==================================================="));
		guessLetter();
	}

	else if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) === -1) {
		lettersAlreadyGuessedList = lettersAlreadyGuessedList.concat(" " + guess.letter.toUpperCase());
		lettersAlreadyGuessedListArray.push(guess.letter.toUpperCase());
		console.log(boxen(gameTextColor('Letters already guessed: ') + lettersAlreadyGuessedList, {padding: 1}));

		for (i=0; i < someWord.letters.length; i++) {
			
			if (guess.letter.toUpperCase() === someWord.letters[i].character && someWord.letters[i].letterGuessedCorrectly === false) {
				someWord.letters[i].letterGuessedCorrectly === true;
				userGuessedCorrectly = true;
				someWord.underscores[i] = guess.letter.toUpperCase();
				slotsFilledIn++
				console.log("Number of slots remaining " + slotsFilledIn);
			}
		}
		console.log(gameTextColor("WORD TO GUESS:"));
		someWord.splitWord();
		someWord.generateLetters();

		if (userGuessedCorrectly) {
			console.log(correct('TOUCHDOWN!'));
			console.log(gameTextColor("====================================================================="));
			checkIfUserWon();
		}
		else {
			console.log(incorrect('LOSER!'));
			guessesRemaining--;
			console.log(gameTextColor("You have " + guessesRemaining + " guesses left."));
			console.log(gameTextColor("====================================================================="));
			checkIfUserWon();
		}
	}
});
}
}

function checkIfUserWon() {
	if (guessesRemaining === 0) {
		console.log(gameTextColor("====================================================================="));
		console.log(incorrect('YOU LOST. BETTER LUCK NEXT TIME.'));
		console.log(gameTextColor("The correct team was: " + randomWord));
		losses++;
		console.log(gameTextColor("Wins: " + wins));
		console.log(gameTextColor("Losses: " + losses));
		console.log(gameTextColor("====================================================================="));
		playAgain();
	}
	else if (slotsFilledIn === someWord.letters.length) {
		console.log(gameTextColor("====================================================================="));
		console.log(correct("YOU WON! YOU'RE A NFL GURU!"));
		wins++;
		console.log(gameTextColor("Wins: " + wins));
		console.log(gameTextColor("Losses: " + losses));
		console.log(gameTextColor("====================================================================="));
		playAgain();
	}

	else {
		guessLetter("");
	}

}
function playAgain() {
	var playGameAgain = [
	 {
	    type: 'confirm',
	    name: 'playAgain',
	    message: 'Do you want to play the game again?',
	    default: true
	  }
	];

	inquirer.prompt(playGameAgain).then(userWantsTo => {
		if (userWantsTo.playAgain){
			lettersAlreadyGuessedList = "";
			lettersAlreadyGuessedListArray = [];
			slotsFilledIn = 0;
			console.log(gameTextColor("Great! Welcome back. Let's begin..."));
			startGame();
		}

		else {
			console.log(gameTextColor("GAME OVER!!"));
			return;
		}
		
	});
}

intro();