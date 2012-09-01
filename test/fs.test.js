var fsInMemory = require("../");

exports["can write file and then read it out"] = function(test) {
    var fs = fsInMemory.create();
    assertWriteAndReadFile(test, fs, "/blah", function() {
        test.done();
    });
};

exports["cannot read file with encoding other than utf8"] = function(test) {
    var fs = fsInMemory.create();
    fs.writeFile("/blah", "Right here waiting for you", function(err) {
        test.ifError(err);
        fs.readFile("/blah", "iso-8859-1", function(err, contents) {
            test.equal(err.message, "Cannot read file in encodings other than utf8");
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

exports["can write file into newly created directory"] = function(test) {
    var fs = fsInMemory.create();
    
    fs.mkdir("/tmp", function(err) {
        test.ifError(err);
        assertWriteAndReadFile(test, fs, "/tmp/blah", function() {
            test.done();
        });
    });
};

function assertWriteAndReadFile(test, fs, filePath, callback) {
    fs.writeFile(filePath, "Right here waiting for you", function(err) {
        test.ifError(err);
        fs.readFile(filePath, "utf8", function(err, contents) {
            test.ifError(err);
            test.equal(contents, "Right here waiting for you");
            callback();
        });
    });
}
