type Comparator<T> = (value1: T, value2: T) => number;
type HashFunction<V> = (key: V) => number;

type Pair<T, V> = {
  key: T;
  value: V;
};

class Entry<T, V> {
  public key: T;
  public value: V;
  private next: Entry<T, V> | null;

  constructor(pair: Pair<T, V>) {
    const { key, value } = pair;
    this.key = key;
    this.value = value;
    this.next = null;
  }

  private getPair(): Pair<T, V> {
    return {
      key: this.key,
      value: this.value,
    };
  }

  public search(keyToFind: T, comparator: Comparator<T>): Pair<T, V> | null {
    if (comparator(this.key, keyToFind) === 0) {
      return this.getPair();
    }

    return this.next && this.next.search(keyToFind, comparator);
  }

  /**
   * Adding new value to LinkedList
   * @param pair KeyValue pair to insert
   * @param comparator comporator function to compare keys
   * @returns inerted value - true, updated value - false
   */
  public insert(pair: Pair<T, V>, comparator: Comparator<T>): boolean {
    // updating value by key
    if (comparator(this.key, pair.key) === 0) {
      this.value = pair.value;
      return false;
    }

    if (!this.next) {
      const newEntry = new Entry<T, V>(pair);
      this.next = newEntry;
      return true;
    }

    return this.next.insert(pair, comparator);
  }

  public getLinkedListValues(): Array<Pair<T, V>> {
    if (!this.next) {
      return [this.getPair()];
    }

    const arrayToReturn = this.next.getLinkedListValues();
    arrayToReturn.push(this.getPair());

    return arrayToReturn;
  }
}

export class CustomHashMap<T, V> {
  private _capacity: number;
  private _count: number;
  private readonly _loadFactor: number;
  private readonly _comparator: Comparator<T>;
  private readonly _hashFunction: HashFunction<T>;
  private _buckets: Array<Entry<T, V> | null>;

  constructor(
    comparator: Comparator<T>,
    hashFunction: HashFunction<T>,
    loadFactor = 0.75
  ) {
    this._comparator = comparator;
    this._hashFunction = hashFunction;
    this._loadFactor = loadFactor;

    this._count = 0;
    this._capacity = 4;

    this._buckets = new Array<Entry<T, V>>(2);
    this._buckets.fill(null);
  }

  public get Count() {
    return this._count;
  }

  public set Count(value) {
    this._count = value;
  }

  public get Capacity() {
    return this._capacity;
  }

  public set Capacity(value: number) {
    this._capacity = value;
  }

  private get LoadFactor() {
    return this._loadFactor;
  }

  private get Comporator() {
    return this._comparator;
  }

  private get HashFunction() {
    return this._hashFunction;
  }

  private get IsFull() {
    return this.Count / this.Capacity >= this.LoadFactor;
  }

  private get Buckets() {
    return this._buckets;
  }

  private set Buckets(value) {
    this._buckets = value;
  }

  private get BucketCount() {
    return this._buckets.length;
  }

  private getBucketIndex(key: T): number {
    return this.HashFunction(key) % this.BucketCount;
  }

  private incrementCount() {
    this.Count += 1;
  }

  private rebuildHashMap() {
    const pairs = this.Buckets.reduce(
      (pairs: Array<Pair<T, V>>, entry: Entry<T, V> | null) => {
        if (!entry) {
          return pairs;
        }

        const pairValues = entry.getLinkedListValues();
        pairs.push(...pairValues);
        return pairs;
      },
      [] as Array<Pair<T, V>>
    );

    this.Capacity = this.Capacity * 2;
    this.Buckets = new Array<Entry<T, V>>(this.Capacity);
    this.Buckets.fill(null);
    // to prevent overcount
    this.Count = 0;

    pairs.forEach((pair) => this.insertIntoBucket(pair));
  }

  private insertIntoBucket(pair: Pair<T, V>) {
    const { key } = pair;
    const bucketIndex = this.getBucketIndex(key);

    let shouldIncrement = true;

    if (!this.Buckets[bucketIndex]) {
      this.Buckets[bucketIndex] = new Entry<T, V>(pair);
    } else {
      shouldIncrement = this.Buckets[bucketIndex]!.insert(
        pair,
        this.Comporator
      );
    }

    shouldIncrement && this.incrementCount();
  }

  public insertPair(pair: Pair<T, V>) {
    if (this.IsFull) {
      this.rebuildHashMap();
    }

    this.insertIntoBucket(pair);
  }

  public insertKeyValue(key: T, value: V) {
    this.insertPair({ key, value } as Pair<T, V>);
  }

  public getPairByKey(key: T): Pair<T, V> | null {
    if (!this.Count) {
      return null;
    }

    const bucketIndex = this.getBucketIndex(key);
    return (
      this.Buckets[bucketIndex] &&
      this.Buckets[bucketIndex]!.search(key, this._comparator)
    );
  }

  public getValueByKey(key: T): V | null {
    const pair = this.getPairByKey(key);
    return pair && pair.value;
  }

  public contains(key: T): boolean {
    return !!this.getPairByKey(key);
  }
}
