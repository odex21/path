export type HeuristicFunc = (dx: number, dy: number) => number

/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */
export const Heuristic = {

    /**
     * Manhattan distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} dx + dy
     */
    manhattan: function (dx: number, dy: number) {
        return dx + dy
    },

    /**
     * Euclidean distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} sqrt(dx * dx + dy * dy)
     */
    euclidean: function (dx: number, dy: number) {
        return Math.sqrt(dx * dx + dy * dy)
    },

    /**
     * Octile distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} sqrt(dx * dx + dy * dy) for grids
     */
    octile: function (dx: number, dy: number) {
        var F = Math.SQRT2 - 1
        return (dx < dy) ? F * dx + dy : F * dy + dx
    },

    /**
     * Chebyshev distance.
     * @param {number} dx - Difference in x.
     * @param {number} dy - Difference in y.
     * @return {number} max(dx, dy)
     */
    chebyshev: function (dx: number, dy: number) {
        return Math.max(dx, dy)
    }

}
