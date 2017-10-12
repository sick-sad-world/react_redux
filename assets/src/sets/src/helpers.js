import { parseOrder } from 'functions';

// Create hash of all Sources [id] where value is a number of occurances
// ===========================================================================
export function calcFeedOccurance(sets) {
  const feeds = {};
  sets.forEach((set) => {
    set.source_ids.forEach((source) => {
      if (source in feeds) {
        feeds[source] += 1;
      } else {
        feeds[source] = 1;
      }
    });
  });
  return feeds;
}

// Loop over Set [source_ids] and push uniqe ones to [uniq_ids]
// ===========================================================================
export function setUniqFeeds(feedIds, feeds) {
  return feedIds.reduce((acc, source) => {
    if (feeds[source] === 1) {
      acc.push(source);
    }
    return acc;
  }, []);
}

export function processSet(set, sets) {
  return {
    ...set,
    order: parseOrder(set.order),
    uniq_ids: setUniqFeeds(set.source_ids, calcFeedOccurance(sets))
  };
}
