import React from 'react';
import { shallow } from 'enzyme';
import data from './data';
import Icon, { IconButton, IconLink } from './index';

describe('<Icon/>', () => {

  test('Should use [path] value from an data hash given', () => {
    const glyph = 'clock';
    const wrapper = shallow(<Icon g={glyph} />);
    expect(wrapper.find('path').prop('d')).toEqual(data[glyph]);
  });

  test('Should set default [viewBox] to [0 0 20 20]', () => {
    const wrapper = shallow(<Icon g='clock' />);
    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 20 20');
  });

  test('Should throw an Error if glyph not found in list', () => {
    expect(() => {
      const wrapper = shallow(<Icon g='undefined' />);
    }).toThrowError();
  });

  test('Should pass [viewBox] prop to <svg/>', () => {
    const vb = '0 0 30 30';
    const wrapper = shallow(<Icon g='ccw' viewBox={vb} />);
    expect(wrapper.find('svg').prop('viewBox')).toEqual(vb);
  });

  test('Should pass [fill] prop to <path/>', () => {
    const fill = '#fff';
    const wrapper = shallow(<Icon g='ccw' fill={fill} />);
    expect(wrapper.find('path').prop('fill')).toEqual(fill);
    expect(wrapper.find('svg').prop('fill')).toBeUndefined();
  });

  test('Should apply other props to <svg/> element', () => {
    const className = 'some-class';
    const wrapper = shallow(<Icon g='ccw' className={className} />);
    expect(wrapper.find('path').hasClass(className)).toBeFalsy();
    expect(wrapper.find('svg').hasClass(className)).toBeTruthy();
  });

});

describe('<IconButton/>', () => {

  test('Should have root element <a/>', () => {
    const wrapper = shallow(<IconButton g='bell' />);
    expect(wrapper.type()).toEqual('a');
  });

  test('Should pass [g] prop to <Icon/>', () => {
    const glyph = 'bell';
    const wrapper = shallow(<IconButton g={glyph} />);
    expect(wrapper.find('Icon').prop('g')).toEqual(glyph);
    expect(wrapper.find('a').prop('g')).toBeUndefined();
  });

  test('Should pass [fill] prop to <Icon/>', () => {
    const fill = '#fff';
    const wrapper = shallow(<IconButton g='bell' fill={fill} />);
    expect(wrapper.find('Icon').prop('fill')).toEqual(fill);
    expect(wrapper.find('a').prop('fill')).toBeUndefined();
  });

  test('Should pass [viewBox] prop to <Icon/>', () => {
    const vb = '0 0 30 30';
    const wrapper = shallow(<IconButton g='bell' viewBox={vb} />);
    expect(wrapper.find('Icon').prop('viewBox')).toEqual(vb);
    expect(wrapper.find('a').prop('fiviewBoxll')).toBeUndefined();
  });

  test('Should apply other props to <a/>', () => {
    const className = 'className';
    const data = {
      'data-some': 'data-some',
      oc: 'onclick',
      href:'#some'
    };
    const wrapper = shallow(<IconButton g='bell' className={className} {...data} />);
    expect(wrapper.find('a').hasClass(className)).toBeTruthy();
    expect(wrapper.find('Icon').hasClass(className)).toBeFalsy();
    Object.keys(data).forEach((k) => {
      expect(wrapper.find('a').prop(k)).toEqual(data[k]);
      expect(wrapper.find('Icon').prop(k)).toBeUndefined();
    })
  });

});

describe('<IconLink/>', () => {

  test('Should have root element <NavLink/>', () => {
    const wrapper = shallow(<IconLink g='bell' to='some' />);
    expect(wrapper.find('NavLink').name()).toEqual('NavLink');
  });

  test('Should pass [g] prop to <Icon/>', () => {
    const glyph = 'bell';
    const wrapper = shallow(<IconLink to='some' g={glyph} />);
    expect(wrapper.find('Icon').prop('g')).toEqual(glyph);
    expect(wrapper.find('NavLink').prop('g')).toBeUndefined();
  });

  test('Should pass [fill] prop to <Icon/>', () => {
    const fill = '#fff';
    const wrapper = shallow(<IconLink to='some' g='bell' fill={fill} />);
    expect(wrapper.find('Icon').prop('fill')).toEqual(fill);
    expect(wrapper.find('NavLink').prop('fill')).toBeUndefined();
  });

  test('Should pass [viewBox] prop to <Icon/>', () => {
    const vb = '0 0 30 30';
    const wrapper = shallow(<IconLink to='some' g='bell' viewBox={vb} />);
    expect(wrapper.find('Icon').prop('viewBox')).toEqual(vb);
    expect(wrapper.find('NavLink').prop('fiviewBoxll')).toBeUndefined();
  });

  test('Should apply other props to <a/>', () => {
    const className = 'className';
    const data = {
      to: 'some',
      activeClassName: 'selected',
      'data-some': 'data-some',
      oc: 'onclick',
      href:'#some'
    };
    const wrapper = shallow(<IconLink g='bell' className={className} {...data} />);
    expect(wrapper.find('NavLink').hasClass(className)).toBeTruthy();
    expect(wrapper.find('Icon').hasClass(className)).toBeFalsy();
    Object.keys(data).forEach((k) => {
      expect(wrapper.find('NavLink').prop(k)).toEqual(data[k]);
      expect(wrapper.find('Icon').prop(k)).toBeUndefined();
    })
  });
})