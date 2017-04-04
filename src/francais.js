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

module.exports = francais;