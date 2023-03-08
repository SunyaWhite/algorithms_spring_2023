import { Nullable } from "./Node";

type CompareFunction<T> = (value1: T, value2: T) => number;

class BTreeNode<T> {
  private readonly _capacityParameter: number;
  private readonly _compareFunction: CompareFunction<T>;

  private _children: Array<BTreeNode<T>>;
  private _values: Array<T>;

  constructor(capacity: number, compareFunction: CompareFunction<T>) {
    this._capacityParameter = capacity;
    this._compareFunction = compareFunction;

    this._children = new Array<BTreeNode<T>>();
    this._values = new Array<T>();
  }

  private get CapacityParameter() {
    return this._capacityParameter;
  }

  public get Children() {
    return this._children;
  }

  public get Values() {
    return this._values;
  }

  private get Count() {
    return this.Values.length;
  }

  public get IsFull() {
    return this.CapacityParameter * 2 - 1 === this.Count;
  }

  private get IsLeaf() {
    return this.Children.length === 0;
  }

  //#region compare functions
  private getComparison(nodeValue: T, value: T): number {
    return this._compareFunction(nodeValue, value);
  }

  private isEqual(nodeValue: T, value: T): boolean {
    const compareResult = this.getComparison(nodeValue, value);
    return compareResult === 0;
  }

  private isGreater(nodeValue: T, value: T): boolean {
    const compareResult = this.getComparison(nodeValue, value);
    return compareResult > 0;
  }

  //#endregion

  displayValue() {
    let index = 0;

    for (; index < this.Count; index++) {
      this.Children[index] && this.Children[index].displayValue();
      console.log(this.Values[index]);
    }

    this.Children[index] && this.Children[index].displayValue();
  }

  searchValue(valueToSearch: T): Nullable<T> {
    let index = 0;

    for (; index < this.Count; index++) {
      const nodeValue = this.Values[index];
      if (this.isEqual(nodeValue, valueToSearch)) {
        return nodeValue;
      }

      if (this.isGreater(nodeValue, valueToSearch)) {
        return this.Children[index].searchValue(valueToSearch);
      }
    }

    return this.IsLeaf ? null : this.searchValue(valueToSearch);
  }

  insertValue(valueToInsert: T) {
    if (this.IsLeaf) {
      this.insertIntoNodeValues(valueToInsert);
    } else {
      this.insertIntoChild(valueToInsert);
    }
  }

  private insertIntoNodeValues(valueToInsert: T) {
    if (this.Count == 0) {
      this.Values.push(valueToInsert);
      return;
    }

    let index = this.Count - 1;
    this.Values.push(valueToInsert);

    for (
      ;
      index >= 0 && this.isGreater(this.Values[index], valueToInsert);
      index--
    ) {
      this.Values[index + 1] = this.Values[index];
    }

    this.Values[index + 1] = valueToInsert;
  }

  private insertIntoChild(valueToInsert: T) {
    // finding index for child leaf to inseet value
    let index = this.Count - 1;
    for (
      ;
      index >= 0 && this.isGreater(this.Values[index], valueToInsert);
      index--
    ) {}

    index += 1;
    let childNode = this.Children[index];

    if (childNode.IsFull) {
      this.splitChild(index, childNode);

      // spliting cause current node values array change.
      // Should find new index of child to insert into
      if (this.Values[index] < valueToInsert) {
        childNode = this.Children[index + 1];
      }
    }

    childNode.insertValue(valueToInsert);
  }

  public splitChild(childIndex: number, childNode: BTreeNode<T>) {
    // storing rightmost elements
    const newNode = new BTreeNode(
      this.CapacityParameter,
      this._compareFunction
    );

    this.copyRightmostValuesToNode(childNode, newNode);
    const newKey = childNode.Values[this.CapacityParameter - 1];

    // update current node values and children
    this.Children.push(newNode);
    for (let index = this.Count - 1; index >= childIndex + 1; index--) {
      this.Children[index + 1] = this.Children[index];
    }
    this.Children[childIndex + 1] = newNode;

    // this.Values.push(newKey);
    for (let index = this.Count - 1; index >= childIndex; index--) {
      this.Values[index + 1] = this.Values[index];
    }
    this.Values[childIndex] = newKey;
    // removing new key
    childNode.Values.pop();
  }

  private copyRightmostValuesToNode(
    sourceNode: BTreeNode<T>,
    destinationNode: BTreeNode<T>
  ) {
    // copying values
    for (let index = 0; index < sourceNode.CapacityParameter; index++) {
      sourceNode.Values[sourceNode.CapacityParameter + index] &&
        destinationNode.Values.push(
          sourceNode.Values[sourceNode.CapacityParameter + index]
        );
    }

    sourceNode.Values.splice(
      sourceNode.CapacityParameter,
      sourceNode.CapacityParameter
    );

    // copying children
    if (!sourceNode.IsLeaf) {
      for (let index = 0; index < sourceNode.CapacityParameter; index++) {
        sourceNode.Children[sourceNode.CapacityParameter + index] &&
          destinationNode.Children.push(
            sourceNode.Children[sourceNode.CapacityParameter + index]
          );
      }
      sourceNode.Children.splice(
        sourceNode.CapacityParameter,
        sourceNode.CapacityParameter
      );
    }
  }
}

export class BTree<T> {
  private root: Nullable<BTreeNode<T>>;
  private readonly _capacity: number;
  private readonly _compparisonFunction: CompareFunction<T>;

  constructor(capacity: number, comparisonFucntion: CompareFunction<T>) {
    this.root = null;
    this._capacity = capacity;
    this._compparisonFunction = comparisonFucntion;
  }

  display() {
    this.root && this.root.displayValue();
    console.log("//////////////////");
  }

  search(valueToSearch: T): Nullable<T> {
    return this.root && this.root.searchValue(valueToSearch);
  }

  insert(valueToInsert: T) {
    if (!this.root) {
      this.root = new BTreeNode<T>(this._capacity, this._compparisonFunction);
      this.root.insertValue(valueToInsert);
      return;
    }

    if (this.root.IsFull) {
      const newNode = new BTreeNode(this._capacity, this._compparisonFunction);

      newNode.Children.push(this.root);
      newNode.splitChild(0, this.root);

      const index = newNode.Values[0] < valueToInsert ? 1 : 0;
      newNode.Children[index].insertValue(valueToInsert);

      this.root = newNode;
    } else {
      this.root.insertValue(valueToInsert);
    }
  }
}
