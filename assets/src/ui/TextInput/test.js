import set from 'lodash/set';
import React from 'react';
import { shallow } from 'enzyme';
import TextInput from './index';
import styles from './styles.scss';

describe('<TextInput/>', () => {
  const error = jest.spyOn(console, 'error');

  const mockedEvent = {
    persist: jest.fn(),
    target: {
      value: ''
    }
  };

  beforeEach(() => {
    error.mockReset();
    mockedEvent.persist.mockReset();
    mockedEvent.target.value = '';
  });

  test('Should render input component', () => {
    const onChange = jest.fn();
    const wrapper = shallow(<TextInput name='name' onChange={onChange}/>);
    expect(wrapper.find('input[type="text"][name="name"][value]').exists()).toBeTruthy();
  });

  test('Should handle [value] of input', () => {
    const value = 'some';
    const onChange = jest.fn();
    const wrapper = shallow(<TextInput name='name' value={value} onChange={onChange}/>);
    expect(wrapper.find('input[type="text"][name="name"]').prop('value')).toEqual(value);
  });

  test('Should forse providing [name] property to handle updates', () => {
    const onChange = jest.fn();
    shallow(<TextInput onChange={onChange}/>);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'TextInput'));
  });

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<TextInput name='name'/>);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'TextInput'));
  });

  test('Should toggle [focused] state and Call [onFocus/onBlur] callbacks if provided', () => {
    const name = 'name';
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const wrapper = shallow(<TextInput name={name} onChange={jest.fn()} onFocus={onFocus} onBlur={onBlur}/>);
    const input = wrapper.find(`input[name="${name}"]`);
    input.simulate('focus', mockedEvent);
    expect(wrapper.hasClass(styles['state--focus'])).toBeTruthy();
    expect(wrapper.state('focus')).toBeTruthy();
    input.simulate('blur', mockedEvent);
    expect(wrapper.hasClass(styles['state--focus'])).toBeFalsy();
    expect(wrapper.state('focus')).toBeFalsy();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('Should set [pristine] state to false on change', () => {
    const name = 'name';
    const onChange = jest.fn();
    const wrapper = shallow(<TextInput name={name} onChange={onChange}/>);
    const input = wrapper.find(`input[name="${name}"]`);
    input.simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(wrapper.state('pristine')).toBeFalsy();
  });

  test('Should call [onChange] handler with proper data', () => {
    const name = 'name';
    const onChange = jest.fn();
    const wrapper = shallow(<TextInput name={name} onChange={onChange}/>);
    const input = wrapper.find(`input[name="${name}"]`);
    input.simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ [name]: 'a' }, true);
  });

  test('Should call [validate] function with proper data and pass result to [onChange] func', () => {
    const name = 'name';
    const validate = jest.fn(() => ['error']);
    const onChange = jest.fn();
    const wrapper = shallow(<TextInput name={name} validate={validate} onChange={onChange}/>);
    const input = wrapper.find(`input[name="${name}"]`);
    input.simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith({ [name]: 'a' });
    expect(onChange).toHaveBeenCalledWith({ [name]: 'a' }, ['error']);
  });

  test('If validation fails and input was touched. Message should be shown', () => {
    const name = 'name';
    const wrapper = shallow(<TextInput name={name} valid={['Error']} onChange={jest.fn()}/>);
    expect(wrapper.hasClass(styles['state--error'])).toBeFalsy();
    expect(wrapper.containsMatchingElement(<span>Error</span>)).toBeFalsy();
    const input = wrapper.find(`input[name="${name}"]`);
    input.simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(wrapper.hasClass(styles['state--error'])).toBeTruthy();
    expect(wrapper.containsMatchingElement(<span>Error</span>)).toBeTruthy();
  });

  test('Should pass all props to input except listed in propTypes', () => {
    const wrapper = shallow(<TextInput name='name' label='foo' bar='baz' onChange={jest.fn()}/>);
    const input = wrapper.find('input[name="name"]');
    expect(input.prop('bar')).toEqual('baz');
    expect(input.prop('label')).not.toEqual('foo');
  });
});
