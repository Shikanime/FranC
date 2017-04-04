const explore = require("./system.explorer");
const lexe = require("./system.lexer");
const parse = require("./system.parser");
const util = require('util');

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

    function debugExplorer() {
        let codeExplorer = code;
        while (!codeExplorer.endOfFile()) console.log(codeExplorer.nextChar());
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }

    function debugLexer() {
        let codeLexer = lexe(code);
        while (!codeLexer.endOfFile()) console.log(codeLexer.nextToken());
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }

    function debugParser() {
        let codeParser = parse(lexe(code));
        console.log(util.inspect(codeParser, {
            showHidden: false,
            depth: null
        }));
        code.warningMessage("Utiliser le debugger uniquement en developpement");
    }
};