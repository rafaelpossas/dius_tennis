// Player test class
//
// Test Plan
//
// * A player shouldn't be created if a name is not passed to its constructor.
//
// @author Rafael Carvalhaes Pôssas
// @date 20-09-2015

var chai = require('chai');
var expect = chai.expect;
var Player = require('../app/models/player');

describe("A player",function(){

    it("should always have a name",function(){
        var player;

        try{
            player = new Player()
        }catch(e){
            expect(e).to.not.be.undefined;
        }

        expect(player).to.be.undefined;

    });

})
