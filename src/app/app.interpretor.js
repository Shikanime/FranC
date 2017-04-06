const explorerEngine = require("./engine/explorer.engine");
const lexerEngine = require("./engine/lexer.engine");
const parserEngine = require("./engine/parser.engine");
const evaluatorEngine = require("./engine/evaluator.engine");
const calculatorEngine = require("./engine/calculator.engine");
const variableEnvironmentModule = require("./modules/environement.module");
const util = require("util");

/**
 * Francais interpretor
 * 
 * @param {any} sourceCode 
 * @returns {object}
 */
module.exports = function(sourceCode) {
    let abstractSyntaxTree = parserEngine(lexerEngine(explorerEngine(sourceCode)));
    console.log(abstractSyntaxTree);
    // let environement = new variableEnvironmentModule();

    // environement.define("afficher", function(val) {
    //     util.print(val);
    // });

    // evaluatorEngine(abstractSyntaxTree, variablesBox);
}