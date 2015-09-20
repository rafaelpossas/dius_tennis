//
// Game model tests. These are basically GAME flow tests
// all possible game results were tested
//
// Tests were coded based on the expected behavior of the
// application.
//
// Application Requirements:
//
// * A game is won by the first player to have won at least four points in total
//   and at least two points more than the opponent.
//
// * The running score of each game is described in a manner peculiar
//   to tennis: scores from zero to three points are described as 0, 15, 30, 40, respectively
//
// * If at least three points have been scored by each player, and the
//   scores are equal, the score is "deuce".
//
// * If at least three points have been scored by each side and a player has one
//   more point than his opponent, the score of the game is "advantage" for the player in the lead.
//
// Basic Functionality test plan
//
// * A player should be able to score points
// * A player should be able to win a game
// * A player should be able to win a game by scoring twice in a row when the match is on DEUCE
//
// Scoring System test plan
//
// * The score should be reported when a player scores a point
// * The score should report DEUCE when the game is TIED at 40-40
// * The score should be advantage If at least three points have been scored and a player has one more point than his opponent
// * The score should go back to DEUCE when the advantage is lost by one player
//


var chai = require('chai');
var expect = chai.expect;
var Player = require('../app/models/player');
var Game = require('../app/models/game');

describe('In a Game ',function(){
    var game;
    var game2;
    var game3;
    var game4;
    var player1;
    var player2;
    var player3;
    var player4;

    before(function(){
        player1 = new Player("Roger Federer");
        player2 = new Player("Novak Djokovic");
        player3 = new Player("Gustavo Kuerten");
        player4 = new Player("Rafael Nadal");
    });

    describe("players",function(){

        before(function(){

            game = new Game(player1,player2,false);
            game2 = new Game(player3,player4,false);
            game3 = new Game(player2,player4,false);


        });

        it('should be able to score points',function(){
            game.gamePointWonBy("Roger Federer")
            expect(game.getPlayerScore(player1.name)).to.be.above(0);
        });

        it('should be able to win games',function(done){

            game2.on('game',function(player){
                expect(player.name).to.equal("Gustavo Kuerten");
                done();
            });
            // Player 3: Gustavo Kuerten vs Player 4: Rafael Nadal
            game2.gamePointWonBy(player3.name); // 15-0
            game2.gamePointWonBy(player3.name); // 30-0
            game2.gamePointWonBy(player3.name); // 40-0
            game2.gamePointWonBy(player3.name); // Game

        });
        it('should be able to win games by scoring twice in a row when the match is on deuce',function(done){

            game3.on('game',function(player){
                expect(player.name).to.equal("Novak Djokovic");
                done();
            });
            // Player 2: Novak Djokovic vs Player 4: Rafael Nadal
            game3.gamePointWonBy(player2.name); // 15-0
            game3.gamePointWonBy(player4.name); // 15-15
            game3.gamePointWonBy(player2.name); // 30-15
            game3.gamePointWonBy(player4.name); // 30-30
            game3.gamePointWonBy(player2.name); // 40-30
            game3.gamePointWonBy(player4.name); // DEUCE
            game3.gamePointWonBy(player2.name); // ADV Djokovic
            game3.gamePointWonBy(player2.name); // GAME

        });

    })

    describe("the score",function(){

        before(function(){

            game = new Game(player1,player2,false);
            game2 = new Game(player3,player4,false);
            game3 = new Game(player1,player3,false);
            game4 = new Game(player2,player4,false);

        });
        it("should be reported when a player scores a point",function(done){

            game4.on('score',function(score){
                expect(score).to.not.equal('');
                done();
            })
            game4.gamePointWonBy(player2.name);

        })
        it("should be DEUCE when players are tied at 40-40",function(done){

            game.on('deuce',function(){
                done();
            });
            // Player 1: Roger Federer vs Player 2: Novak Djokovic
            game.gamePointWonBy(player1.name); // 15-0
            game.gamePointWonBy(player2.name); // 15-15
            game.gamePointWonBy(player1.name); // 30-15
            game.gamePointWonBy(player2.name); // 30-30
            game.gamePointWonBy(player1.name); // 40-30
            game.gamePointWonBy(player2.name); // DEUCE

        });
        it('should be advantage If at least three points have been scored and a player has one more point than his opponent',function(done){

            game3.on('advantage',function(player){
                expect(player.name).to.equal("Gustavo Kuerten");
                done();
            });
            // Player 1: Roger Federer vs Player 3: Gustavo Kuerten
            game3.gamePointWonBy(player1.name); // 15-0
            game3.gamePointWonBy(player3.name); // 15-15
            game3.gamePointWonBy(player1.name); // 30-15
            game3.gamePointWonBy(player3.name); // 30-30
            game3.gamePointWonBy(player1.name); // 40-30
            game3.gamePointWonBy(player3.name); // DEUCE
            game3.gamePointWonBy(player3.name); // ADV Kuerten

        });
        it("should go back to deuce when the advantage is lost by one player",function(done){
            var numberOfDeuces = 0;

            game2.on('deuce',function(){
                if(numberOfDeuces >= 1){ // The game will trigger 2 deuces, we are interested in the second one
                    done();
                }else{
                    numberOfDeuces++;
                }
            });
            // Player 3: Gustavo Kuerten vs Player 4: Rafael Nadal
            game2.gamePointWonBy(player3.name); // 15-0
            game2.gamePointWonBy(player4.name); // 15-15
            game2.gamePointWonBy(player3.name); // 30-15
            game2.gamePointWonBy(player4.name); // 30-30
            game2.gamePointWonBy(player3.name); // 40-30
            game2.gamePointWonBy(player4.name); // DEUCE
            //Kuerten gets the advantage
            game2.gamePointWonBy(player3.name); // ADV Kuerten
            //Nadal gets it back and the game is deuce again
            game2.gamePointWonBy(player4.name); // DEUCE

        });

    })
})
