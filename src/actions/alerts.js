import { GET_ALERTS, SORT_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from "./types";
import basicAction from "./actionFactory";

const getAlerts = basicAction("alerts", GET_ALERTS);
const sortAlerts = basicAction("sort_alerts", SORT_ALERTS);
const addAlert = basicAction("add_alert", ADD_ALERT);
const editAlert = basicAction("alert", EDIT_ALERT);
const deleteAlert = basicAction("remove_alert", DELETE_ALERT);

export default getAlerts;
export { sortAlerts, addAlert, editAlert, deleteAlert };