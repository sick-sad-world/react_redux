import { Component } from 'react';
import { shallow } from 'enzyme';
import RadioButton from './component';

describe('<RadioButton/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockClear();
  })

  test('Should render input component', () => {
    const wrapper = shallow(<RadioButton name='name' onChange={jest.fn()} />);
    expect(wrapper.find('input[type="radio"][name="name"][value]').exists()).toBeTruthy();
  })

  test('Should handle [value] of input', () => {
    const value = 'some';
    const wrapper = shallow(<RadioButton name='name' value={value} onChange={jest.fn()} />);
    expect(wrapper.find('input[type="radio"][name="name"]').prop('value')).toEqual(value);
  })

  test('Should forse providing [name] property to handle updates', () => {
    shallow(<RadioButton onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'RadioButton'));
  })

  test('Should handle [checked] property to define RadioButton state', () => {
    const wrapper = shallow(<RadioButton onChange={jest.fn()} checked={false} />);
    expect(wrapper.find('input[type="radio"][checked="true"]').exists()).toBeFalsy();
  })

  test('Should handle [checked] property as a function and run it with proper arguments', () => {
    const checked = jest.fn();
    shallow(<RadioButton onChange={jest.fn()} name='name' value='a' checked={checked} />);
    expect(checked).toHaveBeenCalledTimes(1);
    expect(checked).toHaveBeenCalledWith({ name: 'a' })
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<RadioButton name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'RadioButton'));
  })

  test('Should pass all props to input except listed in propTypes', () => {
    const wrapper = shallow(<RadioButton name='name' label='foo' bar='baz' onChange={jest.fn()} />);
    const input = wrapper.find('input[name="name"]');
    expect(input.prop('bar')).toEqual('baz');
    expect(input.prop('label')).not.toEqual('foo');
  })
  
})
