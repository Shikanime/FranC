const messageModule = require("../modules/message.module");

/**
 * 
 * @param {object} token 
 * @param {object} environementVariables 
 * @return {any}
 */
module.exports = function CodeEvaluator(token, environementVariables) {

    return evaluateCode();

    function evaluateCode() {
        if (token.type === "nombre" ||
            token.type === "chaine" ||
            token.type === "booleen")
            return evaluateType();
        if (token.type === "variables") return evaluateVariable();
        if (token.type === "attribution") return evaluateAssign();
        if (token.type === "calcul") return evaluateCalcul();
        if (token.type === "fonction") return evaluateFunction();
        if (token.type === "si") return evaluateIf();

        if ("programme") return evaluateProgram();
        if ("appel") return evaluateCall();

        unexpectedMessage();
    }

    /**
     * Evaluate type
     * 
     * @return {any}
     */
    function evaluateType() {
        return token.value;
    }

    /**
     * Evaluate variable
     * 
     * @return {any}
     */
    function evaluateVariable() {
        return environementVariables.get(token.value);
    }

    /**
     * Evaluate program
     * 
     * @return {any}
     */
    function evaluateProgram() {
        var value = true;
        value = token.program.forEach(token => {
            value = CodeEvaluator(token, environementVariables);
        });
        return value;
    }

    /**
     * Evaluate if
     * 
     * @return {any}
     */
    function evaluateIf() {
        if (EvaluatorModule(token.cond, environementVariables) !== false) return EvaluatorModule(token.ifConetent, environementVariables);
        return token.elseContent ? EvaluatorModule(token.elseContent, environementVariables) : false;
    }

    /**
     * Evaluate function call
     * 
     * @return {any}
     */
    function evaluateCall() {
        return EvaluatorModule(token.function, environementVariables).apply(null, token.args.map(function(arg) {
            return EvaluatorModule(arg, environementVariables);
        }))
    }

    /**
     * Evaluate function
     * 
     * @return {any}
     */
    function evaluateFunction() {
        function kawaiFunction() {
            var names = token.vars;
            var scope = environementVariables.extend();
            for (var i = 0; i < names.length; ++i) scope.def(names[i], i < arguments.length ? arguments[i] : false);
            return evaluate(token.body, scope);
        }
        return kawaiFunction;
    }

    /**
     * Evaluate calcul
     * 
     * @return {any}
     */
    function evaluateCalcul() {
        return calculate(EvaluatorModule(token.leftSide, environementVariables), token.operator, EvaluatorModule(token.rightSide, environementVariables));
    }

    /**
     * Evaluate assign
     * 
     * @return {any}
     */
    function evaluateAssign() {
        if (token.leftSide.type !== "variables") messageModule.error("Cette valeur ne peut etre attribuer a cette variables", JSON.stringify(token.leftSide));
        return environementVariables.set(token.leftSide.value, EvaluatorModule(token.rightSide, environementVariables));
    }

    /**
     * No
     */
    function unexpectedMessage() {
        messageModule.error("Passe Voltaire avant de coder en Francais", token.type);
    }
}