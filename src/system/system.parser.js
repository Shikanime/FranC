/**
 * Parse stream object
 * 
 * @param {string} code 
 * @returns {object}
 */
module.exports = function parseStream(codeTokenized) {
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
            if (!codeTokenized.endOfFile()) passToken("punctuation", ';');
        }

        return {
            type: "program",
            program: program
        };
    }

    /**
     * Parse if condition and brace/keyword content
     * 
     * @return {object}
     */
    function parseIf() {
        passToken("keyword", "if");

        let condition = parseExpression();
        // I love small tricks
        if (!checkTokenType("punctuation", '{')) passToken("keyword", "then");
        let output = {
            type: "if",
            condition: condition,
            ifContent: parseExpression()
        };

        // Detect if there is another content
        if (checkTokenType("keyword", "else")) {
            codeTokenized.nextToken();
            output.elseContent = parseExpression();
        };

        return output;
    }

    /**
     * Read function content
     * 
     * @returns {object}
     */
    function parseFunction() {
        return {
            type: "function",
            variables: parseContainer('(', ')', ',', parseVariablesName),
            body: parseExpression()
        }
    }

    /**
     * Parse boolean
     * 
     * @return {object}
     */
    function parseBoolean() {
        return {
            type: "bool",
            value: codeTokenized.nextToken().value === "true"
        };
    }

    /**
     * Call a function
     * 
     * @param {function} calledFunction 
     * @returns {object}
     */
    function parseFunctionCall(calledFunction) {
        return {
            type: "call",
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
            type: "bool",
            value: false
        }
        if (program.lenght === 1) return program[0];
        return {
            type: "program",
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

        passToken("punctuation", beginChar);
        while (!codeTokenized.endOfFile()) {
            // Check if it's empty parameter content
            if (checkTokenType("punctuation", endChar)) break;

            // Skip the first loop because that's the first parameter, of course.
            if (firstParameter) firstParameter = false;
            else passToken("punctuation", separatorChar);

            // If the second parameter after the comma is also empty
            if (checkTokenType("punctuation", endChar)) break;
            containerContent.push(parser());
        }
        passToken("punctuation", endChar);

        return containerContent;
    }

    function parseVariablesName() {
        let currentToken = codeTokenized.nextToken();
        if (currentToken.type !== "variable") codeTokenized.errorMessage("Le nom de variable n'est pas valide", currentToken);
        return currentToken.value;
    }

    /**
     * Parse inside container elements
     * 
     * @returns {any}
     */
    function parseExpression() {
        return detectCall(() => {
            return detectBinary(dispatch(), 0);
        })
    }

    /* PARSER BIG BORTHER */

    /**
     * Dispatch the code to the right paser
     * 
     * @returns {any}
     */
    function dispatch() {
        return detectCall(() => {
            // Parameter parser
            if (checkTokenType("punctuation", '(')) {
                codeTokenized.nextToken();
                let expression = parseExpression();
                passToken("punctuation", ')');

                return expression;
            }

            // Content parser
            if (checkTokenType("punctuation", '{')) return parseProgram();

            // Keyword
            if (checkTokenType("keyword", "if")) return parseIf();
            if (checkTokenType("keyword", "true") ||
                checkTokenType("keyword", "false"))
                return parseBoolean();
            if (checkTokenType("keyword", "function")) {
                codeTokenized.nextToken();
                return parseFunction();
            }

            // Variables stockage
            let currentToken = codeTokenized.nextToken();
            if (currentToken.type === "variable" ||
                currentToken.type === "number" ||
                currentToken.type === "string")
                return currentToken;

            // No, no, no, no.... n...o
            unexpectedMessage();
        });
    }

    /* DETECTORS */

    function detectCall(expression) {
        return checkTokenType("punctuation", '(') ? parseFunctionCall(expression()) : expression();
    }

    /**
     * Precedence distribution for calculation
     * 
     * That check the binary operator's precedence and
     * check the next part of the calcul recursively.
     * 
     * @param {string} leftSide 
     * @param {integer} previousTokenPrecedence 
     * @returns {object} 
     */
    function detectBinary(leftSide, previousTokenPrecedence) {
        // This little guy check for te current token in stream, no specified element.
        let currentToken = checkTokenType("operator", null);

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

                return detectBinary({
                    type: currentToken.value === "=" ? "assign" : "binary",
                    operator: currentToken.value,
                    leftSide: leftSide,
                    rightSide: detectBinary(dispatch(), tokenPrecedence)
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
        else codeTokenized.errorMessage("Expecting " + type, element);
    }

    function unexpectedMessage() {
        codeTokenized.errorMessage("Mais, mais... Pourquoi il y a ça", JSON.stringify(codeTokenized.peekToken()));
    }
}