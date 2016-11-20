import { GET_REPORTS, SORT_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from "./types";
import basicAction from "./actionFactory";

const getReports = basicAction("reports", GET_REPORTS);
const sortReports = basicAction("sort_reports", SORT_REPORTS);
const addReport = basicAction("add_report", ADD_REPORT);
const editReport = basicAction("report", EDIT_REPORT);
const deleteReport = basicAction("remove_report", DELETE_REPORT);

export default getReports;
export { sortReports, addReport, editReport, deleteReport };