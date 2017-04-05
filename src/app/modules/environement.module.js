const messageModule = require("./message.module");

/**
 * Variables stockage environement and scoping setting
 */
module.exports = function Environment() {
    this.variables = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}.prototype = {
    appendScope: function() {
        return new Environment(this);
    },
    lookup: function(name) {
        let scope = this;

        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.variables, name)) return scope;
            scope = scope.parent;
        }
    },
    get: function(name) {
        if (name in this.variables) return this.variables[name];
        messageModule.error("variables indefini", name);
    },
    set: function(name, value) {
        let scope = this.lookup(name);

        if (!scope &&
            this.parent)
            console.error("variables indefini", name);
        return (scope || this).variables[name] = value;
    },
    define: function(name, value) {
        return this.vars[name] = value;
    }
}