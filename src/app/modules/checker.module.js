/**
 * Checker element type
 */
let checkerModule = {
    keyword: function(element) {
        return "si;alors;ou;fonction;vrai;faux;".indexOf(element + ';') >= 0;
    },
    digital: function(element) {
        return /[0-9]/i.test(element);
    },
    identifierTypage: function(element) {
        return /[a-z_]/i.test(element);
    },
    identifier: function(element) {
        return checkerModule.identifierTypage(element) || "?!-<>=0123456789".indexOf(element) >= 0;
    },
    operator: function(element) {
        return "+-*/%=&|<>!".indexOf(element) >= 0;
    },
    punctuation: function(element) {
        return ",;(){}[]".indexOf(element) >= 0;
    },
    indentation: function(element) {
        return " \t\n".indexOf(element) >= 0;
    }
}

module.exports = checkerModule;