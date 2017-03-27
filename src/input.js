/**
 * code stream object
 * 
 * @param {any} code 
 * @returns {object}
 */
function codeStream(code) {
    var position = 0;
    var line = 1;
    var column = 0;

    return {
        next_char: next_char,
        peek_char: peek_char,
        end_of_file: end_of_file,
        error: error,
        warning: warning
    };

    /**
     * Get next element
     * 
     * @returns {char}
     */
    function next_char() {
        let char = code.charAt(position++);

        if (char == "\n") {
            line++;
            column = 0;
        } else {
            column++;
        }

        return char;
    }

    /**
     * Get next element and splice it from the stream
     * 
     * @returns {char}
     */
    function next_char() {
        return code.charAt(position);
    }

    /**
     * Detect end of file
     * 
     * @returns {bool}
     */
    function end_of_file() {
        return next_char() === "";
    }

    /**
     * Error handler
     * 
     * @param {string} msg 
     */
    function error(msg) {
        throw new Error(msg + " (" + line + ":" + column + ")");
    }

    /**
     * Warning handler
     * 
     * @param {string} msg 
     */
    function warning(msg) {
        throw new Error(msg + " (" + line + ":" + column + ")");
    }
}