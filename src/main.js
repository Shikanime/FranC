const explore = require("./system/system.explorer");
const lexe = require("./system/system.lexer");
const parse = require("./system/system.parser");

codeEntry = "sum = 1+1;";

// let codeParsed = parse(lexe(explore(codeEntry)));

// console.log(codeParsed);

var test = lexe(explore(codeEntry));

console.log(test.nextToken());
console.log(test.nextToken());
console.log(test.nextToken());
console.log(test.nextToken());
console.log(test.nextToken());
console.log(test.nextToken());
console.log(test.nextToken());
console.log(test.nextToken());