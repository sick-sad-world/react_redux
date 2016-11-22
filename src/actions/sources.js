import { GET_SOURCES, SORT_SOURCES, ADD_SOURCE, EDIT_SOURCE, DELETE_SOURCE } from './types';
import basicAction from './actionFactory';

const getSources = basicAction('sets', GET_SOURCES);
const addSource = basicAction('add_set', ADD_SOURCE);
const deleteSource = basicAction('remove_set', DELETE_SOURCE);

export default getSources;
export { addSource, deleteSource };