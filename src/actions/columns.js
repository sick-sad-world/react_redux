import { GET_COLUMNS, SORT_COLUMNS, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN } from "./types";
import basicAction from "./actionFactory";

const getColumns = basicAction("columns", GET_COLUMNS);
const sortColumns = basicAction("sort_columns", SORT_COLUMNS);
const addColumn = basicAction("add_column", ADD_COLUMN);
const editColumn = basicAction("column", EDIT_COLUMN);
const deleteColumn = basicAction("remove_column", DELETE_COLUMN);

export default getColumns;
export { sortColumns, addColumn, editColumn, deleteColumn };