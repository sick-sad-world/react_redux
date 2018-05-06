import React from 'react';
import { shallow } from 'enzyme';
import Badge from './index';
import styles from './styles.scss';

describe('<Badge/>', () => {
  test('Should render badge element with children', () => {
    const wrapper = shallow(<Badge value='Text' />);
    expect(wrapper.matchesElement(<samp>Text</samp>)).toBeTruthy();
  })

  test('Should apply className for raised style', () => {
    const wrapper = shallow(<Badge raised value='Text' />);
    expect(wrapper.hasClass('style--raised')).toBeTruthy();
  })

  test('Should give proper class name based on [theme] prop', () => {
    const theme = 'accent';
    const wrapper = shallow(<Badge theme={theme} value='Text' />);
    expect(wrapper.hasClass(styles[theme])).toBeTruthy();
  })
})