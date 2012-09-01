# node-fs-in-memory

This module provides an in-memory implementation of the `fs` module. Functions
and behaviour are added as required, so this is far from being a complete
implementation. Patches and pull requests to add functions and make
behaviour more realistic are very welcome!

## Example

```javascript
var fsInMemory = require("fs-in-memory)";
var fs = fsInMemory.create();
fs.writeFile("/name", "Bob", function(err) {
    fs.readFile("/name", "utf8", function(err, contents) {
        // contents === "Bob"
    });
});
```

## Implemented functions

### fs.readFile

### fs.readdir

### fs.exists

### fs.mkdir

### fs.writeFile
