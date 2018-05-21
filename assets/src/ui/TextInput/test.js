import { Component } from 'react';
import { shallow } from 'enzyme';
import TextInput from './component';

describe('<TextInput/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render input component', () => {
    const wrapper = shallow(<TextInput name='name' onChange={jest.fn()} />);
    expect(wrapper.find('input[type="text"][name="name"][value]').exists()).toBeTruthy();
  })

  test('Should handle [value] of input', () => {
    const value = 'some';
    const wrapper = shallow(<TextInput name='name' value={value} onChange={jest.fn()} />);
    expect(wrapper.find('input[type="text"][name="name"]').prop('value')).toEqual(value);
  })

  test('Should forse providing [name] property to handle updates', () => {
    shallow(<TextInput onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'TextInput'));
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<TextInput name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'TextInput'));
  })

  test('Should pass all props to input except listed in propTypes', () => {
    const wrapper = shallow(<TextInput name='name' label='foo' bar='baz' onChange={jest.fn()} />);
    const input = wrapper.find('input[name="name"]');
    expect(input.prop('bar')).toEqual('baz');
    expect(input.prop('label')).not.toEqual('foo');
  })
})
