class GraphNode<T> {
  private readonly _value: T;
  private readonly _children: Array<GraphNode<T>>;

  constructor(value: T, children: Array<GraphNode<T>> = []) {
    this._value = value;
    this._children = children;
  }

  public get Value() {
    return this._value;
  }

  public get Children() {
    return this._children;
  }
}

type CostNodePair<T> = {
  transitionCost: number;
  destination: GraphNode<T>;
};

type ValueComparator<T> = (value1: T, value2: T) => number;

type GetTransitionCost<T> = (
  node1: GraphNode<T>,
  node2: GraphNode<T>
) => number;

function beamSearch<T>(
  root: GraphNode<T>,
  beamWidth: number,
  valueToFind: T,
  valueComparator: ValueComparator<T>,
  costFunction: GetTransitionCost<T>
) {
  let nodes: Array<GraphNode<T>> = [root];
  let nextLevelNodes: Array<CostNodePair<T>> = [];
  let found = false;

  const pairComparator = (pair1: CostNodePair<T>, pair2: CostNodePair<T>) =>
    pair1.transitionCost - pair2.transitionCost;

  const reachDestinationPredicate = ({ destination }: CostNodePair<T>) =>
    valueComparator(destination.Value, valueToFind) === 0;

  const getNextLevelNodes = () => {
    nextLevelNodes.sort(pairComparator);
    const nodestoReturn = nextLevelNodes
      .splice(0, beamWidth)
      .map((pair) => pair.destination);
    nextLevelNodes = [];
    return nodestoReturn;
  };

  const calculateChildTransitionCost = (node: GraphNode<T>) => {
    node.Children.forEach((child) =>
      nextLevelNodes.push({
        destination: child,
        transitionCost: costFunction(node, child),
      } as CostNodePair<T>)
    );
  };

  const checkReachingDestination = () =>
    nextLevelNodes.some(reachDestinationPredicate);

  while (!found && nodes.length !== 0) {
    nodes.forEach(calculateChildTransitionCost);

    found = checkReachingDestination();
    if (found) {
      continue;
    }

    nodes = getNextLevelNodes();
  }

  return found;
}
