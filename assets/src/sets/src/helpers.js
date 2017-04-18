// Create hash of all Sources [id] where value is a number of occurances
// ===========================================================================
export const calcFeedOccurance = function calcFeedOccurance(sets) {
  const feeds = {};
  sets.forEach((set) => {
    set.source_ids.forEach((source) => {
      if ('source' in feeds) {
        feeds[source] += 1;
      } else {
        feeds[source] = 1;
      }
    });
  });
  return feeds;
};

// Loop over Set [source_ids] and push uniqe ones to [uniq_ids]
// ===========================================================================
export const setUniqFeeds = function setUniqFeeds(set, feeds) {
  set.uniq_ids = [];
  set.source_ids.forEach((source) => {
    if (feeds[source] === 1) {
      set.uniq_ids.push(source);
    }
  });
  return set;
};
