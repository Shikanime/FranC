/**
 * Tokenize stream object
 * Here is where we translate brute code into an recursive 
 * JavaScript Object easier to read.
 * 
 * @param {string} code 
 * @returns {object}
 */
function tokenStream(codeInput, callback) {
    var current_char = null;

    callback({
        next_char: next_char,
        peek_char: peek_char,
        end_of_file: end_of_file,
        error: codeInput.error,
        warning: codeInput.warning
    });

    /**
     * Check if the character is keyword
     * 
     * Mainly all keyword of the program are here, we can add
     * more. We just need to another here and add the parser
     * function in parser.
     * 
     * @param {string} string 
     * @returns {bool}
     */
    function is_keyword(string) {
        return "if;then;else;function;true;false;".indexOf(string + ';') >= 0;
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
     * Check if the character is a identifier that open brace/paranthese
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
        return peek_char() === null;
    }

    /* EXTRACTOR */

    /**
     * Extract until it see a pattern
     * 
     * The callback send a character type because to
     * checker predicate function. The function need to
     * return a boolean everytime the pattern is ok or 
     * is no longer relevant.
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
     * @param {any} end_char 
     * @returns {object}
     */
    function extract_until_pattern(end_char) {
        let escaped = false;
        let string = "";

        codeInput.next_char();
        while (!codeInput.end_of_file()) {
            let next_char = codeInput.next_char();

            if (escaped) {
                string += next_char;
                escaped = false;
            } else if (next_char === "\\") escaped = true;
            else if (next_char === end_char) break;
            else string += next_char;
        }

        return string;
    }

    /* Reader */

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
        let number = extract_while_pattern(function(current_char) {

            // Float detection
            if (current_char === ".") {

                // Switcher
                if (has_dot) return false;
                has_dot = true;

                return true;
            }

            return is_digital(current_char);
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
        extract_while_pattern(function(current_char) {
            return current_char != '\n';
        });

        codeInput.next_char();

        return read_next_char();
    }

    /* Core parse */

    /**
     * Main entry recursive reader
     * 
     * That is the core reader of the lexer. It decide to call
     * the right reader function that call extractor or not after.
     */
    function read_next_char() {
        // Skip your beautiful coding convention and line, of course.
        extract_while_pattern(is_indentation);

        // Quit the loop here
        if (codeInput.end_of_file()) return null;

        var next_char = codeInput.next_char();

        // Comment detect
        if (next_char === "#") skip_comment();

        // Data type detection
        if (next_char === '"') return read_string();
        if (is_digital(next_char)) return read_number();

        // Sementic detection
        if (is_identifier_typage(next_char)) return read_identifier();
        if (is_punctuation(next_char)) return {
            type: "punctuation",
            value: codeInput.next_char()
        };
        if (is_operator(next_char)) return {
            type: "operator",
            value: extract_while_pattern(is_operator)
        };

        codeInput.error("Impossible d'identifier ce caractere: " + next_char);
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