import { GET_USER, EDIT_USER } from "./types";
import basicAction from "./actionFactory";

const getUser = basicAction('user', GET_USER);
const editUser = basicAction('user', EDIT_USER);

export default getUser;
export { editUser };