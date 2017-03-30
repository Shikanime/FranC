/**
 * Tokenize stream object
 * 
 * @param {string} code 
 * @returns {object}
 */
function tokenStream(codeTokenized, callback) {
    var current_char = null;

    callback({
        next_char: next_char,
        peek_char: peek_char,
        end_of_file: end_of_file,
        error: code.error,
        warning: code.warning
    });

    /**
     * Check if the character is keyword
     * 
     * @param {string} string 
     * @returns {bool}
     */
    function is_keyword(string) {
        return "si;alors;ou;fonction;vrai;faux;".indexOf(string + ';') >= 0;
    }

    /**
     * Check if the character is digit
     * 
     * @param {char} char 
     * @returns {bool}
     */
    function is_digital(char) {
        return /[0-9]/i.test(char);
    }

    /**
     * Check if the character is a identifier that open brace
     * 
     * @param {char} char 
     * @returns {bool}
     */
    function is_identifier_typage(ch) {
        return /[a-z_]/i.test(ch);
    }

    /**
     * Check if the character is a identifier
     * 
     * @param {char} char 
     * @returns {bool}
     */
    function is_identifier(char) {
        return is_identifier_typage(char) || "?!-<>=0123456789".indexOf(char) >= 0;
    }

    /**
     * Check if the character is a operator
     * 
     * @param {char} char 
     * @returns {bool}
     */
    function is_operator(char) {
        return "+-*/%=&|<>!".indexOf(char) >= 0;
    }

    /**
     * Check if the character is a operator
     * 
     * @param {char} char 
     * @returns {bool}
     */
    function is_punctuation(char) {
        return ",;(){}[]".indexOf(char) >= 0;
    }

    /**
     * Check if the character is a indentation
     * 
     * @param {char} char 
     * @returns {bool}
     */
    function is_indentation(charch) {
        return " \t\n".indexOf(char) >= 0;
    }

    /**
     * Check if the code file is ended
     * 
     * @returns {bool}
     */
    function end_of_file() {
        return peek_char() == null;
    }

    /* EXTRACTOR */

    /**
     * Main reader
     * 
     * @param {function} predicate 
     * @returns {string}
     */
    function extract_while_pattern(predicate) {
        let string = "";

        while (!code.end_of_file() && predicate(code.next_char())) {
            string += code.next_char();
        }

        return string;
    }

    /**
     * Extract until find the end pattern
     * 
     * @param {any} end_char 
     * @returns {object}
     */
    function extract_until_pattern(end_char) {
        let escaped = false;
        let string = "";

        code.next_char();
        while (!code.end_of_file()) {
            let char = code.next_char();

            if (escaped) {
                string += char;
                escaped = false;
            } else if (char == "\\")
                escaped = true;
            else if (char == end_char)
                break;
            else
                string += char;
        }

        return string;
    }

    /* Reader */

    /**
     * Parse number (integer and float detection)
     * 
     * @returns {object}
     */
    function read_number() {
        let has_dot = false;
        let number = extract_while_pattern(function(char) {

            // Float detection
            if (char === ".") {

                // Switcher
                if (has_dot) return false;
                has_dot = true;

                return true;
            }

            return is_digital(char);
        });

        return {
            type: "number",
            value: parseFloat(number)
        };
    }

    /**
     * Parse identifier
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
     * @returns 
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
     * @returns 
     */
    function skip_comment() {
        extract_while_pattern(function(char) {
            return char != "\n";
        });
        code.next_char();

        return read_next_char();
    }

    /* Core parse */

    /**
     * Main entry recursive reader
     * 
     */
    function read_next_char() {
        extract_while_pattern(is_indentation);

        if (code.end_of_file()) return null;

        var char = code.next_char();

        // Comment detect
        if (char == "#") skip_comment();

        // Data type detection
        if (char == '"') return read_string();
        if (is_digital(char)) return read_number();

        // Sementic detection
        if (is_identifier_typage(char)) return read_identifier();
        if (is_punctuation(char)) return {
            type: "punctuation",
            value: code.next_char()
        };
        if (is_operator(char)) return {
            type: "operator",
            value: extract_while_pattern(is_operator)
        };

        code.error("Impossible d'identifier ce caractere: " + char);
    }

    /**
     * Process the char in code stream
     * 
     * @returns {char}
     */
    function peek_char() {
        return current_char || (current_char = read_next_char());
    }

    /**
     * Get the next char
     * 
     * @returns {char}
     */
    function next_char() {
        // get current char if he have been peek
        var tok = current_char;

        current_char = null;

        return tok || read_next_char();
    }
}