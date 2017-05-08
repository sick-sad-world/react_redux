// Import utility stuff
// ===========================================================================
import { defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import MakeEditForm, { injectedPropsType } from 'common/components/edit-form-hoc';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import { EmailBcc } from 'src/user';

// Edit Report
// ===========================================================================
class EditAlert extends React.Component {
  static getTypeCheck() {
    return {
      data: PropTypes.shape(defaultInterface).isRequired
    };
  }

  static mapDataToState(data) {
    return {
      id: data.id,
      name: data.name,
      active: data.active,
      frequency: data.frequency,
      columns: data.columns,
      recipient: data.recipient
    };
  }

  render() {
    const { running, formValues, updateState, columns, frequencyOptions } = this.props;
    return (
      <form className='subsection-content columned'>
        <div className='form-block'>
          <TextInput
            className='row'
            name='name'
            label='Alert name'
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
          <Dropdown
            label='Columns assigment'
            disabled={running}
            className='row'
            name='columns'
            options={columns}
            onChange={updateState('columns')}
            multi={true}
            value={formValues.columns}
            desc='Watched columns (click on columns in the list to watch them too)'
          />
        </div>
        <div className='form-block'>
          <div className='row'>
            <h3 className='form-subtitle'>Email assigment:</h3>
            <EmailBcc active={formValues.recipient} disabled={running} onClick={updateState('recipient')} />
          </div>
        </div>
      </form>
    );
  }
}

EditAlert.propTypes = {
  columns: optionShape('number'),
  frequencyOptions: optionShape('number'),
  ...injectedPropsType
};

export default MakeEditForm(EditAlert);
