import { Node, Nullable } from "./Node";

type ComparatorFunction<T> = (value: T) => (elem: T) => number;
type Comparator<T> = (value: T) => number;

class AVLNode<T> extends Node<T> {
  private readonly _createComparator: ComparatorFunction<T>;
  private readonly _comparator: Comparator<T>;

  private _height: number;

  constructor(value: T, createComparator: ComparatorFunction<T>) {
    super(value);

    this._createComparator = createComparator;
    this._comparator = createComparator(this.Value);
    this._height = 0;
  }

  //#region Properties
  protected get Left(): Nullable<AVLNode<T>> {
    return this._left as AVLNode<T>;
  }

  protected get Right(): Nullable<AVLNode<T>> {
    return this._right as AVLNode<T>;
  }

  protected set Left(node: Nullable<AVLNode<T>>) {
    this._left = node;
  }

  protected set Right(node: Nullable<AVLNode<T>>) {
    this._right = node;
  }

  private get Height() {
    return this._height;
  }

  private set Height(value: number) {
    this._height = value;
  }

  private get ComparatorFunction() {
    return this._createComparator;
  }

  private get Comparator() {
    return this._comparator;
  }
  //#endregion

  //#region Comparison utility functions
  private compare(node: AVLNode<T> | T) {
    return node instanceof AVLNode<T>
      ? this.Comparator(node.Value)
      : this.Comparator(node);
  }

  private isEqual(node: AVLNode<T> | T): boolean {
    const comparisonResult = this.compare(node);
    return comparisonResult === 0;
  }

  private isLess(node: AVLNode<T> | T): boolean {
    const comparisonResult = this.compare(node);
    return comparisonResult < 0;
  }

  private isGreater(node: AVLNode<T> | T): boolean {
    const comparisonResult = this.compare(node);
    return comparisonResult > 0;
  }

  private isGreaterOrEqual(node: AVLNode<T> | T): boolean {
    const comparisonResult = this.compare(node);
    return comparisonResult >= 0;
  }
  //#endregion

  //#region Compute height functions
  private computeHeight() {
    const leftHeight = this.Left?.Height ?? 0;
    const rightHeight = this.Right?.Height ?? 0;
    let height = Math.max(leftHeight, rightHeight);

    this.Height = height + 1;
  }

  private computeHeightDifference() {
    let leftHeight = 0;
    let rightHeight = 0;

    if (this.Left) {
      leftHeight = this.Left.Height + 1;
    }
    if (this.Right) {
      rightHeight = this.Right.Height + 1;
    }

    return leftHeight - rightHeight;
  }
  //#endregion

  display() {
    this.Left && this.Left.display();
    console.log(
      `root = ${this.Value} left = ${this.Left?.Value} right = ${this.Right?.Value}`
    );
    this.Right && this.Right.display();
  }

  /**
   * Search in AVL tree
   * @param value value to search
   * @returns found value or null in case of failure
   */
  searchValue(value: T): Nullable<T> {
    if (this.isEqual(value)) {
      return this.Value;
    }

    if (this.Left && this.isGreater(value)) {
      return this.Left.searchValue(value);
    }

    if (this.Right && this.isLess(value)) {
      return this.Right.searchValue(value);
    }

    return null;
  }

  addValue(value: T) {
    let newRoot: AVLNode<T> = this;

    if (this.isGreaterOrEqual(value)) {
      super.Left = this.addToSubtree(this.Left, value);

      if (this.computeHeightDifference() === 2) {
        if (this.Left!.isGreaterOrEqual(value)) {
          newRoot = this.rotateRight();
        } else {
          newRoot = this.rotateLeftRight();
        }
      }
    } else {
      super.Right = this.addToSubtree(this.Right, value);

      if (this.computeHeightDifference() === -2) {
        if (this.Right!.isLess(value)) {
          newRoot = this.rotateLeft();
        } else {
          newRoot = this.rotateRightLeft();
        }
      }
    }

    newRoot.computeHeight();
    return newRoot;
  }

  private addToSubtree(parent: Nullable<AVLNode<T>>, value: T): AVLNode<T> {
    if (!parent) {
      return new AVLNode(value, this.ComparatorFunction);
    }
    parent = parent.addValue(value);
    return parent;
  }

  //#region rotation functions
  private rotateRight(): AVLNode<T> {
    const newRoot = this.Left!;
    const grandSon = newRoot.Right;

    super.Left = grandSon;
    newRoot.Right = this;

    this.computeHeight();
    return newRoot!;
  }

  private rotateRightLeft(): AVLNode<T> {
    const child = this.Right!;
    const newRoot = child.Left!;
    const grand1 = newRoot.Left;
    const grand2 = newRoot.Right;

    child.Left = grand2;
    super.Right = grand1;

    newRoot.Left = this;
    newRoot.Right = child;

    child.computeHeight();
    this.computeHeight();

    return newRoot;
  }

  private rotateLeft(): AVLNode<T> {
    const newRoot = this.Right!;
    const grandSon = newRoot.Left;

    super.Right = grandSon;
    newRoot.Left = this;

    this.computeHeight();
    return newRoot!;
  }

  private rotateLeftRight(): AVLNode<T> {
    const child = this.Left!;
    const newRoot = child.Right!;
    const grand1 = newRoot.Left;
    const grand2 = newRoot.Right;

    child.Right = grand1;
    super.Left = grand2;

    newRoot.Left = child;
    newRoot.Right = this;

    child.computeHeight();
    this.computeHeight();

    return newRoot;
  }
  //#endregion
}

export class AVLTree<T> {
  private readonly _comparatorFunction: ComparatorFunction<T>;
  private _root: Nullable<AVLNode<T>>;

  constructor(comparatorFunction: ComparatorFunction<T>) {
    this._root = null;
    this._comparatorFunction = comparatorFunction;
  }

  insert(value: T) {
    if (!this._root) {
      this._root = new AVLNode(value, this._comparatorFunction);
      return;
    }

    this._root = this._root.addValue(value);
  }

  searchValue(value: T) {
    return this._root && this._root.searchValue(value);
  }

  display() {
    console.log(`Tree root - ${this._root?.Value}`);
    this._root && this._root.display();
    console.log("\\\\\\");
  }
}
