const explore = require("./system/system.explorer");

codeEntry = `
sum = 1+1;
function test(foo) {
    foo + 1;
}
test(sum);
`;

var codeParsed = explore(codeEntry);

console.log(codeParsed);