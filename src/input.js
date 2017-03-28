/**
 * Input stream object
 * 
 * @param {string} code 
 * @returns {object}
 */
function codeStream(code, callback) {
    var position = 0;
    var line = 1;
    var column = 0;

    callback({
        next_char: next_char,
        peek_char: peek_char,
        end_of_file: end_of_file,
        error: error,
        warning: warning
    });

    /**
     * Get next element and splice it from the stream
     * 
     * @returns {char}
     */
    function next_char() {
        let char = code.charAt(position++);

        // Send next line if it's the end of current line
        if (char == "\n") {
            line++;
            column = 0;
        } else {
            column++;
        }

        return char;
    }

    /**
     * Peek the current element to be process in lexer
     * 
     * @returns {char}
     */
    function peek_char() {
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
        throw new Error("Error" + msg + " (" + line + ":" + column + ")");
    }

    /**
     * Warning handler
     * 
     * @param {string} msg 
     */
    function warning(msg) {
        throw new Error("Warning:" + msg + " (" + line + ":" + column + ")");
    }
}