import React from 'react';
import { shallow } from 'enzyme';
import TabsNav from './index';

const options = {
  'one': 'First tab',
  'two': 'Second tab',
  'three': 'Third tab'
};

describe('<TabsNav/>', () => {

  test('Should render given number of links', () => {
    const wrapper = shallow(<TabsNav options={options} onChange={jest.fn()} active={Object.keys(options)[0]} />);
    expect(wrapper.find('a').length).toEqual(Object.keys(options).length);
  });

  // test('Should handle [value] of input', () => {
  //   const value = 'some';
  //   const wrapper = shallow(<TextInput name='name' value={value} onChange={jest.fn()} />);
  // });
});
