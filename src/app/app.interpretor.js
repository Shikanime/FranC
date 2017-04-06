const explorerEngine = require("./engine/explorer.engine");
const lexerEngine = require("./engine/lexer.engine");
const parserEngine = require("./engine/parser.engine");
const evaluatorEngine = require("./engine/evaluator.engine");
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

    let environement = new variableEnvironmentModule();

    console.log(util.inspect(abstractSyntaxTree, {
        showHidden: true,
        depth: null
    }));
    environement.define("afficher", function(val) {
        util.print(val);
    });

    evaluatorEngine(abstractSyntaxTree, environement);
}