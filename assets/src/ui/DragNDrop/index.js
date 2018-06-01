import Ctx from './Context';
import Ls from './List';
import It from './Item';

export const Context = Ctx;

export const List = Ls;

export const ListItem = It;

export const addAt = (list, index, item) => {
  if (!item) return list;
  const result = Array.from(list);
  result.splice(index, 0, item);
  return result;
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};