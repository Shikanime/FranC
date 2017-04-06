const messageModule = require("../modules/message.module");
const calculatorModule = require("../modules/calculator.module");

/**
 * 
 * @param {object} codeParsed 
 * @param {object} environementVariables 
 * @return {any}
 */
module.exports = function CodeEvaluator(codeParsed, environementVariables) {

    return evaluateCode();

    function evaluateCode() {
        if (codeParsed.type === "number" ||
            codeParsed.type === "string" ||
            codeParsed.type === "boolean")
            return evaluateType();
        if (codeParsed.type === "variables") return evaluateVariable();
        if (codeParsed.type === "assign") return evaluateAssign();
        if (codeParsed.type === "calculation") return evaluateCalcul();
        if (codeParsed.type === "function") return evaluateFunction();
        if (codeParsed.type === "if") return evaluateIf();

        if ("programme") return evaluateProgram();
        if ("appel") return evaluateCall();

        messageModule.error("Passe Voltaire avant de coder en Francais", codeParsed.type);
    }

    /**
     * Evaluate type
     * 
     * @return {any}
     */
    function evaluateType() {
        return codeParsed.value;
    }

    /**
     * Evaluate variable
     * 
     * @return {any}
     */
    function evaluateVariable() {
        return environementVariables.get(codeParsed.value);
    }

    /**
     * Evaluate program
     * 
     * @return {any}
     */
    function evaluateProgram() {
        var value = true;
        value = codeParsed.program.forEach(function(codeParsed) {
            value = CodeEvaluator(codeParsed, environementVariables);
        });
        return value;
    }

    /**
     * Evaluate if
     * 
     * @return {any}
     */
    function evaluateIf() {
        if (CodeEvaluator(codeParsed.cond, environementVariables) !== false) return CodeEvaluator(codeParsed.ifConetent, environementVariables);
        return codeParsed.elseContent ? CodeEvaluator(codeParsed.elseContent, environementVariables) : false;
    }

    /**
     * Evaluate function call
     * 
     * @return {any}
     */
    function evaluateCall() {
        return CodeEvaluator(codeParsed.function, environementVariables).apply(null, codeParsed.args.map(function(arg) {
            return CodeEvaluator(arg, environementVariables);
        }))
    }

    /**
     * Evaluate function
     * 
     * @return {any}
     */
    function evaluateFunction() {
        function kawaiFunction() {
            var names = codeParsed.vars;
            var scope = environementVariables.extend();
            for (var i = 0; i < names.length; ++i) scope.def(names[i], i < arguments.length ? arguments[i] : false);
            return evaluate(codeParsed.body, scope);
        }
        return kawaiFunction;
    }

    /**
     * Evaluate calcul
     * 
     * @return {any}
     */
    function evaluateCalcul() {
        return calculatorModule(CodeEvaluator(codeParsed.leftSide, environementVariables), codeParsed.operator, CodeEvaluator(codeParsed.rightSide, environementVariables));
    }

    /**
     * Evaluate assign
     * 
     * @return {any}
     */
    function evaluateAssign() {
        if (codeParsed.leftSide.type !== "variable") messageModule.error("Cette valeur ne peut etre attribuer a cette variables", JSON.stringify(codeParsed.leftSide));
        return environementVariables.set(codeParsed.leftSide.value, CodeEvaluator(codeParsed.rightSide, environementVariables));
    }
}