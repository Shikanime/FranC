module.exports = function() {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}.prototype = {
    appendchild: function() {
        return new Environment(this);
    },
    lookup: function(name) {
        let scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) return scope;
            scope = scope.parent;
        }
    },
    get: function(name) {
        if (name in this.vars)
            return this.vars[name];
        console.error("Undefined variable " + name);
    },
    set: function(name, value) {
        let scope = this.lookup(name);
        if (!scope &&
            this.parent)
            console.error("Undefined variable " + name);
        return (scope || this).vars[name] = value;
    },
    define: function(name, value) {
        return this.vars[name] = value;
    }
}