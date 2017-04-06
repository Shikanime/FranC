const francais = require("./francais");

//codeEntry = "fonction (foo, bar) si foo alors bar ou baz;";
codeEntry = `sum = 4;`;
let treatedCode = francais.interprete(codeEntry);

// Debugger
// let codeDebugger = francais.debug(codeEntry);
// codeDebugger.explorer();
// codeDebugger.lexer();
// codeDebugger.parser();