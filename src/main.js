const explore = require("./system/system.explorer");

codeEntry = `function(1+1);`;

var codeParsed = explore(codeEntry);

console.log(codeParsed);