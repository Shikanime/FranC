/**
 * Parse stream object
 * 
 * @param {string} code 
 * @returns {object}
 */

function parseStream(codeTokenized, callback) {

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
     * Parse function content
     * 
     * @param {char} start_char 
     * @param {char} stop_char 
     * @param {char} separator_char 
     * @param {function} parse 
     */
    function parse_container(start_char, stop_char, separator_char, parse) {
        let argument = [];
        let first = true;

        skip_container(start);
        while (!codeTokenized.end_of_file()) {
            if (is_container(stop)) break;

            // Skip empty function arguments
            if (first) first = false;
            else skip_container(separator_char);

            if (is_container(stop)) break;
            argument.push(parser());
        }
        skip_container(stop);

        return argument;
    }

    function parse_code() {
        let code = [];
        while (!codeTokenized.end_of_file()) {
            code.push(parse_expression())
        }
    }
}