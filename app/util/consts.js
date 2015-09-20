/*
    Singleton Consts class
    Helps to keep standard values throughout the application
 */
var Consts = function(){
    // Private Variables
    var _scores = [0,15,30,40];
    this._adv = "ADVANTAGE";
    this._deuce = "DEUCE";




    // Getter and Setters
    this.score = function (points){
        if(points === undefined){
            throw new Error("You must provide the number of points");
        }
        return _scores[points];
    };

    return {
        score: this.score,
        ADV:  this._adv,
        DEUCE: this._deuce

    }

};

Consts.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */

Consts.getInstance = function(){
    if(this.instance === null){
        this.instance = new Consts();
    }
    return this.instance;
}

module.exports = Consts.getInstance();
