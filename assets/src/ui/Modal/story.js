import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Modal, { ModalHeader, ModalFooter } from './index';
import Button from '../Button';
import TabsNav from '../TabsNav';

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
          <Button onClick={toggler}>Open Modal</Button>
          {store.state.open && (
            <Modal style={{width: '480px', height: '60%'}} onOverlayClick={toggler}>
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
                <Button onClick={toggler}>Close</Button>
              </ModalFooter>
            </Modal>
          )}
          <div id='modal-root' />
        </div>
      )
    })(story)
  )));



