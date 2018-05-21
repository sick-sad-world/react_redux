import React from 'react';
import { shallow } from 'enzyme';
import data from './data';
import Icon from './index';

describe('<Icon/>', () => {
  test('Should use [path] value from an data hash given', () => {
    const glyph = 'clock';
    const wrapper = shallow(<Icon g={glyph} />);
    expect(wrapper.find('path').prop('d')).toEqual(data[glyph]);
  })

  test('Should set default [viewBox] to [0 0 20 20]', () => {
    const wrapper = shallow(<Icon g='clock' />);
    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 20 20');
  })

  test('Should throw an Error if glyph not found in list', () => {
    expect(() => {
      shallow(<Icon g='undefined' />);
    }).toThrowError();
  })

  test('Should pass [viewBox] prop to <svg/>', () => {
    const vb = '0 0 30 30';
    const wrapper = shallow(<Icon g='ccw' viewBox={vb} />);
    expect(wrapper.find('svg').prop('viewBox')).toEqual(vb);
  })

  test('Should pass [fill] prop to <path/>', () => {
    const fill = '#fff';
    const wrapper = shallow(<Icon g='ccw' fill={fill} />);
    expect(wrapper.find('path').prop('fill')).toEqual(fill);
    expect(wrapper.find('svg').prop('fill')).toBeUndefined();
  })

  test('Should apply other props to <svg/> element', () => {
    const className = 'some-class';
    const wrapper = shallow(<Icon g='ccw' className={className} />);
    expect(wrapper.find('path').hasClass(className)).toBeFalsy();
    expect(wrapper.find('svg').hasClass(className)).toBeTruthy();
  })
})

