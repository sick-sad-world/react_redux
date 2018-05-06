import React from 'react';
import { shallow } from 'enzyme';
import Dropdown from './component';
import Select, { Creatable } from 'react-select';

describe('<Dropdown/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render Select component', () => {
    const wrapper = shallow(<Dropdown name='name' onChange={jest.fn()} />);
    expect(wrapper.find(Select).exists()).toBeTruthy();
  })

  test('Should render Creatable component if [creatable] prop is provided', () => {
    const wrapper = shallow(<Dropdown name='name' onChange={jest.fn()} creatable />);
    expect(wrapper.find(Creatable).exists()).toBeTruthy();
  })

  test('Should handle [value] of input', () => {
    const value = 'some';
    const wrapper = shallow(<Dropdown name='name' value={value} onChange={jest.fn()} />);
    expect(wrapper.find(Select).prop('value')).toEqual(value);
  })

  test('Should forse providing [name] property to handle updates', () => {
    shallow(<Dropdown onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'Dropdown'));
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<Dropdown name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Dropdown'));
  })

  test('Should pass all props to input except listed in propTypes', () => {
    const wrapper = shallow(<Dropdown name='name' label='foo' bar='baz' onChange={jest.fn()} />);
    const dd = wrapper.find(Select);
    expect(dd.prop('bar')).toEqual('baz');
    expect(dd.prop('label')).not.toEqual('foo');
  })
})