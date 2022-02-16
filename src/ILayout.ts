import {
	EventType, InputNode, Group, Link, Node, LinkNumericPropertyAccessor, Event
} from './layout';

export interface ILayout {
	on(e: EventType | string, listener: (event?: Event) => void): ILayout;

	/**
	 * the list of nodes.
	 * If nodes has not been set, but links has, then we instantiate a nodes list here, of the correct size,
	 * before returning it.
	 * @property nodes {Array}
	 * @default empty list
	 */
	nodes(): Array<Node>;
	nodes(v: Array<InputNode>): ILayout;
	nodes(v?: any): any;

	/**
	 * a list of hierarchical groups defined over nodes
	 * @property groups {Array}
	 * @default empty list
	 */
	groups(): Array<Group>;
	groups(x: Array<Group>): ILayout;
	groups(x?: Array<Group>): any;

	powerGraphGroups(f: Function): ILayout;

	/**
	 * if true, the layout will not permit overlaps of the node bounding boxes (defined by the width and height
	 * properties on nodes).
	 * @property avoidOverlaps
	 * @type bool
	 * @default false
	 */
	avoidOverlaps(): boolean;
	avoidOverlaps(v: boolean): ILayout;
	avoidOverlaps(v?: boolean): any;

	/**
	 * if true, the final step of the start method will be to nicely pack connected components of the graph.
	 * works best if start() is called with a reasonable number of iterations specified and
	 * each node has a bounding box (defined by the width and height properties on nodes).
	 * @property handleDisconnected
	 * @type bool
	 * @default true
	 */
	handleDisconnected(): boolean;
	handleDisconnected(v: boolean): ILayout;
	handleDisconnected(v?: boolean): any;

	/**
	 * causes constraints to be generated such that directed graphs are laid out either from left-to-right or
	 * top-to-bottom. A separation constraint is generated in the selected axis for each edge that is not involved in
	 * a cycle (part of a strongly connected component)/
	 * @param axis {string} 'x' for left-to-right, 'y' for top-to-bottom
	 * @param minSeparation {number|link=>number} either a number specifying a minimum spacing required across all
	 * links or a function to return the minimum spacing for each link
	 */
	flowLayout(axis: string, minSeparation: number | ((t: any) => number)): ILayout;

	/**
	 * links defined as source, target pairs over nodes
	 * @property links {array}
	 * @default empty list
	 */
	links(): Array<Link<Node|number>>;
	links(x: Array<Link<Node|number>>): ILayout;
	links(x?: Array<Link<Node|number>>): any;

	/**
	 * list of constraints of various types
	 * @property constraints
	 * @type {array}
	 * @default empty list
	 */
	constraints(): Array<any>;
	constraints(c: Array<any>): ILayout;
	constraints(c?: Array<any>): any;

	/**
	 * Matrix of ideal distances between all pairs of nodes.
	 * If unspecified, the ideal distances for pairs of nodes will be based on the shortest path distance between them.
	 * @property distanceMatrix
	 * @type {Array of Array of Number}
	 * @default null
	 */
	distanceMatrix(): Array<Array<number>>;
	distanceMatrix(d: Array<Array<number>>): ILayout;
	distanceMatrix(d?: any): any;

	/**
	 * Size of the layout canvas dimensions [x,y]. Currently only used to determine the midpoint which is taken as the
	 * starting position for nodes with no preassigned x and y.
	 * @property size
	 * @type {Array of Number}
	 */
	size(): Array<number>;
	size(x: Array<number>): ILayout;
	size(x?: Array<number>): any;

	/**
	 * Default size (assume nodes are square so both width and height) to use in packing if node width/height are not
	 * specified.
	 * @property defaultNodeSize
	 * @type {Number}
	 */
	defaultNodeSize(): number;
	defaultNodeSize(x: number): ILayout;
	defaultNodeSize(x?: any): any;

	/**
	 * The strength of attraction between the group boundaries to each other.
	 * @property defaultNodeSize
	 * @type {Number}
	 */
	groupCompactness(): number;
	groupCompactness(x: number): ILayout;
	groupCompactness(x?: any): any;

	/**
	 * links have an ideal distance, The automatic layout will compute layout that tries to keep links (AKA edges) as
	 * close as possible to this length.
	 */
	linkDistance(): number;
	linkDistance(): LinkNumericPropertyAccessor;
	linkDistance(x: number): ILayout;
	linkDistance(x: LinkNumericPropertyAccessor): ILayout;
	linkDistance(x?: any): any;

