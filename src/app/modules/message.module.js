module.exports = function() {}.prototype = {
    error: function(message, source, position) {
        if (position) console.error(message + ": \"" + source + "\"" + " (" + position.line() + ":" + position.column() + ")");
        else if (source) console.error(message + ": \"" + source + "\"");
        else console.error(message);
    },
    warning: function(message, source, position) {
        if (position) console.warn(message + ": \"" + source + "\"" + " (" + position.line() + ":" + position.column() + ")");
        else if (source) console.warn(message + ": \"" + source + "\"");
        else console.warn(message);
    }
}