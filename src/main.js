require("./input");
require("./lexer");
require("./parser");

codeEntry = "";

input(codeEntry)
    .then((codeSource) => lexer(codeSource))
    .then((codeTokenized) => parse(codeTokenized))
    .catch(function(e) {
        console.error("Hein?")
    })