import { Node, Nullable, Predicate } from "./Node";

class BSTNode<T> extends Node<T> {
  protected get Left(): BSTNode<T> {
    return this._left as BSTNode<T>;
  }

  protected get Right(): BSTNode<T> {
    return this._right as BSTNode<T>;
  }

  display() {
    this.Left && this.Left.display();
    console.log(this.Value);
    this.Right && this.Right.display();
  }

  deleteValue(predicate: Predicate<T>): Nullable<BSTNode<T>> {
    const predicateResult = predicate(this.Value);

    if (predicateResult > 0 && this.Left) {
      super.Left = this.Left.deleteValue(predicate);
    }

    if (predicateResult < 0 && this.Right) {
      super.Right = this.Right.deleteValue(predicate);
    }

    if (predicateResult === 0) {
      return this.deleteNode();
    }

    return this;
  }

  searchValue(predicate: Predicate<T>): Nullable<T> {
    const predicateResult = predicate(this.Value);

    if (predicateResult === 0) {
      return this.Value;
    }

    if (predicateResult > 0 && this.Left) {
      return this.Left.searchValue(predicate);
    }

    if (predicateResult < 0 && this.Right) {
      return this.Right.searchValue(predicate);
    }

    return null;
  }

  addvalue(valueToAdd: T) {
    // Assume holding only unique elements
    if (this.Value == valueToAdd) {
      return;
    }

    if (this.Value > valueToAdd && this.Left) {
      this.Left.addvalue(valueToAdd);
    }

    if (this.Value > valueToAdd && !this.Left) {
      const newNode = new BSTNode(valueToAdd);
      super.Left = newNode;
    }

    if (this.Value < valueToAdd && this.Right) {
      this.Right.addvalue(valueToAdd);
    }

    if (this.Value < valueToAdd && !this.Right) {
      const newNode = new BSTNode(valueToAdd);
      super.Right = newNode;
    }
  }

  private deleteNode(): Nullable<BSTNode<T>> {
    if (!this.Left && this.Right) {
      return null;
    }

    if (!this.Left) {
      return this.Right;
    }

    if (!this.Right) {
      return this.Left;
    }

    return this.Right.getNewSuccessor();
  }

  private getNewSuccessor(): BSTNode<T> {
    if (!this.Left) {
      return this;
    }

    const valueToReturn = this.getNewSuccessor();
    // comparing by reference
    if (this.Left == valueToReturn) {
      super.Left = null;
    }

    return valueToReturn;
  }
}

export class BST<T> {
  private root: Nullable<BSTNode<T>>;

  constructor() {
    this.root = null;
  }

  display() {
    this.root && this.root.display();
    console.log("/////////");
  }

  insert(value: T) {
    if (!this.root) {
      this.root = new BSTNode(value);
      return;
    }

    this.root.addvalue(value);
  }

  delete(predicate: Predicate<T>) {
    if (!this.root) {
      return;
    }

    this.root = this.root.deleteValue(predicate);
  }

  search(predicate: Predicate<T>) {
    if (!this.root) {
      return;
    }

    return this.root.searchValue(predicate);
  }
}
