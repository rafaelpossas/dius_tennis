'use strict'
// DiUS Tennis Tournament application
//
// The application was built to leverage NodeJS event capabilities.
// Since NodeJS has a non-blocking IO the use of events takes full
// advantage on this architecture.
//
// Besides, programing by events make the code clearer and clean for
// someone reading it
//
// There are only two classes and one model for storing the application constants.
//  * /model/game.js - Class controling the flow of ONE single game.
//  * /model/player.js - Class representing a Player, stores its name.
//  * /util/consts.js - Utility class to store application consts.
//  * /util/prompt.js - Utility class that prompts user for console inputs
//
// The main application below uses promises to control async calls.
// This eliminates the 'callback hell' making it easier to not only
// understand async flow but also to write them.
//
// @author: Rafael Carvalhaes Possas
// @date: 21-09-2015
//
//
var _app = function(){
    var prompt = require('./app/util/prompt');
    var Player = require('./app/models/player');
    var Game = require('./app/models/game');

    function playAnotherGame(){
        prompt.ask("\nPlay another game? (yes or no): ")
            .then(function(answer){
                if(answer === "yes"){
                    startGame();
                }else if(answer === "no"){
                    process.exit();
                }else{
                    console.log("\nWrong answer, please type 'yes' or 'no'");
                    playAnotherGame();

                }
            })
    }
    function scorePoint(players,game){
        prompt.ask('\nEnter the number of the player (1: '+players[0]+' or 2: '+players[1]+') who scored the point')
            .then(function(number){
                if(number == 1 || number == 2){
                    game.gamePointWonBy(players[number-1]);
                }else{
                    console.log("\nWrong number, please type a valid number");
                    scorePoint(players);
                }

            });
    }

    function startGame(){
        var game;
        var player1;
        var player2;

        console.log("\nWelcome to DiUS tennis tournament!");

        prompt.ask("\nPlease enter the name of player 1: ")
            .then(function(data){
                player1 = new Player(data);
                return prompt.ask("Please enter the name of player 2: ");
            })
            .then(function(data){
                player2 = new Player(data);
                return prompt.ask('\nThe game is about to start, press enter when you are ready');
            })
            .then(function(){
                var players = [];
                players.push(player1.name);
                players.push(player2.name);

                game = new Game(player1,player2,true);
                console.log('\nThe game of today is: '+player1.name+' vs '+player2.name)+'\n';

                scorePoint(players,game);
                // The console will keep asking for a point until the game has been finished
                game.on('score',function(){
                    scorePoint(players,game);
                });
                game.on('deuce',function(){
                    scorePoint(players,game);
                });
                game.on('advantage',function(){
                    scorePoint(players,game);
                });
                // The console will ask for another game, if the answer is 'no' the program will exit.
                game.on('game',function(){
                    playAnotherGame();
                });

            })
    }

    startGame();


}();

module.exports = _app;
