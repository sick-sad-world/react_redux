import React from 'react';

export default {

  // Render confirmation dialog
  // ===========================================================================
  renderDeleteDialog(props) {
    if (!this.state.deleting) return null;

    props = Object.assign({
      text: 'Are you sure about that?',
      className: 'small-popup confirmation-dialog'
    }, props);
    let deleteHandler = this.makeDeletingStateToggler();

    return ([
      <span key='overlay' onClick={deleteHandler} className='overlay'></span>,
      <div key='dialog' className={props.className}>
        <h4>{props.text}</h4>
        <span className='buttons'>
          <a onClick={() => this.handlerDelete(this.state.deleting)} className='button'>Delete</a>
          <span onClick={deleteHandler} className='button is-accent'>Close</span>
        </span>
      </div>
    ]);
  },

  // Handler to run [delete] instace action
  // ===========================================================================
  handlerDelete(id) {
    if (this.props.state === 2) {
      this.actions.delete({id}).catch(this.actions.throwError).then(() => this.setState({deleting: 0}));
    }
  },

  makeDeletingStateToggler(deleting = 0) {
    return () => this.setState({deleting});
  }
}