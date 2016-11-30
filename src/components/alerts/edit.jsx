import { filter, bindAll } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import EmailList from '../user/injectable';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    bindAll(this, ['changeHandler']);
  }

  changeHandler (e) {
    e.preventDefault();
    console.log(e.target.name, e.target.value);
  }

  render() {
    let item = this.props.item;
    let texts = Object.assign({
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props'
    }, this.props.texts);

    return (this.props.item) ? (
      <section className='mod-subsection-edit'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title} '{ item.name }'</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content columned'>
          <div className='form-column'>
            <div className='row'>
              <label htmlFor='funAlertName'>Alert name:</label>
              <input defaultValue={item.name} onChange={this.changeHandler} id='funAlertName' type='text' name='name' className='size-320' />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Status:</span>
              <div className='toggler size-120'>
                <input defaultChecked={item.active === 0} onChange={this.changeHandler} type='radio' id='funAlertAvailablityNo' name='active' value='0' />
                <label htmlFor='funAlertAvailablityNo'>Inactive</label>
                <input defaultChecked={item.active === 1} onChange={this.changeHandler} type='radio' id='funAlertAvailablityYes' name='active' value='1' />
                <label htmlFor='funAlertAvailablityYes'>Active</label>
                <em></em>
                <span></span>
              </div>
            </div>
            <div className='row-flex-wrap'>
              <label htmlFor='funAlertFrequency'>Frequency:</label>
              <select defaultValue={item.frequency} onChange={this.changeHandler} id='funAlertFrequency' data-width='30%' data-placeholder='Frequency' name='frequency'>
                <option value=''></option>
                <option value='5'>5 min</option>
                <option value='10'>10 min</option>
                <option value='15'>15 min</option>
                <option value='20'>20 min</option>
                <option value='30'>30 min</option>
                <option value='60'>60 min</option>
              </select>
              <small className='form-description'>Check column(s) for new items every <i>x</i> minutes</small>
            </div>
            <EmailList className='row' />
          </div>
          <div className='form-column'>
            <div className='row'>
              <fieldset className='size-wide'>
                <legend>Column assigment:</legend>
                <ul className='column-list t-rhythm'></ul>
                <div className='row'>
                  <span className='form-label'>Assign new:</span>
                  <Link to={`alerts/${item.id}/assign`} className='is-button size-120'>Assign</Link>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </section>
    ) : null;
  }
}

let mapStateToProps = ({ alerts }, ownProps) => ({
  item: filter(alerts, {id: parseInt(ownProps.params.id)})[0]
});

export default connect(mapStateToProps)(Edit);