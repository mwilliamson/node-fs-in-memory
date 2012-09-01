var fsInMemory = require("../");

exports["can write file and then read it out"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.writeFile("/blah", "Right here waiting for you").then(function() {
        return fs.readFile("/blah", "utf8");
    }).then(function(contents) {
        test.equal(contents, "Right here waiting for you");
        test.done();
    }).end();
};

exports["exists is false if file doesn't exist"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.exists("/blah").then(function(exists) {
        test.equal(false, exists);
        test.done();
    }).end();
};

exports["exists is true if file exists"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.writeFile("/blah", "Right here waiting for you").then(function() {
        fs.exists("/blah").then(function(exists) {
            test.equal(true, exists);
            test.done();
        })
    }).end();
};
