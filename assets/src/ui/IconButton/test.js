import React from 'react';
import { shallow } from 'enzyme';
import IconButton from './index';

describe('<IconButton/>', () => {

  test('Should have root element <a/>', () => {
    const wrapper = shallow(<IconButton g='bell' />);
    expect(wrapper.type()).toEqual('a');
  })

  test('Should pass [g] prop to <Icon/>', () => {
    const glyph = 'bell';
    const wrapper = shallow(<IconButton g={glyph} />);
    expect(wrapper.find('Icon').prop('g')).toEqual(glyph);
    expect(wrapper.find('a').prop('g')).toBeUndefined();
  })

  test('Should pass [fill] prop to <Icon/>', () => {
    const fill = '#fff';
    const wrapper = shallow(<IconButton g='bell' fill={fill} />);
    expect(wrapper.find('Icon').prop('fill')).toEqual(fill);
    expect(wrapper.find('a').prop('fill')).toBeUndefined();
  })

  test('Should pass [viewBox] prop to <Icon/>', () => {
    const vb = '0 0 30 30';
    const wrapper = shallow(<IconButton g='bell' viewBox={vb} />);
    expect(wrapper.find('Icon').prop('viewBox')).toEqual(vb);
    expect(wrapper.find('a').prop('fiviewBoxll')).toBeUndefined();
  })

  test('Should apply other props to <a/>', () => {
    const className = 'className';
    const data = {
      'data-some': 'data-some',
      oc: 'onclick',
      href:'#some'
    }
    const wrapper = shallow(<IconButton g='bell' className={className} {...data} />);
    expect(wrapper.find('a').hasClass(className)).toBeTruthy();
    expect(wrapper.find('Icon').hasClass(className)).toBeFalsy();
    Object.keys(data).forEach((k) => {
      expect(wrapper.find('a').prop(k)).toEqual(data[k]);
      expect(wrapper.find('Icon').prop(k)).toBeUndefined();
    })
  })

})