const explore = require("./system/system.explorer");
const lexe = require("./system/system.lexer");
const parse = require("./system/system.parser");

codeEntry = "sum = 1+1;";

// let codeParsed = parse(lexe(explore(codeEntry)));

// console.log(codeParsed);

//debugLexer();
debugExplorer();

function debugLexer() {
    let lexedCode = lexe(explore(codeEntry));

    while(!lexedCode.endOfFile()) {
        console.log(lexedCode.nextToken());
    }
    lexedCode.warningMessage("Utiliser le debugger qu'en developpement");
}

function debugExplorer() {
    let explorerCode = explore(codeEntry);

    while(!explorerCode.endOfFile()) {
        console.log(explorerCode.nextChar());
    }
    explorerCode.warningMessage("Utiliser le debugger qu'en developpement");
}