import * as ACTIONS from '../actions/types';
import moment from 'moment';
import { isNull, isPlainObject, isUndefined, reduce, clone } from 'lodash';

// Inject behavior into component
// Assign and bind all methods wich is not defined within component already
// ===========================================================================
export const inject = (target, mixin) => {
  for (let key in mixin) {
    if (key !== '_inject' && !(target[key] instanceof Function)) {
      target[key] = mixin[key].bind(target);
    }
  } 
}

// Toggle binary switchers from 0 to 1 and reverse
// ===========================================================================
export const binToggle = (v) => (v) ? 0 : 1;  

// Ensure path to a file [image] is absolute
// ===========================================================================
export const absolutizePath = (path) => (path && path.indexOf('/') !== 0) ? '/'+path : path;

// Format number to short form: 1000 -> K, 1000000 -> M e.t.c
// ===========================================================================
export const formatNumber = (num, gap = 1) => {
  if (typeof num !== 'number') {
    return false;
  } else if (num < 1000) {
    return num + '';
  } else if (num >= 1000 && num < 1000000) {
    return Math.round(num / 1000).toFixed(gap) + 'K';
  } else if (num >= 1000000 && num < 1000000000) {
    return Math.round(num / 1000000).toFixed(gap) + 'M';
  } else if (num >= 1000000000) {
    return Math.round(num / 1000000000).toFixed(gap) + 'B';
  } else {
    return num;
  }
}

// Modify [Array] with value provided
// if [val] in [Array] -> return new one WITHOUT [val]
// if [val] not in [Array] -> return new one WITH [val]
// ===========================================================================
export const updateArrayWithValue = (arr, val) => {
  let result = [];
  let inArray = false;

  arr.forEach((item, i) => {
    if (item === val) {
      inArray = true;
    } else {
      result.push(item);
    }
  });

  if (!inArray) {
    result.push(val);
  }

  return result;
}

/**
 * Request and error processing unility methods
 * ===========================================================================
 */

  // Stringify nested [Objects] in order to send proper data to back-end
  // ===========================================================================
  export const transformRequestData = (data) => reduce(data, (acc, v, k) => {
    if (isPlainObject(v)) {
      acc[k] = JSON.stringify(v);
    } else if (!isNull(v) && !isUndefined(v)) {
      acc[k] = v;
    }
    return acc;
  }, {});

  // Create message, set [visiblity] to [true] and set ID if not provided
  // ===========================================================================
  export const createMessage = (data) => Object.assign({visible: true, id: moment().unix()}, data);

/**
 * Feeds unility methods
 * ===========================================================================
 */

  // Create hash of all Sources [id] where value is a number of occurances
  // ===========================================================================
  export const calcFeedOccurance = (sets) => {
    let feeds = {};
    sets.forEach((set) => {
      set.source_ids.forEach((source) => {
        if (feeds.hasOwnProperty(source)) {
          ++feeds[source]
        } else {
          feeds[source] = 1;
        }
      });
    });
    return feeds;
  }

  // Loop over Set [source_ids] and push uniqe ones to [uniq_ids]
  // ===========================================================================
  export const setUniqFeeds = (set, feeds) => {
    set.uniq_ids = [];
    set.source_ids.forEach((source) => {
      if (feeds[source] === 1) {
        set.uniq_ids.push(source);
      }
    });
  }

/**
 * Column data unility methods
 * ===========================================================================
 */

  // Normalize Column
  // Provide all default values to proper component display
  // Transform [display_settings] to Array if required
  // @return new [Object]
  // ===========================================================================
  export const normalizeColumn = (item, defaults) => {
    if (item) {
      item = clone(item);
      item.data = Object.assign({}, defaults.data, item.data);
      if (!item.display_settings || !item.display_settings.length) {
        item.display_settings = defaults.display_settings;
      }
      if (typeof item.display_settings === 'string') {
        item.display_settings = item.display_settings.split(',');
      }
      return item;
    } else {
      return {data: {}};
    }
  }

  // Transform Value recieved from Input to proper type
  // And filter values should be converted to null
  // ===========================================================================
  export const normalizeColumnValue = (value) => {
    let numVal = parseFloat(value);

    if (value === '' || (name.indexOf('is_') === 0 && value === 'on')) {
      return null;
    } else if (typeof numVal === 'number' && numVal === numVal) {
      return numVal
    } else {
      return value;
    }
  }

  // Unify Sort prefix and property into Sort parameter
  // ===========================================================================
  export const composeColumnSort = (pref, prop) => (pref && prop !== 'found') ? pref + '_' + prop : prop;

  // Generate new Data [Object] for a Column, including defaults, chages
  // and omitting values like [null, undefined, e.t.c]...
  // ===========================================================================
  export const composeColumData = function (data, name, value) {
    let result = false;

    // Transform value to a proper type - number, e.t.c
    // ===========================================================================
    let val = normalizeColumnValue(value);

    // Compose sorting property
    // ===========================================================================
    if (name.indexOf('sort') === 0) {
      name = 'sort';
      val = composeColumnSort(this.state.sort_pref, this.state.sort_prop);
    }

    // Proper autoreload disabled value
    // ===========================================================================
    if (name === 'autoreload' && !val) {
      val = 0;
    }

    // Actual merging of exact data Object
    // ===========================================================================
    if (val !== data[name]) {
      result = {
        [name]: (data[name] instanceof Array) ? updateArrayWithValue(data[name], val) : val
      };
      for (let key in data) {
        if (key !== name) {
          if (data[key] instanceof Array) {
            if (data[key].length > 0) result[key] = data[key];
          } else {
            if (!isNull(data[key]) && !isUndefined(data[key])) result[key] = data[key];
          }
        }
      }
    }
    return result;
  }

  // Conditions whatever we should Fetch for a new set of Results if
  // One of Column parameters related to it has been changed
  // @return [Boolean]
  // ===========================================================================
  export const shouldFetchResults = ({data}, name) => data && name !== 'autoreload' && name !== 'infinite';

/**
 * Colum result unility methods
 * ===========================================================================
 */

  // Split result description in order to show small preview
  // and everything else assigned to [additional] property
  // ===========================================================================
  export const splitText = (result) => {
    let limit = 120;
    let index = {
      max: Math.round(limit * 1.25),
      min: Math.round(limit * 0.75),
      curr: -1,
      isValid: function() {
        return this.curr >= 0 && (this.curr <= this.max || this.curr >= this.min);
      }
    };

    result.additional = '';
    if ((typeof result.description === 'string') && result.description.length > Math.round(limit * 1.75)) {
      index.curr = result.description.search(/[\.\?\!]\s/);
      if (!index.isValid()) {
        index.curr = result.description.indexOf(' ', limit);
        if (!index.isValid()) {
          index.curr = limit;
        }
      } else {
        index.curr = index.curr + 2;
      }
      if (index.curr >= 0) {
        result.additional = result.description.substring(index.curr, result.description.length);
        result.description = result.description.substring(0, index.curr);
      }
    }
    return result;
  }

  // Transform result sorting parameter to short form
  // ===========================================================================
  export const sortParamToShort = (stat = '') => {
    stat = stat.replace('_views', '');
    if (stat.indexOf('rate_') === 0) {
      stat = stat.replace('rate_', '') + '/hr';
    } else if (stat.indexOf('maxrate_') === 0) {
      stat = stat.replace('maxrate_', 'max ') + '/hr';
    } else if (stat.indexOf('hotness_') === 0) {
      stat = stat.replace('hotness_', 'hot ');
    }
    return stat;
  }