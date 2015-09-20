// Player class
// Stores the player name
//
// If a name is not passed to its constructor the class will throw a error.
//
// @author Rafael Carvalhaes Pôssas
// @date 20-09-2015
//
//

// Private variables
var name = "";

// Constructor
function Player(name){

    this.name = name;

    if(!name || name === ''){
        throw new Error("Invalid name.A player should always have a name")
    }
}



// Getters and Setters
Player.prototype.getName = function (){
    return this.name;
}

module.exports = Player;
