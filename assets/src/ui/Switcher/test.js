import { Component } from 'react';
import { shallow } from 'enzyme';
import Switcher from './component';

describe('<Switcher/>', () => {
  const error = jest.spyOn(console, 'error');
  let optionsDouble = [];
  let optionsTriple = [];

  beforeEach(() => {
    optionsDouble = [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ];
    optionsTriple = [
      { label: 'Only', value: 1 },
      { label: 'Include', value: null },
      { label: 'Omit', value: 0 }
    ];
    error.mockClear();
  })

  test('Should render input components based on options provided', () => {
    const name = 'name';
    const wrapper = shallow(<Switcher name={name} onChange={jest.fn()} options={optionsDouble} />);
    expect(wrapper.find(`input[type="radio"][name="${name}"]`).length).toEqual(optionsDouble.length);
  })

  test('Should allow render triple switchers', () => {
    const name = 'name';
    const wrapper = shallow(<Switcher name={name} onChange={jest.fn()} options={optionsTriple} />);
    expect(wrapper.find(`input[type="radio"][name="${name}"]`).length).toEqual(optionsTriple.length);
  })

  test('Should forse providing [options] property to choose from', () => {
    shallow(<Switcher onChange={jest.fn()}  name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('options', 'Switcher'));
  })

  test('Should forse providing [name] property to handle updates', () => {
    shallow(<Switcher onChange={jest.fn()}  options={optionsDouble} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'Switcher'));
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<Switcher name='name'  options={optionsDouble} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Switcher'));
  })

  test('Should pass all props to inputs except listed in propTypes', () => {
    const wrapper = shallow(<Switcher name='name' label='foo' bar='baz' onChange={jest.fn()}  options={optionsDouble} />);
    const input = wrapper.find('input[name="name"]').first();
    expect(input.prop('bar')).toEqual('baz');
    expect(input.prop('label')).not.toEqual('foo');
  })
})