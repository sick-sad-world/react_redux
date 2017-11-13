import { get, forOwn, mapValues } from 'lodash';
import invariant from 'invariant';
import fetch from 'src/communication';

const errors = Object.freeze({
  actionNotFound: 'Action [%s] not found in a pool, check spelling',
  serviceNotFound: 'Service [%s] not found in a pool, check spelling',
  serviceAlreadyExists: '%s already declared, try another alias',
  reducerConfigError: '[%s] reducer wrong configuration. All reducer entries should be Functions or one of [read, create, update, deleteConfirm, delete, sort] default handlers pointers',
  typeNotFound: 'Type %s not found in type pool, check spelling. Action creators should fire only declared actions'
});

const types = {};

const actions = {};

const globalErrorHandler = { path: null };

const defReducerMap = Object.freeze({
  read() {

  },
  create() {

  },
  update() {

  },
  deleteConfirm() {

  },
  delete() {

  },
  sort() {

  }
});

// Check whatever given value is a valid TYPE string
// ===========================================================================
function isType(s) {
  return (typeof s === 'string' && s.indexOf('@@') === 0);
}

// Get another action to use
// ===========================================================================
export function getAction(path) {
  const res = get(actions, path);
  if (res instanceof Function) {
    return res;
  }
  console.warn(errors.actionNotFound.replace('%s', path));
  return false;
}

// Lock services pool preventing further extension
// ===========================================================================
export function freezePool() {
  Object.freezeDeep(actions);
  Object.freezeDeep(types);
  Object.freeze(globalErrorHandler);
}

// Set Action to run on EVERY error
// ===========================================================================
export function setGlobalError(path) {
  const res = getAction(path);
  invariant(!res, errors.actionNotFound, path);
  globalErrorHandler.path = path;
  return true;
}

// Default action payload creator for Trendolizer AJAX calls
// ===========================================================================
export function defaultAction(url) {
  return async (params, opts) => {
    const { success, message, error, ...payload } = await fetch(url, params, opts);
    if (error) throw { error };
    return (success || message) ? params : payload;
  };
}

// Create action runner
// ===========================================================================
function createAction(type, action) {
  return (params, opts) => async ({ dispatch, getState }) => {
    try {
      const payload = await action(params, opts, { dispatch, getState });
      dispatch({ type, payload });
    } catch (e) {
      console.error(e);
      if (globalErrorHandler.path) {
        return dispatch(getAction(globalErrorHandler.path)(e));
      }
      console.error('ERROR HANDLER IS NOT SET');
    }
  };
}

// Add new action, insert actions to global pool
// ===========================================================================
function addAction(service) {
  return (name, action) => {
    const type = get(types, `${service}.${name}`);
    invariant(!isType(type), errors.typeNotFound, `${service}.${name}`);
    actions[service][name] = createAction(type, (action instanceof Function) ? action : defaultAction);
    return actions[service][name];
  };
}

// Create reducer for a service
// ===========================================================================
function createReducer(service, config = {}, defState) {
  const handlerMap = {};

  forOwn(config, (func, path) => {
    const type = get(types, path) || path;
    invariant(!isType(path), errors.typeNotFound, name);

    const handler = (typeof func === 'string') ? defReducerMap[func] : func;
    invariant(!(handler instanceof Function), errors.reducerConfigError, name);

    handlerMap[type] = handler;
  });

  Object.freeze(handlerMap);

  return (state = defState, { type, payload, meta }) => {
    if (handlerMap[type] instanceof Function) {
      return handlerMap[type](state, payload, meta);
    }
    return state;
  };
}

// Create new service, insert types to global pool
// ===========================================================================
export function createService(service, ...endpoints) {
  invariant(types[service] !== undefined, errors.serviceAlreadyExists, service);

  const add = addAction(service);
  const typeMap = endpoints.reduce((acc, action) => {
    acc[action] = `@@${service}.${action}`;
    return acc;
  }, {});

  types[service] = { ...typeMap };
  actions[service] = {};

  return {
    types: Object.freeze(typeMap),
    addAction: add,
    addActions: (config) => {
      mapValues(config, (func, name) => add(name, func));
    },
    createReducer: (...args) => createReducer(service, ...args)
  };
}
