import { AVLTree } from "./Structures/AVL";
import { BST } from "./Structures/BST";
import { convertToBalancedBST } from "./Structures/ArrayToBalancedBST";
import { BTree } from "./Structures/B-Tree";
import { CustomHashMap } from "./HashTable/ChainedHashTable";
import { SelfOrganazingList } from "./SelfOrganizingFile/SelfOrganizingFile";

const createPredicate = (valueToSearch: number) => (elem: number) =>
  elem - valueToSearch;

function DemoBST() {
  const bst = new BST<number>();
  bst.insert(50);
  bst.insert(30);
  bst.insert(20);
  bst.insert(40);
  bst.insert(70);
  bst.insert(60);
  bst.insert(80);

  bst.display();

  bst.delete(createPredicate(20));
  bst.display();
}

function DemoAVL() {
  const comparatorFunction = (value1: number) => (value2: number) =>
    value1 - value2;

  const avl = new AVLTree<number>(comparatorFunction);
  avl.insert(5);
  avl.insert(30);
  avl.insert(40);
  avl.insert(50);
  avl.insert(20);
  avl.insert(10);
  avl.insert(60);

  avl.display();
}

function DemoBalancedBST() {
  const array = [50, 60, 10, 5, 40, 20, 30];
  const comparator = (value1: number, value2: number) => value1 - value2;

  const bst = convertToBalancedBST(array, comparator);
  bst.display();
}

function DemoBTree() {
  const comparator = (value1: number, value2: number) => value1 - value2;
  const capacity = 3;

  const bt = new BTree<number>(capacity, comparator);
  bt.insert(50);
  bt.insert(30);
  bt.insert(20);
  bt.insert(40);
  bt.insert(70);
  bt.insert(60);
  bt.insert(80);

  bt.display();

  bt.insert(90);
  bt.insert(10);

  bt.display();
}

function DemoHashMap() {
  const comporator = (value1: number, value2: number) => value1 - value2;
  // for test purposes it will be enough
  const hashFunction = (key: number) => key;
  const hashMap = new CustomHashMap<number, any>(comporator, hashFunction);

  hashMap.insertKeyValue(1, "hello world");
  hashMap.insertKeyValue(2, { text: "hello world" });
  hashMap.insertPair({ key: 3, value: 2 });

  console.log(hashMap.getValueByKey(1));
  console.log(hashMap.getValueByKey(4));
  console.log(hashMap.getPairByKey(2));

  hashMap.insertKeyValue(1, "hello");
  console.log(hashMap.getValueByKey(1));

  hashMap.insertKeyValue(4, { a: 1, b: 2 });
  hashMap.insertKeyValue(5, DemoBST);

  console.log(hashMap.getValueByKey(4));
  console.log(hashMap.getPairByKey(5));
  console.log(hashMap.contains(6));

  hashMap.insertKeyValue(6, { a: 2, b: 3 });
  hashMap.insertKeyValue(7, { a: 2, b: 3 });
}

function DemoSOF() {
  const list = new SelfOrganazingList<number>();

  list.addValue(1);
  list.addValue(2);
  list.addValue(3);
  list.addValue(4);
  list.addValue(5);

  list.display();

  list.findValue((elem) => elem === 4);
  list.findValue((elem) => elem === 4);
  list.display();

  list.findValue((elem) => elem === 5);
  list.findValue((elem) => elem === 5);
  list.findValue((elem) => elem === 5);
  list.display();

  list.findValue((elem) => elem === 2);
  list.display();
}

DemoSOF();
// DemoBST();
// DemoAVL();
// DemoBalancedBST();
// DemoBTree();
// DemoHashMap();
