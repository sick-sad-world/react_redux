import { GET_SOURCESETS, SORT_SOURCESETS, ADD_SOURCESET, EDIT_SOURCESET, DELETE_SOURCESET } from './types';
import basicAction from './actionFactory';

const getSourcesets = basicAction('sets', GET_SOURCESETS);
const sortSourcesets = basicAction('sort_sets', SORT_SOURCESETS);
const addSourceset = basicAction('add_set', ADD_SOURCESET);
const editSourceset = basicAction('set', EDIT_SOURCESET);
const deleteSourceset = basicAction('remove_set', DELETE_SOURCESET);

export default getSourcesets;
export { sortSourcesets, addSourceset, editSourceset, deleteSourceset };