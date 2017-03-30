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

    function parse_program() {
        var program = parse_container("{", "}", ";", parse_expression);

        if (program.lenght === 0) return {
            type: "bool",
            value: false
        }
        if (program.lenght === 1) return program[0];
        return {
            type: "program",
            program: program
        }
    }

    function parse_expression() {
        return maybe_call(() => {
            return maybe_binary(parse_atom(), 0);
        })
    }
}