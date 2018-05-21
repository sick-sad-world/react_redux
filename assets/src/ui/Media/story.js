import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Media from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('Media'))
  .add('Media', withState({errored: []}, (story, store) => (
    withInfo({
      propTables: [Media]
    })(() => {
      const onError = (src) => {
        console.log(src);
        store.set({errored: [...store.state.errored, src]})
      }
      return (
        <div>
          <Media style={{width: '200px', height: '150px'}} src='https://bo.pb.ua/resources/images/content/advantages/2.png' alt='Some image' onError={onError} /> Working image
          <br />
          <Media style={{width: '200px', height: '150px'}} isBroken src='https://bo.pb.ua/resources/images/content/advantages/1.png' alt='Some image' onError={onError} /> Manually set to broken
          <br />
          <Media style={{width: '200px', height: '150px'}} src='https://bo.pb.ua/resources/images/content/advantages/1419058.png' alt='Some image' onError={onError} /> 404 Image
          <br />
        </div>
      );
    })(story)
  )));

