/**
 * Message handler
 */
let messageModule = {
    error: function(message, source, position) {
        console.error(consoleMessage(message, source, position));
    },
    warning: function(message, source, position) {
        console.warn(consoleMessage(consoleOutput));
    }
}

function consoleMessage(message, source, position) {
    let consoleOutput = message;

    if (source) consoleOutput += ": \"" + source + "\"";
    if (position) consoleOutput += " (" + position.line() + ":" + position.column() + ")";

    return consoleOutput;
}

module.exports = messageModule;