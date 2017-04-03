const lexe = require("./system.lexer");

/**
 * Input stream object
 * 
 * Setup different primary code explorer for the
 * next step. Based on fordism strategy.
 * 
 * @param {string} codeRaw 
 * @returns {object}
 */
module.exports = function collectStream(codeRaw) {
    var codePosition = 0;

    // Variables for error handler debugging
    var codeLine = 1;
    var codeColumn = 0;

    // Return explorer tools
    lexe({
        nextChar: nextChar,
        peekChar: peekChar,
        endOfFile: endOfFile,
        errorMessage: errorMessage,
        warningMessage: warningMessage
    });

    /* TOOLS */

    /**
     * Get next element and splice it from the stream
     * 
     * That don't delete it from the memory, we just
     * switch to the next character into the stream.
     * 
     * @returns {char}
     */
    function nextChar() {
        let char = codeRaw.charAt(codePosition++);

        // Check if that is the end of codeLine
        if (char === '\n') {
            codeLine++;
            codeColumn = 0;
        } else
            codeColumn++;

        return char;
    }

    /**
     * Peek the current element to be process in lexer
     * 
     * In diffrence with next char that don't 
     * increment the stream, it get the current
     * codePosition character and send it.
     * 
     * @returns {char}
     */
    function peekChar() {
        return codeRaw.charAt(codePosition);
    }

    /**
     * Detect end of file
     * 
     * @returns {bool}
     */
    function endOfFile() {
        return peekChar() === "";
    }

    /**
     * Error handler
     * 
     * The code reading crashing, we can't continue.
     * 
     * @param {string} message 
     */
    function errorMessage(message, source) {
        console.error("[FrancaisJS] [Erreur]  " + message + " \"" + source + "\"" + " (" + codeLine + ":" + codeColumn + ")");
    }

    /**
     * Warning handler
     * 
     * The diffrence here is that the program can work
     * but we can do better.
     * 
     * @param {string} message 
     */
    function warningMessage(message, source) {
        console.error("[FrancaisJS] [Warning] " + message + " \"" + source + "\"" + " (" + codeLine + ":" + codeColumn + ")");
    }
}