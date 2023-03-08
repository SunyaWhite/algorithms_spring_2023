import { BST } from "./BST";

type CompareFunction<T> = (elem1: T, elem2: T) => number;

export function convertToBalancedBST<T>(
  elems: Array<T>,
  comparatorFunction: CompareFunction<T>
) {
  const sortedArray = elems.sort(comparatorFunction);
  const tree = new BST<T>();

  convertToBST(tree, sortedArray, 0, elems.length - 1);

  return tree;
}

function convertToBST<T>(
  tree: BST<T>,
  elems: Array<T>,
  start: number,
  end: number
) {
  if (start > end) {
    return;
  }

  const index = Math.floor((start + end) / 2);

  tree.insert(elems[index]);
  convertToBST(tree, elems, start, index - 1);
  convertToBST(tree, elems, index + 1, end);
}
