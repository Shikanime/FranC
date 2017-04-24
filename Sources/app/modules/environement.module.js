const messageModule = require("./message.module")

/**
 * Variables stockage environement and scoping object
 */
function VariableEnvironmentModule(parentScope) {
    this.variables = Object.create(parentScope ? parentScope.vars : null)
    this.parentScope = parentScope
}

VariableEnvironmentModule.prototype = {
    appendScope: function() {
        return new VariableEnvironmentModule(this)
    },
    lookup: function(name) {
        let scope = this

        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.variables, name)) return scope
            scope = scope.parentScope
        }
    },
    get: function(name) {
        if (name in this.variables) return this.variables[name]
        messageModule.error("Variables indefini", name)
    },
    set: function(name, value) {
        let scope = this.lookup(name)

        if (!scope &&
            this.parentScope)
            console.error("Variables indefini", name)
        return (scope || this).variables[name] = value
    },
    define: function(name, value) {
        return this.variables[name] = value
    }
}

module.exports = VariableEnvironmentModule