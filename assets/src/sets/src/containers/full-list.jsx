// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { makeFullListSelector } from '../selectors';
import makeSearchable from 'common/hocs/searchable';

// Import Child components
// ===========================================================================
import SetsList from '../components/list';
import { FeedsList } from 'src/feeds';

function FullSetsList({ search }) {

}

export const SearchableSetsList = makeSearchable(FullSetsList);

export default connect(makeFullListSelector)(SearchableSetsList);
