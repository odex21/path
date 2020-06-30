import { JumpPointFinderBaseOptions } from './JumpPointFinderBase'
import { DiagonalMovement } from '../core/DiagonalMovement'
import { JPFAlwaysMoveDiagonally } from './JPFAlwaysMoveDiagonally'
import { JPFNeverMoveDiagonally } from './JPFNeverMoveDiagonally'
import { JPFMoveDiagonallyIfNoObstacles } from './JPFMoveDiagonallyIfNoObstacles'
import { JPFMoveDiagonallyIfAtMostOneObstacle } from './JPFMoveDiagonallyIfAtMostOneObstacle'


/**
 * @author aniero / https://github.com/aniero
 */
// var DiagonalMovement = require('../core/DiagonalMovement')
// var JPFNeverMoveDiagonally = require('./JPFNeverMoveDiagonally')
// var JPFAlwaysMoveDiagonally = require('./JPFAlwaysMoveDiagonally')
// var JPFMoveDiagonallyIfNoObstacles = require('./JPFMoveDiagonallyIfNoObstacles')
// var JPFMoveDiagonallyIfAtMostOneObstacle = require('./JPFMoveDiagonallyIfAtMostOneObstacle')

export interface JumpPointFinderOptions extends JumpPointFinderBaseOptions {
    diagonalMovement: DiagonalMovement
}

/**
 * Path finder using the Jump Point Search algorithm
 * @param {Object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {DiagonalMovement} opt.diagonalMovement Condition under which diagonal
 *      movement will be allowed.
 */
export function JumpPointFinder (opt: JumpPointFinderOptions) {
    // opt = opt || {};
    if (opt.diagonalMovement === DiagonalMovement.Never) {
        return new JPFNeverMoveDiagonally(opt)
    }
    else if (opt.diagonalMovement === DiagonalMovement.Always) {
        return new JPFAlwaysMoveDiagonally(opt)
    }
    else if (opt.diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        return new JPFMoveDiagonallyIfNoObstacles(opt)
    } else {
        return new JPFMoveDiagonallyIfAtMostOneObstacle(opt)
    }
}
