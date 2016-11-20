import { SERVER_ERROR, GET_USER, EDIT_USER } from "./types";
import config from "../app-config";
import fetch from "../fetch";
import { setAppState } from "./app";

const getUser =  function (payload, silent) {
    silent = (typeof payload === "boolean") ? payload : silent;
    return (dispatch) => {
      !silent && dispatch(setAppState(3));
      return fetch(config.getUrl("user"))
        .then(payload => {
          let result = dispatch({type: GET_USER, payload});
          dispatch(setAppState(2));
          return result;
        })
        .catch(payload => {
          let result = dispatch({type: SERVER_ERROR, payload});
          dispatch(setAppState(2));
          return result;
        });
    }
  };

const editUser = function (payload, silent) {
    silent = (typeof payload === "boolean") ? payload : silent;
    return (dispatch) => {
      !silent && dispatch(setAppState(3));
      return fetch(config.getUrl("user"))
        .then(payload => {
          let result = dispatch({type: EDIT_USER, payload});
          dispatch(setAppState(2));
          return result;
        })
        .catch(payload => {
          let result = dispatch({type: SERVER_ERROR, payload});
          dispatch(setAppState(2));
          return result;
        });
    }
  };

export default getUser;
export { editUser };