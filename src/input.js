/**
 * Input stream object
 * 
 * Setup different basic/primary code explorer
 * handler into a single object for next process step.
 * 
 * @param {string} codeRaw 
 * @returns {object}
 */
function codeStream(codeRaw, callback) {
    var position = 0;

    // Variables for error handler debugging
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
     * That don't delete it from the memory, we just
     * switch to the next character into the stream.
     * 
     * @returns {char}
     */
    function next_char() {
        let char = codeRaw.charAt(position++);

        // Check if that is the end of line
        if (char === '\n') {
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
     * In diffrence with next char that don't 
     * increment the stream, it get the current
     * position character and send it.
     * 
     * @returns {char}
     */
    function peek_char() {
        return codeRaw.charAt(position);
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
     * The code reading crashing, we can't continue.
     * 
     * @param {string} msg 
     */
    function error(msg) {
        throw new Error("Error" + msg + " (" + line + ":" + column + ")");
    }

    /**
     * Warning handler
     * 
     * The diffrence here is that the program can work
     * but we can do better.
     * 
     * @param {string} msg 
     */
    function warning(msg) {
        throw new Error("Warning:" + msg + " (" + line + ":" + column + ")");
    }
}