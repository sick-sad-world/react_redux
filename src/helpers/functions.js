// Ensure path is absolute
// ===========================================================================
export const absolutizePath = (path) => (path && path.indexOf('/') > 0) ? '/'+path : path;

export const pickUniqueSources = (sets) => {
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

export const setUniqueSources = (set, feeds) => {
  set.uniq_ids = [];
  set.source_ids.forEach((source) => {
    if (feeds[source] === 1) {
      set.uniq_ids.push(source);
    }
  });
}

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