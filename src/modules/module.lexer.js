/**
 * Tokenize stream object
 * Here is where we translate brute code into an recursive 
 * JavaScript Object easier to read.
 * 
 * @param {string} code 
 * @returns {object}
 */
module.exports = function tokenizeStream(codeInput) {
    var current_token = null;

    // Returning explorer tools
    return {
        next_token: next_token,
        peek_token: peek_token,
        end_of_file: end_of_file,
        error: codeInput.error,
        warning: codeInput.warning
    };

    /* TOOLS */

    /**
     * Get the next char
     * 
     * @returns {char}
     */
    function next_token() {
        // get current char if he have been peek
        var token = current_token;

        current_token = null;

        return token || read_next_token();
    }

    /**
     * Process the char in code stream
     * 
     * @returns {char}
     */
    function peek_token() {
        return current_token || (current_token = read_next_token());
    }

    /**
     * Check if the code file is ended
     * 
     * @returns {bool}
     */
    function end_of_file() {
        return peek_token() === null;
    }

    /* MAIN LEXER ENTRY */

    /**
     * Main entry reader
     * 
     * That is the core reader of the lexer. It decide to call
     * the right reader function that call extractor or not after.
     */
    function read_next_token() {
        // Skip your beautiful coding convention and line, of course.
        extract_while_pattern(is_indentation);

        // Quit the loop here
        if (codeInput.end_of_file()) return null;

        var next_token = codeInput.next_char();

        // Comment detect
        if (next_token === "#") skip_comment();

        // Data type detection
        if (next_token === '"') return read_string();
        if (is_digital(next_token)) return read_number();

        // Sementic detection
        if (is_identifier_typage(next_token)) return read_identifier();
        if (is_punctuation(next_token)) return {
            type: "punctuation",
            value: codeInput.next_char()
        };
        if (is_operator(next_token)) return {
            type: "operator",
            value: extract_while_pattern(is_operator)
        };

        codeInput.error("Impossible d'identifier ce caractere: " + next_token);
    }

    /* EXTRACTOR HELPERS */

    /**
     * Extract until it see a pattern
     * 
     * The callback send a character type to the predicate
     * checker function. The function need to return 
     * a boolean everytime the pattern is ok or is no longer 
     * relevant.
     * This function is mainly used for string extraction
     * but it's enought flexible for other feature.
     * 
     * @param {function} predicate 
     * @returns {string}
     */
    function extract_while_pattern(predicate) {
        let string = "";

        while (!codeInput.end_of_file() && predicate(codeInput.next_char())) {
            string += codeInput.next_char();
        }

        return string;
    }

    /**
     * Extract until find the end pattern
     * 
     * In difference with the while pattern extractor,
     * this search for a caracter to end.
     * This function is mainly designed for string extraction
     * with escape detection.
     * 
     * @param {any} end_token 
     * @returns {object}
     */
    function extract_until_pattern(end_token) {
        let escaped = false;
        let string = "";

        codeInput.next_char();
        while (!codeInput.end_of_file()) {
            let next_token = codeInput.next_char();

            if (escaped) {
                string += next_token;
                escaped = false;
            } else if (next_token === "\\") escaped = true;
            else if (next_token === end_token) break;
            else string += next_token;
        }

        return string;
    }

    /* CODE READER */

    /**
     * Parse number (integer and float detection)
     * 
     * This language doesn't support scientific notation or
     * Hexadecimal.
     * 
     * @returns {object}
     */
    function read_number() {
        let has_dot = false;
        let number = extract_while_pattern(function(current_token) {

            // Float detection
            if (current_token === ".") {

                // Switcher
                if (has_dot) return false;
                has_dot = true;

                return true;
            }

            return is_digital(current_token);
        });

        return {
            type: "number",
            value: parseFloat(number)
        };
    }

    /**
     * Parse identifier
     * 
     * Identify keyword in code.
     * 
     * @returns {object}
     */
    function read_identifier() {
        let identifier = extract_while_pattern(is_identifier);

        return {
            type: is_keyword(identifier) ? "keyword" : "variable",
            value: identifier
        };
    }

    /**
     * Parse string
     * 
     * @returns {object}
     */
    function read_string() {
        return {
            type: "string",
            value: extract_until_pattern('"')
        };
    }

    /**
     * Skip comment block
     * 
     * That's basically a "ignore everything until end of line".
     * 
     * @returns {char}
     */
    function skip_comment() {
        extract_while_pattern(function(current_token) {
            return current_token != '\n';
        });

        codeInput.next_char();

        return read_next_token();
    }

    /* VERIFICATION HELPER LAYERS */

    function is_keyword(string) {
        return "if;then;else;function;true;false;".indexOf(string + ';') >= 0;
    }

    function is_digital(char) {
        return /[0-9]/i.test(char);
    }

    function is_identifier_typage(char) {
        return /[a-z_]/i.test(char);
    }

    function is_identifier(char) {
        return is_identifier_typage(char) || "?!-<>=0123456789".indexOf(char) >= 0;
    }

    function is_operator(char) {
        return "+-*/%=&|<>!".indexOf(char) >= 0;
    }

    function is_punctuation(char) {
        return ",;(){}[]".indexOf(char) >= 0;
    }

    function is_indentation(char) {
        return " \t\n".indexOf(char) >= 0;
    }
}