import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Modal, { ModalHeader, ModalFooter } from './index';
import Button from '../Button';
import TabsNav from '../TabsNav';

if (!document.getElementById('modal-root')) {
  document.body.insertAdjacentHTML('beforeend','<div id="modal-root"></div>');
}

storiesOf('UI Components', module)
  .addDecorator(withTests('Modal'))
  .add('Modal', withState({ open: false, tab: 'one' }, (story, store) => (
    withInfo({
      propTables: [Modal],
      propTablesExclude: [Button, TabsNav]
    })(() => {
      function toggler() {
        store.set({open: !store.state.open})
      }
      
      return (
        <div>
          <Button onClick={toggler} value='Open Modal' />
          <Modal style={{width: '480px', height: '60%'}} open={store.state.open} onOverlayClick={toggler}>
            <ModalHeader onClose={toggler} title='Cool modal window'>
              <TabsNav
                options={{
                  'one': 'First tab',
                  'two': 'Second tab',
                  'three': 'Third tab'
                }}
                theme='action'
                onChange={(value) => store.set({tab: value})}
                active={store.state.tab}
              />
            </ModalHeader>
            <div className='content'>Tab: {store.state.tab} is displayed</div>
            <ModalFooter style={{textAlign: 'right'}}>
              <small style={{marginRight: '8px'}}>Small footer text for a modal</small>
              <Button onClick={toggler} value='Close' />
            </ModalFooter>
          </Modal>
        </div>
      )
    })(story)
  )));



