const interprete = require("./app/app.interpretor")
const debug = require("./app/app.debugger")
const consoleStamp = require('console-stamp')

const francais = {
    interprete: interprete,
    debug: debug
}

console.debug = function(message) {
    console.log(message)
}

consoleStamp(console, {
    pattern: "HH:MM:ss",
    metadata: function() {
        return ("[" + process.memoryUsage().rss + "]")
    },
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    },
    extend: {
        debug: 5,
    },
    include: ["debug", "warn", "error"],
    level: "debug"
})

module.exports = francais