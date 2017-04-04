const francais = require("./francais");

codeEntry = "si foo alors bar ou baz;";

let treatedCode = francais.interprete(codeEntry);

// Debugger
francais.debug("explorer", codeEntry);
francais.debug("lexer", codeEntry);
francais.debug("parser", codeEntry);