import { Component } from 'react';
import { shallow } from 'enzyme';
import Button from './index';
import styles from './styles.scss';

describe('<Button/>', () => {
  test('Should render button element with children', () => {
    const wrapper = shallow(<Button value='Text' />);
    expect(wrapper.type()).toEqual('button');
    expect(wrapper.containsMatchingElement('Text')).toBeTruthy();
  })

  test('Should render <a/> element if [el] set to [link]', () => {
    const wrapper = shallow(<Button el='link' value='Text' />);
    expect(wrapper.type()).toEqual('a');
    expect(wrapper.containsMatchingElement('Text')).toBeTruthy();
  })

  test('Should render <input[type="button"]/> element if [el] set to [input]', () => {
    const wrapper = shallow(<Button el='input' value='Text' />);
    expect(wrapper.matchesElement(<input type='button' value='Text' />)).toBeTruthy();
  })

  test('Should give proper class name based on [theme] prop', () => {
    const theme = 'warning';
    const wrapper = shallow(<Button theme={theme} value='Text' />);
    expect(wrapper.hasClass(styles[theme])).toBeTruthy();
  })
})
