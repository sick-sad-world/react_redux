import { transform, sortBy, uniqBy, reject } from 'lodash';
import { mergeArrayById } from 'functions';
import { pickType } from './namespace';

const defaultReducerHandlers = {
  read(state, payload) {
    return uniqBy(payload, 'id');
  },
  create(state, payload) {
    return mergeArrayById(state, payload, true);
  },
  update(state, payload) {
    return mergeArrayById(state, payload, true);
  },
  delete(state, payload) {
    return reject(state, { id: payload.id });
  },
  sort(state, payload) {
    return sortBy(state.map((item) => {
      const index = payload.indexOf(item.id);
      return {
        ...item,
        order: (index === -1) ? item.order : index
      };
    }), 'order');
  },
  reset(state, payload, meta, defaultState) {
    return defaultState;
  }
};

function prepareReducerHandler(acc, v, k) {
  const handler = (typeof v === 'string') ? defaultReducerHandlers[v] : v;
  const type = pickType(k);

  if (!type) {
    console.warn(`Action type [${k}] not found. Action not handled`);
    return acc;
  }
  if (!(handler instanceof Function)) {
    console.warn(`Reducer handler [${k}] should be a function. Action not handled`);
    return acc;
  }

  acc[type] = handler;
  return acc;
}

export function createReducer(conf = {}, defState = []) {
  const reducerMap = transform(conf, prepareReducerHandler, {});
  return (state = defState, action) => {
    if (reducerMap[action.type] instanceof Function) {
      return reducerMap[action.type](state, action.payload, action.meta, defState);
    }
    return state;
  };
}