	linkType(f: Function | number): ILayout;

	convergenceThreshold(): number;
	convergenceThreshold(x: number): ILayout;
	convergenceThreshold(x?: number): any;

	alpha(): number;
	alpha(x: number): ILayout;
	alpha(x?: number): any;

	getLinkLength(link: Link<Node | number>): number;

	getLinkType(link: Link<Node | number>): number;

	// linkAccessor: LinkLengthTypeAccessor;

	/**
	 * compute an ideal length for each link based on the graph structure around that link.
	 * you can use this (for example) to create extra space around hub-nodes in dense graphs.
	 * In particular this calculation is based on the "symmetric difference" in the neighbour sets of the source and
	 * target:
	 * i.e. if neighbours of source is a and neighbours of target are b then calculation is:
	 * sqrt(|a union b| - |a intersection b|)
	 * Actual computation based on inspection of link structure occurs in start(), so links themselves
	 * don't have to have been assigned before invoking this function.
	 * @param {number} [idealLength] the base length for an edge when its source and start have no other common
	 * neighbours (e.g. 40)
	 * @param {number} [w] a multiplier for the effect of the length adjustment (e.g. 0.7)
	 */
	symmetricDiffLinkLengths(idealLength: number, w: number): ILayout;

	/**
	 * compute an ideal length for each link based on the graph structure around that link.
	 * you can use this (for example) to create extra space around hub-nodes in dense graphs.
	 * In particular this calculation is based on the "symmetric difference" in the neighbour sets of the source and
	 * target:
	 * i.e. if neighbours of source is a and neighbours of target are b then calculation is:
	 * |a intersection b|/|a union b|
	 * Actual computation based on inspection of link structure occurs in start(), so links themselves
	 * don't have to have been assigned before invoking this function.
	 * @param {number} [idealLength] the base length for an edge when its source and start have no other common
	 * neighbours (e.g. 40)
	 * @param {number} [w] a multiplier for the effect of the length adjustment (e.g. 0.7)
	 */
	jaccardLinkLengths(idealLength: number, w: number): ILayout;

	/**
	 * start the layout process
	 * @method start
	 * @param {number} [initialUnconstrainedIterations=0] unconstrained initial layout iterations
	 * @param {number} [initialUserConstraintIterations=0] initial layout iterations with user-specified constraints
	 * @param {number} [initialAllConstraintsIterations=0] initial layout iterations with all constraints including
	 * non-overlap
	 * @param {number} [gridSnapIterations=0] iterations of "grid snap", which pulls nodes towards grid cell centers -
	 * grid of size node[0].width - only really makes sense if all nodes have the same width and height
	 * @param [keepRunning=true] keep iterating asynchronously via the tick method
	 * @param [centerGraph=true] Center graph on restart
	 */
	start(
		initialUnconstrainedIterations: number,
		initialUserConstraintIterations: number,
		initialAllConstraintsIterations: number,
		gridSnapIterations: number,
		keepRunning: boolean,
		centerGraph?: boolean,
	): ILayout;

	resume(): ILayout;

	stop(): ILayout;

	// find a visibility graph over the set of nodes.  assumes all nodes have a
	// bounds property (a rectangle) and that no pair of bounds overlaps.
	prepareEdgeRouting(nodeMargin: number): void;

	/**
	 * find a route avoiding node bounds for the given edge.
	 * assumes the visibility graph has been created (by prepareEdgeRouting method)
	 * and also assumes that nodes have an index property giving their position in the
	 * node array.  This index property is created by the start() method.
	 * @param [edge] The edge to generate a route for.
	 * @param {number} [ah] The size of the arrow head, a distance to shorten the end
	 *                      of the edge by.  Defaults to 5.
	 */
	routeEdge(edge: any, ah: number, draw: any): void;

// 	setLinkLength(link: Link<Node | number>, length: number): void;
//
// 	getSourceIndex(e: Link<Node | number>): number;
//
// 	getTargetIndex(e: Link<Node | number>): number;
//
// 	linkId(e: Link<Node | number>): string;
//
// 	dragStart(d: Node | Group): void;
//
// 	dragOrigin(d: Node | Group): { x: number, y: number };
//
// 	drag(d: Node | Group, position: { x: number, y: number }): void;
//
// 	dragEnd(d: Node | Group): void;
//
// 	mouseOver(d: Node | Group): void;
//
// 	mouseOut(d: Node | Group): void;
}
