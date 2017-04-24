const messageModule = require("../modules/message.module");
const checkerModule = require("../modules/checker.module");
/**
 * Tokenize stream object
 * 
 * Here is where we translate brute code into an recursive 
 * JavaScript Object easier to read.
 * 
 * @param {string} code 
 * @returns {object}
 */
module.exports = function tokenizeStream(codeInput) {
    let currentToken = null;

    // Returning explorer tools
    return {
        nextToken: nextToken,
        peekToken: peekToken,
        endOfFile: endOfFile,
        position: codeInput.position
    };

    /* TOOLS */

    /**
     * Get the next char
     * 
     * @returns {char}
     */
    function nextToken() {
        // get the current peeked
        let peekedToken = currentToken;

        // tell the next call to increment the stream
        currentToken = null;

        return peekedToken ||
            readNextToken();
    }

    /**
     * Process the char in code stream
     * 
     * @returns {char}
     */
    function peekToken() {
        return currentToken ||
            (currentToken = readNextToken());
    }

    /**
     * Check if the code file is ended
     * 
     * @returns {bool}
     */
    function endOfFile() {
        return peekToken() === null;
    }

    /* CODE READER */

    /**
     * Main reader
     * 
     * That is the core reader of the lexer. It decide to call
     * the right reader function that call extractor or not after.
     */
    function readNextToken() {
        // Skip your beautiful coding convention and line, norage de mon panage.
        extractWhilePattern(checkerModule.indentation);

        // Quit the loop here
        if (codeInput.endOfFile()) return null;

        let peekedChar = codeInput.peekChar();

        // Comment detect
        if (peekedChar === "#") return skipUntilChar('\n');

        // Data type detection
        if (peekedChar === '"') return readString();
        if (checkerModule.digital(peekedChar)) return readNumber();

        // Sementic detection
        if (checkerModule.identifierTypage(peekedChar)) return readIdentifier();
        if (checkerModule.punctuation(peekedChar)) return {
            type: "punctuation",
            value: codeInput.nextChar()
        };
        if (checkerModule.operator(peekedChar)) return {
            type: "operator",
            value: extractWhilePattern(checkerModule.operator)
        };

        messageModule.error("Impossible d'identifier ce caractere", peekedChar, codeInput.position);
    }

    /**
     * Parse number (integer and float detection)
     * 
     * This language doesn't support scientific notation or
     * Hexadecimal.
     * 
     * @returns {object}
     */
    function readNumber() {
        let float = false;
        let number = extractWhilePattern(function(currentChar) {
            // Float detection and skip the digit checker
            if (currentChar === '.') {
                // Switcher
                if (float) return false;
                float = true;

                return true;
            }

            return checkerModule.digital(currentChar);
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
    function readIdentifier() {
        let identifier = extractWhilePattern(checkerModule.identifier);

        return {
            type: checkerModule.keyword(identifier) ? "keyword" : "variable",
            value: identifier
        };
    }

    /* 化物語の羽川翼 */

    /**
     * Parse string
     * 
     * @returns {object}
     */
    function readString() {
        return {
            type: "string",
            value: extractUntilChar('"')
        };
    }

    /* EXTRACTOR HELPERS */

    /**
     * Extract until it see a char
     * 
     * The extractor send a character to the predicate
     * checker function to be proccess and return boolean.
     * This function is mainly used for string extraction
     * but it's enought flexible for other feature.
     * 
     * @param {function} predicate 
     * @returns {string}
     */
    function extractWhilePattern(predicate) {
        let string = "";

        while (!codeInput.endOfFile() && predicate(codeInput.peekChar())) {
            string += codeInput.nextChar();
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
     * @param {any} endChar 
     * @returns {object}
     */
    function extractUntilChar(endChar) {
        let escaped = false;
        let string = "";

        codeInput.nextChar();
        while (!codeInput.endOfFile()) {
            let currentChar = codeInput.nextChar();
            if (escaped) {
                string += currentChar;
                escaped = false;
            } else if (currentChar === "\\") escaped = true;
            else if (currentChar === endChar) break;
            else string += currentChar;
        }

        return string;
    }

    /**
     * Skip a block
     * 
     * That's basically a "ignore everything until something".
     * 
     * @returns {char}
     */
    function skipUntilChar(char) {
        extractWhilePattern(function(currentChar) {
            return currentChar !== char;
        });

        codeInput.nextChar();

        return readNextToken();
    }
};