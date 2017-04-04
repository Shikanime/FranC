const explore = require("./system/system.explorer");
const lexe = require("./system/system.lexer");
const parse = require("./system/system.parser");
const debug = require("./system/system.debugger");

const francais = {
    interprete: function(codeEntry) {
        parse(lexe(explore(codeEntry)));
    },
    debug: debug
};

module.exports = francais;