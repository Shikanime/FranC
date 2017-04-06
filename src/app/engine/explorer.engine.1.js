const messageModule = require("../modules/message.module");

/**
 * Input stream object
 * 
 * Setup different primary code explorer for the
 * next step. Based on fordism strategy.
 * 
 * @param {string} codeRaw 
 * @returns {object}
 */
module.exports = function CodeExplorer(codeRaw) {
    let codePosition = 0;

    // Variables for error handler debugging
    let codeLine = 1;
    let codeColumn = 0;

    if (endOfFile()) messageModule.warning("Pas de code");

    // Return explorer tools
    return {
        nextChar: nextChar,
        peekChar: peekChar,
        endOfFile: endOfFile,
        position: {
            line: lineParameter,
            column: columnParameter
        }
    };

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

        // Switch to the next line
        if (char === '\n') {
            codeLine++;
            codeColumn = 0;
        } else codeColumn++;

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

    function lineParameter() {
        return codeLine;
    }

    function columnParameter() {
        return codeColumn;
    }
};