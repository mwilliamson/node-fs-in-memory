exports.create = create;

var path = require("path");

var q = require("q");
var _ = require("underscore");

function create(files) {
    files = files || {};
    function navigateTo(filePath) {
        return pathToParts(filePath).then(function(parts) {
            return navigateToInner(files, parts);
        });
    
        function navigateToInner(current, filePathParts) {
            if (filePathParts.length === 0) {
                return q.resolve(current);
            } else if (_.isString(current)) {
                return q.reject(new Error("No such file: " + filePath));
            } else {
                var next = current[filePathParts[0]];
                if (next) {
                    return navigateToInner(next, filePathParts.slice(1));
                } else {
                    return q.reject(new Error("No such file: " + filePath));
                }
            }
        }
    }
    
    function isFile(current) {
        return current && _.isString(current);
    }
    
    function isDirectory(current) {
        return current && !_.isString(current);
    }
    
    function pathToParts(filePath) {
        if (!/^\//.test(filePath)) {
            return q.reject(new Error("Path must be absolute"));
        }
        var normalFilePath = path.normalize(filePath);
        var parts = normalFilePath.substring(1).split("/").filter(function(part) {
            return part.length > 0;
        });
        return q.resolve(parts);
    }
    
    function readFile(filePath) {
        return navigateTo(filePath).then(function(file) {
            if (isFile(file)) {
                return q.resolve(file);
            } else {
                return q.reject(filePath + " is not a file");
            }
        });
    }
    
    function readdir(dirPath) {
        return navigateTo(dirPath).then(function(file) {
            if (isFile(file)) {
                return q.reject(new Error(dirPath + " is not directory"));
            } else {
                return q.resolve(_.keys(file));
            }
        });
    }
    
    function exists(filePath) {
        return navigateTo(filePath).then(constant(true)).fail(constant(false));
    }
    
    function mkdirp(filePath) {
        return pathToParts(filePath).then(function(parts) {
            var current = files;
            for (var i = 0; i < parts.length; i += 1) {
                if (isDirectory(current)) {
                    current = current[parts[i]] = current[parts[i]] || {};
                } else {
                    return q.reject(new Error("/" + parts.slice(0, i).join("/") + " is not directory"));
                }
            }
            return q.resolve();
        });
    }
    
    function writeFile(filePath, contents) {
        var filename = path.basename(filePath);
        return navigateTo(path.dirname(filePath)).then(function(parent) {
            if (isDirectory(parent[filename])) {
                return q.reject(new Error(filePath + " is directory"));
            } else {
                parent[filename] = contents;
                return q.resolve();
            }
        });
    }
    
    return {
        readFile: readFile,
        readdir: readdir,
        exists: exists,
        mkdirp: mkdirp,
        writeFile: writeFile
    };
}

function constant(value) {
    return function() {
        return value;
    };
}
