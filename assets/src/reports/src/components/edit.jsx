// Import utility stuff
// ===========================================================================
import moment from 'moment';
import { defaultInterface, defaultFrequency } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import Datetime from 'react-datetime';
import { ColumnsContainer } from 'src/columns';
import MakeEditForm, { injectedPropsType } from 'common/hocs/edit-form';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import { EmailBcc } from 'src/user';

// Edit Report
// ===========================================================================
class EditReport extends React.Component {

  static getTypeCheck() {
    return {
      data: PropTypes.shape(defaultInterface).isRequired
    };
  }

  static mapDataToState(data, props) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      active: data.active,
      frequency: data.frequency,
      columns: data.columns,
      recipient: data.recipient,
      next_send: data.next_send || moment().add(1, 'hours').format(props.timeFormat)
    };
  }

  static mapStateToData(state, data, changed, props) {
    return state;
  }

  static getNextSend(value, props) {
    return (typeof value === 'string') ? value : value.format(props.timeFormat);
  }

  stateUpdater(prop) {
    return (emails, email) => {
      if (email) {
        this.props.stateUpdater({ [prop]: email });
      }
    };
  }

  render() {
    const { running, formValues, updateState, frequencyOptions } = this.props;
    const datePickerFormats = this.props.timeFormat.split(' ');
    return (
      <form className='subsection-content columned'>
        <div className='form-block'>
          <TextInput
            className='row'
            name='name'
            label='Report name'
            disabled={running}
            value={formValues.name}
            onChange={updateState('name')}
          />
          <Toggler
            label='Status'
            className='row-flex'
            togglerClassName='size-180'
            disabled={running}
            name='active'
            options={[
              { label: 'Active', value: 1 },
              { label: 'Inactive', value: 0 }
            ]}
            value={formValues.active}
            onChange={updateState('active')}
          />
          <Dropdown
            label='Frequency'
            disabled={running}
            className='row-flex-wrap'
            selectClassName='size-120'
            name='frequency'
            options={frequencyOptions}
            onChange={updateState('frequency')}
            value={formValues.frequency}
            desc={<span>Check column(s) for new items every <i>x</i> minutes</span>}
          />
          <div className='row-flex'>
            <label htmlFor='funReportNextSend'>Next send:</label>
            <Datetime
              value={formValues.next_send}
              onChange={updateState('next_send', 'getNextSend')}
              dateFormat={datePickerFormats[0]}
              timeFormat={datePickerFormats[1]}
              inputProps={{
                className: 'size-180',
                disabled: running,
                name: 'next_send'
              }}
            />
          </div>
          <ColumnsContainer schema={{ value: 'id', label: 'name' }}>
            {({ payload }) => (
              <Dropdown
                label='Columns assigment'
                disabled={running}
                className='row'
                name='columns'
                options={payload}
                onChange={updateState('columns')}
                multi={true}
                value={formValues.columns}
                desc='Watched columns (click on columns in the list to watch them too)'
              />
            )}
          </ColumnsContainer>
        </div>
        <div className='form-block'>
          <div className='row'>
            <h3 className='form-subtitle'>Email assigment:</h3>
            <p>Currently this report going to: <b>{formValues.recipient}</b></p>
            <EmailBcc active={formValues.recipient} disabled={running} onClick={updateState('recipient')} onChange={this.stateUpdater('recipient')} />
          </div>
        </div>
      </form>
    );
  }
}

EditReport.defaultProps = {
  frequencyOptions: defaultFrequency
};

EditReport.propTypes = {
  columns: optionShape('number'),
  frequencyOptions: optionShape('number'),
  ...injectedPropsType
};

export default MakeEditForm(EditReport);
