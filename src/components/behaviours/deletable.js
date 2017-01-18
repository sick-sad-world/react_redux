import React from 'react';

export default {

  // Render confirmation dialog
  // ===========================================================================
  renderDeleteDialog(props) {
    props = Object.assign({
      text: 'Are you sure about that?',
      className: 'small-popup confirmation-dialog'
    }, props);
    let deleteHandler = this.makeDeletingStateToggler();

    if (!this.state.deleting) {
      throw {
        text: 'You should provide an [ID] of item to delete'
      }
    }

    return ([
      <span key='overlay' onClick={deleteHandler} className='overlay'></span>,
      <div key='dialog' className={props.className}>
        <h4>{props.text}</h4>
        <span className='buttons'>
          <a onClick={() => this.handlerDelete(this.state.deleting)} className='button'>Delete</a>
          <span onClick={deleteHandler} className='button is-accent'>Cancel</span>
        </span>
      </div>
    ]);
  },

  // Handler to run [delete] instace action
  // ===========================================================================
  handlerDelete(id) {
    this.actions.delete({id}).catch(this.actions.throwError).then(() => this.setState({deleting: 0}));
  },

  makeDeletingStateToggler(deleting = 0) {
    return () => this.setState({deleting});
  }
}