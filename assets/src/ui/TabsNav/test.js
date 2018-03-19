import React from 'react';
import { shallow } from 'enzyme';
import TabsNav from './index';
import { NavLink } from 'react-router-dom';

let options = {}; 

describe('<TabsNav/>', () => {

  beforeEach(() => {
    options = {
      'one': 'First tab',
      'two': 'Second tab',
      'three': 'Third tab'
    };
  })

  test('Should render given number of links', () => {
    const wrapper = shallow(<TabsNav options={options} onChange={jest.fn()} active={Object.keys(options)[0]} />);
    expect(wrapper.find('a').length).toEqual(Object.keys(options).length);
  });

  test('Should render NavLinks if onChange and active is not provided (Router Mode)', () => {
    const wrapper = shallow(<TabsNav options={options} />);
    expect(wrapper.find(NavLink).length).toEqual(Object.keys(options).length);
  });

  test('Should calculate proper flex styles based on items number 3 => 33.33%', () => {
    const wrapper = shallow(<TabsNav options={options} onChange={jest.fn()} active={Object.keys(options)[0]} />);
    expect(wrapper.find('a').first().prop('style')).toMatchObject({
      flex: `0 0 33.33%`
    });
  });

  test('Should calculate proper flex styles based on items number 4 => 25%', () => {
    options.four = 'Four tab'
    const wrapper = shallow(<TabsNav options={options} onChange={jest.fn()} active={Object.keys(options)[0]} />);
    expect(wrapper.find('a').first().prop('style')).toMatchObject({
      flex: `0 0 25%`
    });
  });
});
