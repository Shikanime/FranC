/**
 * Parse stream object
 * 
 * @param {string} code 
 * @returns {object}
 */

function parseStream(codeTokenized, callback) {


    /**
     * Parse the code
     */
    function parse_code() {
        let code = [];

        while (!codeTokenized.end_of_file()) {
            code.push(parse_expression());
            if (!codeTokenized.end_of_file()) skip_punctuation(";");
        }
    }

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
            codeTokenized.next_char();
            output.else_content = parse_expression();
        };

        return output;
    }

    /**
     * Read function content
     * 
     * @returns {object}
     */
    function parse_container() {
        return {
            type: "container",
            variables: parse_container("(", ")", ",", parse_variables_name),
            body: parse_expression()
        }
    }

    /**
     * Parse function content
     * 
     * @param {char} begin_char 
     * @param {char} end_char 
     * @param {char} separator_char 
     * @param {function} parse 
     */
    function parse_container(begin_char, end_char, separator_char, parse) {
        let argument = [];
        let first = true;

        skip_punctuation(begin_char);
        while (!codeTokenized.end_of_file()) {
            if (is_punctuation(end_char)) break;

            // Skip empty function arguments
            if (first) first = false;
            else skip_punctuation(separator_char);

            if (is_punctuation(end_char)) break;
            argument.push(parser());
        }
        skip_punctuation(end_char);

        return argument;
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
                codeTokenized.next_char();
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
                codeTokenized.next_char();
                return parse_fucntion();
            }

            // Variables stockage
            var token = codeTokenized.next_char();
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
        return is_punctuation("(") ? parse_call(expression) : expression;
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

    /*
        function maybe_binary(left, my_prec) {
            var tok = is_op();
            if (tok) {
                var his_prec = PRECEDENCE[tok.value];
                if (his_prec > my_prec) {
                    input.next();
                    var right = maybe_binary(parse_atom(), his_prec) // (*);
                    var binary = {
                        type: tok.value == "=" ? "assign" : "binary",
                        operator: tok.value,
                        left: left,
                        right: right
                    };
                    return maybe_binary(binary, my_prec);
                }
            }
            return left;
        }
    */
}