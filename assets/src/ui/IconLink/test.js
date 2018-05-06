import React from 'react';
import { shallow } from 'enzyme';
import IconLink from './index';

describe('<IconLink/>', () => {

  test('Should have root element <NavLink/>', () => {
    const wrapper = shallow(<IconLink g='bell' to='some' />);
    expect(wrapper.find('NavLink').name()).toEqual('NavLink');
  })

  test('Should pass [g] prop to <Icon/>', () => {
    const glyph = 'bell';
    const wrapper = shallow(<IconLink to='some' g={glyph} />);
    expect(wrapper.find('Icon').prop('g')).toEqual(glyph);
    expect(wrapper.find('NavLink').prop('g')).toBeUndefined();
  })

  test('Should pass [fill] prop to <Icon/>', () => {
    const fill = '#fff';
    const wrapper = shallow(<IconLink to='some' g='bell' fill={fill} />);
    expect(wrapper.find('Icon').prop('fill')).toEqual(fill);
    expect(wrapper.find('NavLink').prop('fill')).toBeUndefined();
  })

  test('Should pass [viewBox] prop to <Icon/>', () => {
    const vb = '0 0 30 30';
    const wrapper = shallow(<IconLink to='some' g='bell' viewBox={vb} />);
    expect(wrapper.find('Icon').prop('viewBox')).toEqual(vb);
    expect(wrapper.find('NavLink').prop('fiviewBoxll')).toBeUndefined();
  })

  test('Should apply other props to <a/>', () => {
    const className = 'className';
    const data = {
      to: 'some',
      activeClassName: 'selected',
      'data-some': 'data-some',
      oc: 'onclick',
      href:'#some'
    }
    const wrapper = shallow(<IconLink g='bell' className={className} {...data} />);
    expect(wrapper.find('NavLink').hasClass(className)).toBeTruthy();
    expect(wrapper.find('Icon').hasClass(className)).toBeFalsy();
    Object.keys(data).forEach((k) => {
      expect(wrapper.find('NavLink').prop(k)).toEqual(data[k]);
      expect(wrapper.find('Icon').prop(k)).toBeUndefined();
    })
  })
})