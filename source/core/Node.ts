
export class Node {
    /**
    * The x coordinate of the node on the grid.
    * @type number
    */
    x: number

    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    y: number

    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    walkable: boolean

    /**
     * node status
     */
    opened?: boolean
    tested?: boolean
    closed?: boolean

    /**
     * parent node
     */
    parent?: Node


    /**
     * distance to end point
     */
    h!: number
    /**
     * path cost 
     */
    g!: number
    /**
     * h + g
     */
    f!: number


    /**
     * A node in grid. 
     * This class holds some basic information about a node and custom 
     * attributes may be added, depending on the algorithms' needs.
     * @constructor
     * @param {number} x - The x coordinate of the node on the grid.
     * @param {number} y - The y coordinate of the node on the grid.
     * @param {boolean} [walkable] - Whether this node is walkable.
     */
    constructor (x: number, y: number, walkable?: boolean) {
        this.x = x
        this.y = y
        this.walkable = (walkable === undefined ? true : walkable)
    }
}

export interface Operation {
    x: number
    y: number
    attr: 'opened' | 'closed' | 'tested'
    value: boolean
}


export class TrackedNode extends Node {
    operations: Operation[]
    _opened: boolean = false
    _tested: boolean = false
    _closed: boolean = false

    constructor (x: number, y: number, walkable = true, operations: Operation[]) {
        super(x, y, walkable)
        this.operations = operations
    }

    static of (x: number, y: number, walkable: boolean, operations: Operation[]) {
        return new TrackedNode(x, y, walkable, operations)
    }

    get opened () {
        return this._opened
    }
    set opened (v) {
        this._opened = v
        this.operations.push({
            x: this.x,
            y: this.y,
            attr: 'opened',
            value: v
        })
    }
    get closed () {
        return this._closed
    }
    set closed (v) {
        this._closed = v
        this.operations.push({
            x: this.x,
            y: this.y,
            attr: 'closed',
            value: v
        })
    }
    get tested () {
        return this._tested
    }
    set tested (v) {
        this._tested = v
        this.operations.push({
            x: this.x,
            y: this.y,
            attr: 'tested',
            value: v
        })
    }
}
