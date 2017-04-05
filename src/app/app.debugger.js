const explorerModule = require("./modules/explorer.module");
const lexerModule = require("./modules/lexer.module");
const parserModule = require("./modules/parser.module");
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
        let codeExplorer = explorerModule(sourceCode);
        while (!codeExplorer.endOfFile()) console.debug(codeExplorer.nextChar());
    }

    /**
     * Debug the code tokenizer tools
     */
    function lexer() {
        let codeLexer = lexerModule(explorerModule(sourceCode));
        while (!codeLexer.endOfFile()) console.debug(codeLexer.nextToken());
    }

    /**
     * Debug the parsed code
     */
    function parser() {
        let codeParsed = parserModule(lexerModule(explorerModule(sourceCode)));
        console.debug(util.inspect(codeParsed, {
            showHidden: true,
            depth: null
        }));
    }
};