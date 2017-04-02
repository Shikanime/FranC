/**
 * Parse stream object
 * 
 * @param {string} code 
 * @returns {object}
 */
module.exports = function parseStream(codeTokenized) {

    // Final code processing output.
    // The end of a long travel ^^
    return parse_code();

    /**
     * Parse the code
     */
    function parse_code() {
        let program = [];

        // code processing loop
        while (!codeTokenized.end_of_file()) {
            program.push(parse_expression());

            // Check for end of line or multiple inline code
            if (!codeTokenized.end_of_file()) skip_punctuation(";");
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
    function parse_if() {
        skip_keyword("if");

        var condition = parse_expression();
        if (!is_punctuation("{")) skip_keyword("alors");
        var then_content = parse_expression();
        var output = {
            type: "if",
            condition: condition,
            if_content: then_content
        };

        // Detect if there is another content
        if (is_keyword("else")) {
            codeTokenized.next_token();
            output.else_content = parse_expression();
        };

        return output;
    }

    /**
     * Read function content
     * 
     * @returns {object}
     */
    function parse_function() {
        return {
            type: "container",
            variables: parse_container("(", ")", ",", parse_variables_name),
            body: parse_expression()
        }
    }

    /**
     * Parse container
     * 
     * @param {char} begin_char 
     * @param {char} end_char 
     * @param {char} separator_char 
     * @param {function} parse 
     */
    function parse_container(begin_char, end_char, separator_char, parse) {
        let container_content = [];
        let first = true;

        skip_punctuation(begin_char);
        while (!codeTokenized.end_of_file()) {
            if (is_punctuation(end_char)) break;

            // Skip empty function container
            if (first) first = false;
            else skip_punctuation(separator_char);

            if (is_punctuation(end_char)) break;
            container_content.push(parser());
        }
        skip_punctuation(end_char);

        return container_content;
    }

    /**
     * Main entry point
     * 
     * @returns {any}
     */
    function parse_atom() {
        return maybe_call(() => {
            // Parameter parser
            if (is_punctuation("(")) {
                codeTokenized.next_token();
                var expression = parse_expression();
                skip_punctuation(")");
                return expression;
            }

            // Content parser
            if (is_punctuation("{")) return parse_program();
            // Keyword
            if (is_keyword("if")) return parse_if();
            if (is_keyword("true") || is_keyword("true")) return parse_boolean();
            if (is_keyword("function")) {
                codeTokenized.next_token();
                return parse_function();
            }

            // Variables stockage
            var token = codeTokenized.next_token();
            if (token.type === "variables" || token.type === "number" || token.type === "string") return token;
            unexpected();
        });
    }

    /**
     * Parse inside function declaration brace
     * 
     * @returns {object}
     */
    function parse_program() {
        var program = parse_container("{", "}", ";", parse_expression);

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
    function parse_expression() {
        return maybe_call(() => {
            return maybe_binary(parse_atom(), 0);
        })
    }

    function maybe_call(expression) {
        expression = expression();
        return is_punctuation("(") ? parse_function_call(expression) : expression;
    }

    /**
     * Call a function
     * 
     * @param {function} called_function 
     * @returns {object}
     */
    function parse_function_call(called_function) {
        return {
            type: "call",
            called_function: called_function,
            arguments: parse_container("(", ")", ",", parse_expression)
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
        var token = is_operator();

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

            //
            if (current_precedence > previous_precedence) {
                codeTokenized.next_token();
                var right_side = maybe_binary(parse_atom(), current_precedence);
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

    function is_punctuation(char) {
        var token = codeTokenized.peek_token();
        return token && token.type == "punctuation" && (!char || token.value == char) && token;
    }

    function is_keyword(keyword) {
        var token = codeTokenized.peek_token();
        return token && token.type == "keyword" && (!keyword || token.value == keyword) && token;
    }

    function is_operator(operator) {
        var token = codeTokenized.peek_token();
        return token && token.type == "operator" && (!operator || token.value == operator) && token;
    }

    function skip_punctuation(char) {
        if (is_punctuation(char)) codeTokenized.next_token();
        else codeTokenized.error("Expecting punctuation: \"" + char + "\"");
    }

    function skip_keyword(keyword) {
        if (is_keyword(keyword)) codeTokenized.next_token();
        else codeTokenized.error("Expecting keyword: \"" + keyword + "\"");
    }

    function skip_operator(operator) {
        if (is_operator + (operator)) codeTokenized.next_token();
        else codeTokenized.error("Expecting operator: \"" + operator + "\"");
    }

    function unexpected() {
        codeTokenized.error("Unexpected token: " + JSON.stringify(codeTokenized.peek_token()));
    }
}