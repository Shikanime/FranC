const explore = require("./modules/module.explorer");
const lexe = require("./modules/module.lexer");
const parse = require("./modules/module.parser");

codeEntry = `sum = function(x, y) x + y;`;

var codeParsed = parse(lexe(explore(codeEntry)));
console.log(codeParsed);