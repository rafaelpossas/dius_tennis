'user strict'

var prompt = function(){

    var Q = require("q");

    var _ask = function(question) {

        var stdin = process.stdin, stdout = process.stdout;
        var deferred = Q.defer();

        stdin.resume();
        stdout.write(question + ": ");

        stdin.once('data', function(data) {
            data = data.toString().trim();
            deferred.resolve(data);
        });

        return deferred.promise;
    }


    return {
        ask: _ask
    }

}();

module.exports = prompt;