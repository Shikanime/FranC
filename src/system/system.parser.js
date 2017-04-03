/**
 * Parse stream object
 * 
 * @param {string} code 
 * @returns {object}
 */
module.exports = function parseStream(codeTokenized) {

    // Final code processing output.
    // The end of a long travel ^^
    return parseCode();

    /**
     * Parse the code
     */
    function parseCode() {
        let program = [];

        // code processing loop
        while (!codeTokenized.endOfFile()) {
            program.push(parseExpression());

            // Check for end of line or multiple inline code
            if (!codeTokenized.endOfFile()) skipPunctuation(';');
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
        skipKeyword("if");

        let condition = parseExpression();
        if (!punctuationType("{")) skipKeyword("then");
        let output = {
            type: "if",
            condition: condition,
            ifContent: parseExpression()
        };

        // Detect if there is another content
        if (keywordType("else")) {
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
            variables: parseContainer("(", ")", ",", parse_variables_name),
            body: parseExpression()
        }
    }

    /**
     * Parse container
     * 
     * @param {char} beginChar 
     * @param {char} endChar 
     * @param {char} separatorChar 
     * @param {function} parse 
     */
    function parseContainer(beginChar, endChar, separatorChar, parser) {
        let containerContent = [];
        let first = true;

        skipPunctuation(beginChar);
        while (!codeTokenized.endOfFile()) {
            if (punctuationType(endChar)) break;

            // Skip empty function container
            if (first) first = false;
            else skipPunctuation(separatorChar);

            if (punctuationType(endChar)) break;
            containerContent.push(parser());
        }
        skipPunctuation(endChar);

        return containerContent;
    }

    /**
     * Main entry point
     * 
     * @returns {any}
     */
    function dispatch() {
        return maybe_call(() => {
            // Parameter parser
            if (punctuationType('(')) {
                codeTokenized.nextToken();
                let expression = parseExpression();
                skipPunctuation(')');

                return expression;
            }

            // Content parser
            if (punctuationType('{')) return parseProgram();

            // Keyword
            if (keywordType("if")) return parseIf();
            if (keywordType("true") ||
                keywordType("true"))
                return parse_boolean();
            if (keywordType("function")) {
                codeTokenized.nextToken();
                return parseFunction();
            }

            // Variables stockage
            var token = codeTokenized.nextToken();
            if (token.type === "variable" ||
                token.type === "number" ||
                token.type === "string")
                return token;

            // No, no, no, no.... n...o
            unexpectedMessage();
        });
    }

    /**
     * Parse inside function declaration brace
     * 
     * @returns {object}
     */
    function parseProgram() {
        var program = parseContainer("{", "}", ";", parseExpression);

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
     * Parse inside container elements
     * 
     * @returns {any}
     */
    function parseExpression() {
        return maybe_call(() => {
            return maybe_binary(dispatch(), 0);
        })
    }

    function maybe_call(expression) {
        expression = expression();
        return punctuationType("(") ? parseFunctionCall(expression) : expression;
    }

    /**
     * Call a function
     * 
     * @param {function} called_function 
     * @returns {object}
     */
    function parseFunctionCall(called_function) {
        return {
            type: "call",
            called_function: called_function,
            arguments: parseContainer("(", ")", ",", parseExpression)
        };
    }

    /**
     * Precedence distribution for calculation
     * 
     * That check the binary operator's precedence and
     * check the next part of the calcul recursively.
     * 
     * @param {string} left_side 
     * @param {integer} previous_precedence 
     * @returns {string} 
     */
    function maybe_binary(left_side, previous_precedence) {
        var token = operatorType();

        if (token) {
            var current_precedence = {
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
            }[token.value];

            // Check operation nature
            if (current_precedence > previous_precedence) {
                codeTokenized.nextToken();
                var right_side = maybe_binary(dispatch(), current_precedence);
                var binary = {
                    type: token.value === "=" ? "assign" : "binary",
                    operator: token.value,
                    left_side: left_side,
                    right_side: right_side
                };

                return maybe_binary(binary, previous_precedence);
            }
        }

        return left_side;
    }

    /* VERIFICATION HELPER LAYERS */

    function punctuationType(char) {
        var token = codeTokenized.peekToken();
        return token &&
            token.type == "punctuation" &&
            (!char || token.value == char) &&
            token;
    }

    function keywordType(keyword) {
        var token = codeTokenized.peekToken();
        return token &&
            token.type == "keyword" &&
            (!keyword || token.value == keyword) &&
            token;
    }

    function operatorType(operator) {
        var token = codeTokenized.peekToken();
        return token &&
            token.type == "operator" &&
            (!operator || token.value == operator) &&
            token;
    }

    function skipPunctuation(char) {
        if (punctuationType(char)) codeTokenized.nextToken();
        else codeTokenized.errorMessage("Expecting punctuation:", char);
    }

    function skipKeyword(keyword) {
        if (keywordType(keyword)) codeTokenized.nextToken();
        else codeTokenized.errorMessage("Expecting keyword:", keyword);
    }

    function skipOperator(operator) {
        if (operatorType + (operator)) codeTokenized.nextToken();
        else codeTokenized.errorMessage("Expecting operator:", operator);
    }

    function unexpectedMessage() {
        codeTokenized.errorMessage("Mais, mais... Pourquoi il y a ça:", JSON.stringify(codeTokenized.peekToken()));
    }
}