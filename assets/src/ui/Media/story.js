import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Media from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('Media'))
  .add('Media', withState({}, (story, store) => (
    withInfo({
      propTables: [Media]
    })(() => {
      return (
        <div>
          <Media style={{width: '200px'}} src='https://bo.pb.ua/resources/images/content/advantages/2.png' alt='Some image' /> Working image
          <br />
          <Media style={{width: '200px'}} isBroken src='https://bo.pb.ua/resources/images/content/advantages/1.png' alt='Some image' /> Manually set to broken
          <br />
          <Media style={{width: '200px'}} src='https://bo.pb.ua/resources/images/content/advantages/1419058.png' alt='Some image' /> 404 Image
          <br />
        </div>
      );
    })(story)
  )));

