var fsInMemory = require("../");

exports["can write file and then read it out"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.writeFile("/blah", "Right here waiting for you", function(err) {
        test.ifError(err);
        fs.readFile("/blah", "utf8", function(err, contents) {
            test.ifError(err);
            test.equal(contents, "Right here waiting for you");
            test.done();
        });
    });
};

exports["exists is false if file doesn't exist"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.exists("/blah", function(exists) {
        test.equal(false, exists);
        test.done();
    });
};

exports["exists is true if file exists"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.writeFile("/blah", "Right here waiting for you", function() {
        fs.exists("/blah", function(exists) {
            test.equal(true, exists);
            test.done();
        });
    });
};
