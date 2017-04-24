const explorerEngine = require("./engine/explorer.engine")
const lexerEngine = require("./engine/lexer.engine")
const parserEngine = require("./engine/parser.engine")
const evaluatorEngine = require("./engine/evaluator.engine")
const variableEnvironmentModule = require("./modules/environement.module")
const util = require('util')

/**
 * Debugger
 * 
 * @param {any} sourceCode 
 * @returns {object}
 */
module.exports = function(sourceCode) {
    return {
        explorer: explorer,
        lexer: lexer,
        parser: parser
    }

    /**
     * Debug the code explorer tools
     */
    function explorer() {
        let codeExplorer = explorerEngine(sourceCode)
        console.debug("Debug explorer:")
        while (!codeExplorer.endOfFile()) console.log(codeExplorer.nextChar())
    }

    /**
     * Debug the code tokenizer tools
     */
    function lexer() {
        let codeLexer = lexerEngine(explorerEngine(sourceCode))
        console.debug("Debug lexer:")
        while (!codeLexer.endOfFile()) console.log(codeLexer.nextToken())
    }

    /**
     * Debug the parsed code
     */
    function parser() {
        let codeParsed = parserEngine(lexerEngine(explorerEngine(sourceCode)))
        console.debug("Debug parser:")
        console.log(util.inspect(codeParsed, {
            showHidden: true,
            depth: null
        }))
    }
}