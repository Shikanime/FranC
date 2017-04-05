const explorerModule = require("./modules/explorer.module");
const lexerModule = require("./modules/lexer.module");
const parserModule = require("./modules/parser.module");

/**
 * Francais interpretor
 * 
 * @param {any} sourceCode 
 * @returns {object}
 */
module.exports = function(sourceCode) {
    parserModule(lexerModule(explorerModule(sourceCode)));
}