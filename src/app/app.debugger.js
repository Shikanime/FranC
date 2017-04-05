const explore = require("./modules/explorer.module");
const lexe = require("./modules/lexer.module");
const parse = require("./modules/parser.module");
const util = require('util');

/**
 * Debugger
 * 
 * @param {any} sourceCode 
 * @returns {object}
 */
module.exports = function(sourceCode) {
    return {
        explorer: explorer,
        lexer: lexer,
        parser: parser
    };

    /**
     * Debug the code explorer tools
     */
    function explorer() {
        let codeExplorer = explore(sourceCode);
        while (!codeExplorer.endOfFile()) console.debug(codeExplorer.nextChar());
    }

    /**
     * Debug the code tokenizer tools
     */
    function lexer() {
        let codeLexer = lexe(explore(sourceCode));
        while (!codeLexer.endOfFile()) console.debug(codeLexer.nextToken());
    }

    /**
     * Debug the parsed code
     */
    function parser() {
        let codeParsed = parse(lexe(explore(sourceCode)));
        console.debug(util.inspect(codeParsed, {
            showHidden: true,
            depth: null
        }));
    }
};