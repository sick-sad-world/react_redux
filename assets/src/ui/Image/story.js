import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Image from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('Image'))
  .add('Image', withState({errored: []}, (story, store) => (
    withInfo({
      propTables: [Image]
    })(() => {
      const onError = (src) => {
        console.log(src);
        store.set({errored: [...store.state.errored, src]})
      }
      return (
        <div>
          <Image style={{width: '48px', height: '48px'}} src='https://bo.pb.ua/resources/images/content/advantages/2.png' alt='Some image' onError={onError} /> Working image
          <br />
          <Image style={{width: '48px', height: '48px'}} src='https://bo.pb.ua/resources/images/content/advantages/1419058.png' rounded alt='Ihor Koptielov' onError={onError} /> 404 Image - Rounded
          <br />
        </div>
      );
    })(story)
  )));