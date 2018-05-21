import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import makeFormField from './index';

const Test = makeFormField(<div/>);

storiesOf('FormElements', module)
  .addDecorator(withTests('FormField'))
  .add('Form Field HOC', withInfo({
    propTables: [Test]
  })(() => (
    <div>
    </div>
  )));
