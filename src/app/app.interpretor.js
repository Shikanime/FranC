const explore = require("./modules/explorer.module");
const lexe = require("./modules/lexer.module");
const parse = require("./modules/parser.module");

/**
 * Francais interpretor
 * 
 * @param {any} sourceCode 
 * @returns {object}
 */
module.exports = function(sourceCode) {
    parse(lexe(explore(sourceCode)));
}