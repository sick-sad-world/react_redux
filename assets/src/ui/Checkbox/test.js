import { Component } from 'react';
import { shallow } from 'enzyme';
import Checkbox from './component';

describe('<Checkbox/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render input component', () => {
    const wrapper = shallow(<Checkbox name='name' onChange={jest.fn()} />);
    expect(wrapper.find('input[type="checkbox"][name="name"][value]').exists()).toBeTruthy();
  })

  test('Should handle [value] of input', () => {
    const value = 'some';
    const wrapper = shallow(<Checkbox name='name' value={value} onChange={jest.fn()} />);
    expect(wrapper.find('input[type="checkbox"][name="name"]').prop('value')).toEqual(value);
  })

  test('Should forse providing [name] property to handle updates', () => {
    shallow(<Checkbox onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'Checkbox'));
  })

  test('Should handle [checked] property to define checkbox state', () => {
    const wrapper = shallow(<Checkbox onChange={jest.fn()} checked={false} />);
    expect(wrapper.find('input[type="checkbox"][checked="true"]').exists()).toBeFalsy();
  })

  test('Should handle [checked] property as a function and run it with proper arguments', () => {
    const checked = jest.fn();
    shallow(<Checkbox onChange={jest.fn()} name='name' value='a' checked={checked} />);
    expect(checked).toHaveBeenCalledTimes(1);
    expect(checked).toHaveBeenCalledWith({ name: 'a' })
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<Checkbox name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Checkbox'));
  })

  test('Should pass all props to input except listed in propTypes', () => {
    const wrapper = shallow(<Checkbox name='name' label='foo' bar='baz' onChange={jest.fn()} />);
    const input = wrapper.find('input[name="name"]');
    expect(input.prop('bar')).toEqual('baz');
    expect(input.prop('label')).not.toEqual('foo');
  })
  
})
