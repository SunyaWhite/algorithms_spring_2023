type Predicate<T> = (value: T) => boolean;
type Nullable<T> = T | null;

class NodeElem<T> {
  private readonly _value: T;
  private _counter: number;
  private _previous: Nullable<NodeElem<T>>;
  private _next: Nullable<NodeElem<T>>;

  constructor(value: T) {
    this._value = value;
    this._next = null;
    this._previous = null;
    this._counter = 0;
  }

  findValue(predicate: Predicate<T>): Nullable<T> {
    if (predicate(this._value)) {
      const result = this.accessValue();
      this.normalizeList();

      return result;
    }

    return this._next ? this._next?.findValue(predicate) : null;
  }

  addNext(node: NodeElem<T>) {
    this.Next = node;
  }

  getHead() {
    return this.Previous || this;
  }

  display() {
    console.log(`${this.Value} - ${this.Count}`);

    this.Next && this.Next.display();
  }

  private accessValue(): T {
    this._counter += 1;
    return this.Value;
  }

  private get Count() {
    return this._counter;
  }

  private get Value() {
    return this._value;
  }

  private get Next() {
    return this._next;
  }

  private set Next(node: Nullable<NodeElem<T>>) {
    this._next = node;

    if (node) {
      node._previous = this;
    }
  }

  private get Previous() {
    return this._previous;
  }

  private set Previous(node: Nullable<NodeElem<T>>) {
    this._previous = node;

    if (node) {
      node._next = this;
    }
  }

  private normalizeList() {
    // no need for normalizing
    if (!this.Previous) {
      return;
    }

    if (this.Previous.Count > this.Count) {
      return;
    }

    const newPreviousNode = this.Previous?.Previous ?? null;
    const newNextNode = this.Previous;
    const oldNextNode = this.Next;

    if (newPreviousNode) {
      this.Previous = newPreviousNode;
      this.Next = newNextNode;
      newNextNode.Next = oldNextNode;
      this.normalizeList();
    } else {
      // reaching the head element
      this.Previous = null;
      this.Next = newNextNode;
      if (oldNextNode) {
        newNextNode.Next = oldNextNode;
      }
    }
  }
}

export class SelfOrganazingList<T> {
  private head: Nullable<NodeElem<T>>;
  private tail: Nullable<NodeElem<T>>;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  findValue(predicate: Predicate<T>): Nullable<T> {
    if (!this.head) {
      return null;
    }
    const result = this.head.findValue(predicate);
    this.head = this.head?.getHead();

    return result;
  }

  addValue(value: T) {
    const newNode = new NodeElem(value);
    this.tail?.addNext(newNode);

    if (!this.head) {
      this.head = newNode;
    }

    this.tail = newNode;
  }

  display() {
    this.head?.display();
    console.log("//////////");
  }
}
