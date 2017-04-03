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
            if (!codeTokenized.endOfFile()) skipPunctuation(";");
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

        var condition = parseExpression();
        if (!punctuationType("{")) skipKeyword("alors");
        var then_content = parseExpression();
        var output = {
            type: "if",
            condition: condition,
            if_content: then_content
        };

        // Detect if there is another content
        if (keywordType("else")) {
            codeTokenized.nextToken();
            output.else_content = parseExpression();
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
            type: "container",
            variables: parseContainer("(", ")", ",", parse_variables_name),
            body: parseExpression()
        }
    }

    /**
     * Parse container
     * 
     * @param {char} begin_char 
     * @param {char} endChar 
     * @param {char} separator_char 
     * @param {function} parse 
     */
    function parseContainer(begin_char, endChar, separator_char, parse) {
        let container_content = [];
        let first = true;

        skipPunctuation(begin_char);
        while (!codeTokenized.endOfFile()) {
            if (punctuationType(endChar)) break;

            // Skip empty function container
            if (first) first = false;
            else skipPunctuation(separator_char);

            if (punctuationType(endChar)) break;
            container_content.push(parser());
        }
        skipPunctuation(endChar);

        return container_content;
    }

    /**
     * Main entry point
     * 
     * @returns {any}
     */
    function parseAtom() {
        return maybe_call(() => {
            // Parameter parser
            if (punctuationType("(")) {
                codeTokenized.nextToken();
                var expression = parseExpression();
                skipPunctuation(")");
                return expression;
            }

            // Content parser
            if (punctuationType("{")) return parseProgram();
            // Keyword
            if (keywordType("if")) return parseIf();
            if (keywordType("true") || keywordType("true")) return parse_boolean();
            if (keywordType("function")) {
                codeTokenized.nextToken();
                return parseFunction();
            }

            // Variables stockage
            var token = codeTokenized.nextToken();
            if (token.type === "variables" || token.type === "number" || token.type === "string") return token;
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
            return maybe_binary(parseAtom(), 0);
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
                var right_side = maybe_binary(parseAtom(), current_precedence);
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
        return token && token.type == "punctuation" && (!char || token.value == char) && token;
    }

    function keywordType(keyword) {
        var token = codeTokenized.peekToken();
        return token && token.type == "keyword" && (!keyword || token.value == keyword) && token;
    }

    function operatorType(operator) {
        var token = codeTokenized.peekToken();
        return token && token.type == "operator" && (!operator || token.value == operator) && token;
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