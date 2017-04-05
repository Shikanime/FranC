const explore = require("./app.explorer");
const lexe = require("./app.lexer");
const parse = require("./app.parser");
const util = require('util');

/**
 * Debugger
 * 
 * @param {string} debugLevel 
 * @param {any} sourceCode 
 */
module.exports = function (sourceCode) {
    let code = explore(sourceCode);

    return {
        explorer: explorer,
        lexer: lexer,
        parser: parser
    };

    /**
     * Debug the raw code
     */
    function explorer() {
        let codeExplorer = code;
        while (!codeExplorer.endOfFile()) console.debug(codeExplorer.nextChar());
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }

    /**
     * Debug the tokenized code
     */
    function lexer() {
        let codeLexer = lexe(code);
        while (!codeLexer.endOfFile()) console.debug(codeLexer.nextToken());
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }

    /**
     * Debug the parsed code
     */
    function parser() {
        let codeParser = parse(lexe(code));
        console.debug(util.inspect(codeParser, {
            showHidden: false,
            depth: null
        }));
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }
};