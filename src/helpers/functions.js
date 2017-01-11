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

export const setUniqueSources = (set, i) => {
  set.uniq_ids = [];
  set.source_ids.forEach((source) => {
    if (this[source] === 1) {
      set.uniq_ids.push(source);
    }
  });
}