const messageModule = require("../modules/message.module");

/**
 * Parse stream object
 * 
 * @param {string} code 
 * @returns {object}
 */
module.exports = function(codeTokenized) {
    // Final code processing output.
    return parseCode();
    /* MAIN PARSER */

    /**
     * Main code parsing loop
     */
    function parseCode() {
        let program = [];

        // code processing loop
        while (!codeTokenized.endOfFile()) {
            program.push(parseExpression());

            // Check for end of line or multiple inline code
            if (!codeTokenized.endOfFile()) passToken("ponctuation", ';');
        }

        return {
            type: "programme",
            program: program
        };
    }

    /**
     * Parse if condition and brace/keyword content
     * 
     * @return {object}
     */
    function parseIf() {
        passToken("motCle", "si");

        let condition = parseExpression();
        // I love small tricks
        if (!checkTokenType("ponctuation", '{')) passToken("motCle", "alors");
        let output = {
            type: "si",
            condition: condition,
            ifContent: parseExpression()
        };

        // Detect if there is another content
        if (checkTokenType("motCle", "ou")) {
            codeTokenized.nextToken();
            output.elseContent = parseExpression();
        }

        return output;
    }

    /**
     * Parse boolean
     * 
     * @return {object}
     */
    function parseBoolean() {
        return {
            type: "booleen",
            value: codeTokenized.nextToken().value === "vrai"
        };
    }

    /**
     * Parse function content
     * 
     * @returns {object}
     */
    function parseFunction() {
        codeTokenized.nextToken();

        return {
            type: "fonction",
            variables: parseContainer('(', ')', ',', parseVariablesName),
            body: parseExpression()
        }
    }

    /**
     * Parse call a function
     * 
     * @param {function} calledFunction 
     * @returns {object}
     */
    function parseFunctionCall(calledFunction) {
        return {
            type: "appel",
            calledFunction: calledFunction,
            arguments: parseContainer('(', ')', ',', parseExpression)
        };
    }

    /**
     * Parse inside function declaration's brace
     * 
     * @returns {object}
     */
    function parseProgram() {
        var program = parseContainer('{', '}', ';', parseExpression);

        // Brace content something?
        if (program.lenght === 0) return {
            type: "booleen",
            value: false
        }
        if (program.lenght === 1) return program[0];
        return {
            type: "programme",
            program: program
        };
    }

    /**
     * Parse container
     * 
     * @param {char} beginChar 
     * @param {char} endChar 
     * @param {char} separatorChar 
     * @param {function} parser 
     */
    function parseContainer(beginChar, endChar, separatorChar, parser) {
        let containerContent = [];
        let firstParameter = true;

        passToken("ponctuation", beginChar);
        while (!codeTokenized.endOfFile()) {
            // Check if it's empty parameter content
            if (checkTokenType("ponctuation", endChar)) break;

            // Skip the first loop because that's the first parameter, of course.
            if (firstParameter) firstParameter = false;
            else passToken("ponctuation", separatorChar);

            // If the second parameter after the comma is also empty
            if (checkTokenType("ponctuation", endChar)) break;
            containerContent.push(parser());
        }
        passToken("ponctuation", endChar);

        return containerContent;
    }

    function parseVariablesName() {
        let currentToken = codeTokenized.nextToken();
        if (currentToken.type !== "variable") messageModule.error("Le nom de variable n'est pas valide", currentToken, codeTokenized.position);
        return currentToken.value;
    }

    /**
     * Parse inside container elements
     * 
     * @returns {any}
     */
    function parseExpression() {
        return detectCall(function() {
            return detectCalculation(dispatch(), 0);
        })
    }

    function parsePunctuation() {
        codeTokenized.nextToken();
        let expression = parseExpression();
        passToken("ponctuation", ')');

        return expression;
    }

    /* PARSER BIG BORTHER */

    /**
     * Dispatch the code to the right paser
     * 
     * @returns {any}
     */
    function dispatch() {
        return detectCall(function() {
            // Parameter parser
            if (checkTokenType("ponctuation", '(')) return parsePunctuation();

            // Content parser
            if (checkTokenType("ponctuation", '{')) return parseProgram();

            // Keyword
            if (checkTokenType("motCle", "si")) return parseIf();
            if (checkTokenType("motCle", "vrai") ||
                checkTokenType("motCle", "faux")) return parseBoolean();
            if (checkTokenType("motCle", "fonction")) return parseFunction();

            // Variables stockage
            let currentToken = codeTokenized.nextToken();
            if (currentToken.type === "variable" ||
                currentToken.type === "nombre" ||
                currentToken.type === "chaine") return currentToken;

            // No, no, no, no.... n...o
            unexpectedMessage();
        });
    }

    /* DETECTORS */

    function detectCall(expression) {
        return checkTokenType("ponctuation", '(') ? parseFunctionCall(expression()) : expression();
    }

    /**
     * Precedence distribution for calculation
     * 
     * That check the calculation operator precedence and
     * check the next part of the calcul recursively.
     * 
     * @param {string} leftSide 
     * @param {integer} previousTokenPrecedence 
     * @returns {object} 
     */
    function detectCalculation(leftSide, previousTokenPrecedence) {
        // This little guy check for te current token in stream, no specified element.
        let currentToken = checkTokenType("operateur", null);

        if (currentToken) {
            var tokenPrecedence = {
                "=": 1,
                "||": 2,
                "&&": 3,
                "<": 7,
                ">": 7,
                "<=": 7,
                ">=": 7,
                "==": 7,
                "!=": 7,
                "+": 10,
                "-": 10,
                "*": 20,
                "/": 20,
                "%": 20,
            }[currentToken.value];

            // Check operation nature
            if (tokenPrecedence > previousTokenPrecedence) {
                codeTokenized.nextToken();

                return detectCalculation({
                    type: currentToken.value === "=" ? "attribution" : "calcul",
                    operator: currentToken.value,
                    leftSide: leftSide,
                    rightSide: detectCalculation(dispatch(), tokenPrecedence)
                }, previousTokenPrecedence);
            }
        }

        return leftSide;
    }

    /**
     * Check the token type
     * 
     * @param {string} type 
     * @param {char} element 
     */
    function checkTokenType(type, element) {
        var token = codeTokenized.peekToken();
        return token &&
            token.type === type &&
            (!element || token.value === element) &&
            token;
    }

    /**
     * Skip the token if it's what he expect
     * 
     * It is used to pass the token.
     * 
     * @param {string} type 
     * @param {char} element 
     */
    function passToken(type, element) {
        if (checkTokenType(type, element)) codeTokenized.nextToken();
        else messageModule.error("On s'attendais a un " + type, element, codeTokenized.position);
    }

    /**
     * No
     */
    function unexpectedMessage() {
        messageModule.error("Mais, mais... Pourquoi il y a ça", JSON.stringify(codeTokenized.peekToken()), codeTokenized.position);
    }
}