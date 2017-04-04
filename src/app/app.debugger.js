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
module.exports = function debug(debugLevel, sourceCode) {
    let code = explore(sourceCode);

    switch (debugLevel) {
        case "explorer":
            debugExplorer();
            break;
        case "lexer":
            debugLexer();
            break;
        case "parser":
            debugParser();
            break;
    }

    /**
     * Debug the raw code
     */
    function debugExplorer() {
        let codeExplorer = code;
        while (!codeExplorer.endOfFile()) console.log(codeExplorer.nextChar());
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }

    /**
     * Debug the tokenized code
     */
    function debugLexer() {
        let codeLexer = lexe(code);
        while (!codeLexer.endOfFile()) console.log(codeLexer.nextToken());
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }

    /**
     * Debug the parsed code
     */
    function debugParser() {
        let codeParser = parse(lexe(code));
        console.log(util.inspect(codeParser, {
            showHidden: false,
            depth: null
        }));
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }
};