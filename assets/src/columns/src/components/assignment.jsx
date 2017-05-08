// Import utility stuff
// ===========================================================================
import { forOwn, isEqual } from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from 'functions';
import { editOptions, availableColumnData, defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum, textShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import { EditFormHeader, EditFormConfirmation } from 'common/components/edit-form-hoc';
import { FeedsList } from 'src/feeds';
import { CompleteList, SetsList } from 'src/sets';

// Feed assginment to columns
// ===========================================================================
export default class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sets: [],
      sources: []
    };
  }
  render() {
    const running = this.props.state > 2;
    const { texts } = this.props;
    return (
      <section className={classNames({
        'mod-subsection-management': true,
        'state-loading': running
      })}>
        <EditFormHeader
          title={`${texts.title} ${this.props.data.name}`}
          description={texts.description}
          url={`${this.props.backPath}/${this.props.data.id}`}
        />
        {(this.state.changed) ? (
          <EditFormConfirmation text={texts.confirmation} changed={this.state.changed} apply={null} cancel={null} />
        ) : null}
        <div className='subsection-content mod-submanagement'>
          <div className='selected'>
            <div className='header'>
              <span>Column has 0 sets and 0 sources assigned.</span>
            </div>
            <ul>
              <li>
                <SetsList criterea={{ set_ids: this.state.sources }} empty='No sets assigned' />
              </li>
              <li>
                <FeedsList criterea={{ source_ids: this.state.sources }} empty='No feeds assigned' />
              </li>
            </ul>
          </div>
          <CompleteList dis_sets={this.state.sets} dis_sources={this.state.sources} onSetClick={console.log} onFeedClick={console.log} />
        </div>
      </section>
    );
  }
}

Assignment.defaultProps = {
  state: 1,
  texts: {
    title: 'Assign feeds to column',
    description: 'Pick the sourcesets and sources this column to watch here.',
    confirmation: '{data} was changed. Save changes?'
  }
};

Assignment.propTypes = {
  backPath: PropTypes.string,
  texts: PropTypes.shape(textShape).isRequired,
  state: stateNum.isRequired,
  data: PropTypes.shape(defaultInterface).isRequired
};
