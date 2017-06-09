
var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}


function newGame() {
    return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if(typeof guess !== 'number' || guess < 1 || guess > 100) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Play again?")
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                $('#subtitle').text("The winning number was " + (this.winningNumber).toString() + "")
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Game.prototype.provideHint = function() {
    var random1 = this.winningNumber;
    var random2 = this.winningNumber;
    var winner = this.winningNumber;
    var diff = this.difference();

    if(diff < 10){
        if(!this.isLower()){
            var min = this.playersGuess - 10;
            var max = this.playersGuess
        }else{
            var min = this.playersGuess + 1;
            var max = this.playersGuess + 10;
        }
    }else if(diff < 25){
        if(!this.isLower()){
            var min = this.playersGuess - 25;
            var max = this.playersGuess
        }else{
            var min = this.playersGuess + 1;
            var max = this.playersGuess + 25;
        }
    }else if(diff < 50){
        if(!this.isLower()){
            var min = this.playersGuess - 50;
            var max = this.playersGuess
        }else{
            var min = this.playersGuess + 1;
            var max = this.playersGuess + 50;
        }
    }else{
        if(!this.isLower()){
            var min = 0;
            var max = this.playersGuess
        }else{
            var min = this.playersGuess + 1;
            var max = 101;
        }
    };

    while(random1 === winner && random2 === winner && random1 === random2){
        random1 = getRandomInt(min, max);
        random2 = getRandomInt(min, max);
    };

    var hintArray = [this.winningNumber, random1, random2];
    return shuffle(hintArray);
}

function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if(event.which == 13){
           if (game.pastGuesses.length === 5 || game.playersGuess === game.winningNumber){
                game = newGame();
                $('#title').text('Play the Guessing Game!');
                $('#subtitle').text('Guess a number between 1-100')
                $('.guess').text('?');
                $('#hint, #submit').prop("disabled",false);
            }else{
                makeAGuess(game);
            }
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        if(game.pastGuesses.length <= 3){
            $('#title').text("No hints yet!");
        }else{
            $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
        }
    });

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100')
        $('.guess').text('?');
        $('#hint, #submit').prop("disabled",false);

    })
})
