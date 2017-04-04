const explore = require("./app/app.explorer");
const lexe = require("./app/app.lexer");
const parse = require("./app/app.parser");
const debug = require("./app/app.debugger");

const francais = {
    interprete: function(codeEntry) {
        parse(lexe(explore(codeEntry)));
    },
    debug: debug
};

console.debug = function(message) {
    console.log(message);
};

console.error = function(message) {
    console.error(message);
    process.exit(1);
};

require('console-stamp')(console, {
    pattern: "HH:MM:ss",
    metadata: () => {
        return ("[" + process.memoryUsage().rss + "]");
    },
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    },
    extend: {
        debug: 5,
    },
    include: ["debug", "warn", "error"],
    level: "debug"
});

module.exports = francais;