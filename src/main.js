const francais = require("./francais");

codeEntry = "sum = 1 + 1;";

let treatedCode = francais.interprete(codeEntry);

// Debugger
//francais.debug("explorer", codeEntry);
//francais.debug("lexer", codeEntry);
//francais.debug("parser", codeEntry);