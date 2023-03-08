export type Nullable<T> = T | null;

export type Predicate<T> = (value: T) => number;

export class Node<T> {
  protected _left: Nullable<Node<T>>;
  protected _right: Nullable<Node<T>>;

  public readonly Value: T;

  constructor(value: T) {
    this.Value = value;
    this._left = null;
    this._right = null;
  }

  protected get Left() {
    return this._left;
  }

  protected get Right() {
    return this._right;
  }

  protected set Left(node: Nullable<Node<T>>) {
    this._left = node;
  }

  protected set Right(node: Nullable<Node<T>>) {
    this._right = node;
  }
}
