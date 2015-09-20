/*
- Game Class purposes:

    * Controls the game flow between 2 players.
    * Reports the current score to "external" listeners
    * States the winner of the game
    * Can only record scores of 2 players in one single game.
    * A match would be made of several games.

- Information about implementation:

    * Game class is an Observable object, meaning it can be listened by external objects.
    * Needs 2 players to be instantiated
    * Methods are accessed through its prototype.
    * Heavily based on method encapsulation to increase maintainability


 */

//Imports
var Consts = require('../util/consts')
var EventEmitter = require('events').EventEmitter;
var util = require('util');



/**
 * Creates an instance of the class Game by receiving players 1 and 2
 * and a Boolean value that will enable/disable internal event listerners
 * for game reporting
 *
 * @param1 player1
 * @param2 player2
 * @param3 boolean
 *
 */
function Game(pl1,pl2,report){

    this.player1 = pl1;
    this.player2 = pl2;
    this.winner = "";
    this.gameStatus = "";
    this.score = [];


    if(this.player1 === undefined || this.player2 === undefined){
        throw new Error('A Game need 2 players in order to be played');
    }

    this.score[this.player1.name] = 0;
    this.score[this.player2.name] = 0;

    EventEmitter.call(this); // Copies the EventEmitter properties inside the 'Game' class.


    if(report)
        this.setListeners();
}

// Game class inherits from EventEmmiter
util.inherits(Game, EventEmitter);

// Current Private members (by naming convention)

/**
 * If at least three points have been scored by each player,
 * and the scores are equal, the score is "deuce".
 * @return boolean
 */
Game.prototype._isDeuce = function (score1,score2){
    if( (score1 === 3 && score2 === 3) || (score1 === 4 && score2 === 4)){
        return true;
    }else{
        return false;
    }
}

/**
 * If at least three points have been scored by each side and a player
 * has one more point than his opponent, the score of the game
 * is "advantage" for the player in the lead.
 * @return player
 */
Game.prototype._getPlayerAdvantage = function (scoreplayer1,scoreplayer2){

    if(scoreplayer1 === 4 && scoreplayer2 === 3) { // Player 1 has won the advantage

        return this.player1;

    }else if(scoreplayer1 === 3 && scoreplayer2 === 4){ // Player 2 has won the advantage

        return this.player2;

    }

    return undefined;
}

/**
 * A game is won by the first player to have won at least four points
 * in total and at least two points more than the opponent.
 * @return player
 */
Game.prototype._getWinner = function (scoreplayer1,scoreplayer2){

    if(scoreplayer1 >= 4 && (scoreplayer1 - scoreplayer2) >= 2){ // Player 1 wins the game

        return this.player1;

    }else if(scoreplayer2 >= 4 && (scoreplayer2 - scoreplayer1) >= 2){ // Player 2 wins the game

        return this.player2;

    }
    return undefined;
}

// Current Public Class Methods

Game.prototype.gamePointWonBy = function(player){

    this.score[player]++; // Marking the score for the selected player

    var scorePlayer1 = this.score[this.player1.name];
    var scorePlayer2 = this.score[this.player2.name];


    var isDeuce = this._isDeuce(scorePlayer1,scorePlayer2);
    var playerAdv = this._getPlayerAdvantage(scorePlayer1,scorePlayer2);
    var winner = this._getWinner(scorePlayer1,scorePlayer2);

    if(isDeuce)
    {
        this.setDeuce();

    }

    else if(playerAdv)
    {
        this.gameAdvantage(playerAdv)

    }

    else if(winner)
    {
        this.gameWonBy(winner);
    }

    else
    {
        this.reportScore();
    }
}

Game.prototype.getPlayerScore = function(player){
    var name = typeof player == "string"? player:player.name;
    return this.score[name];
}

Game.prototype.gameWonBy = function(player){
    this.winner = player.name;
    this.emit('game',player);
}
Game.prototype.getGameStatus = function(){
    return this.gameStatus;
}

Game.prototype.setDeuce = function(){

    this.score[this.player1.name] = 3;
    this.score[this.player2.name] = 3;
    this.gameStatus = Consts.DEUCE;

    this.emit('deuce');
}

Game.prototype.gameAdvantage = function(player){
    this.gameStatus = Consts.DEUCE;
    this.emit('advantage',player)
}

Game.prototype.reportScore = function(){
    var currentScore = this.player1.name+': '+ Consts.score(this.getPlayerScore(this.player1))+ ' vs '+
                       this.player2.name+': '+ Consts.score(this.getPlayerScore(this.player2));
    this.gameStatus = currentScore;

    this.emit('score',currentScore);
}

// Game Event Listeners - Responsible for reporting game results
Game.prototype.setListeners = function(){

    this.on('game',function(player){

        console.log('\n'+player.name+" has won the game");

    });

    this.on('deuce',function(){

        console.log('\n'+Consts.DEUCE);

    });

    this.on('advantage',function(player){

        console.log('\n'+Consts.ADV+' '+player.name);

    });

    this.on('score',function(score){

        console.log('\n'+score);

    });
}

module.exports = Game;
