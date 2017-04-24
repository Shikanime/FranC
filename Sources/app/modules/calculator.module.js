const messageModule = require("../modules/message.module")

/**
 * Calculate binary calcul token
 * 
 * @param {number} leftSide 
 * @param {string} operator
 * @param {number} rightSide 
 */
module.exports = function CodeCalculator(leftSide, operator, rightSide) {

    return binaryCalcul()

    function binaryCalcul() {
        if (operator === "+") return checkNumberType(leftSide) + checkNumberType(rightSide)
        if (operator === "-") return checkNumberType(leftSide) - checkNumberType(rightSide)
        if (operator === "*") return checkNumberType(leftSide) * checkNumberType(rightSide)
        if (operator === "/") return checkNumberType(leftSide) / checkNumberDivision(rightSide)
        if (operator === "%") return checkNumberType(leftSide) % checkNumberDivision(rightSide)
        if (operator === "&&") return leftSide !== false && rightSide
        if (operator === "||") return leftSide !== false ? leftSide : rightSide
        if (operator === "<") return checkNumberType(leftSide) < checkNumberType(rightSide)
        if (operator === ">") return checkNumberType(leftSide) > checkNumberType(rightSide)
        if (operator === "<=") return checkNumberType(leftSide) <= checkNumberType(rightSide)
        if (operator === ">=") return checkNumberType(leftSide) >= checkNumberType(rightSide)
        if (operator === "==") return leftSide === rightSide
        if (operator === "!=") return leftSide !== rightSide

        messageModule.error("Impossible de calculer avec cet operateur", operator)
    }

    /**
     * Check if its a number
     * 
     * @param {number} number 
     */
    function checkNumberType(number) {
        if (typeof number != "number") messageModule.error("Ce n'est pas un nombre valide", number)
        return number
    }

    /**
     * Check if its a valide division number
     * 
     * @param {number} number 
     */
    function checkNumberDivision(number) {
        if (checkNumberType(number) == 0) messageModule.error("Division par", number)
        return number
    }
}