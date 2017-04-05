const francais = require("./francais");

codeEntry = "fonction (foo, bar) si foo alors bar ou baz;";
let treatedCode = francais.interprete(codeEntry);

// Debugger
let codeDebugger = francais.debug(codeEntry);
// console.log('\n');
// codeDebugger.explorer();
// console.log('\n');
// codeDebugger.lexer();
// console.log('\n');
// codeDebugger.parser();
// console.log('\n');