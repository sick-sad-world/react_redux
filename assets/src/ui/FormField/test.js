import set from 'lodash/set';
import React from 'react';
import { shallow } from 'enzyme';
import makeFormField from './index';

describe('HOC: <FormField/>', () => {
  function Input(props) {
    return <input type='text' {...props} />;
  }

  let TextField;

  const error = jest.spyOn(console, 'error');
  const mockedEvent = {
    persist: jest.fn(),
    target: {
      value: ''
    }
  };

  beforeEach(() => {
    TextField = makeFormField()(Input);
    error.mockReset();
    mockedEvent.persist.mockReset();
    mockedEvent.target.value = '';
  });

  test('Should render given component', () => {
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name='name' onChange={onChange} />);
    expect(wrapper.is(Input)).toBeTruthy();
  });

  test('Should not pass props listed in propTypes to child component except [name], []', () => {
    const wrapper = shallow(
      <TextField name='name' pristine valid label='foo' bar='baz' validate={jest.fn()} onChange={jest.fn()} onFocus={jest.fn()} onBlur={jest.fn()} />
    );
    expect(wrapper.first().prop('bar')).toEqual('baz');
    expect(wrapper.first().prop('label')).toEqual('foo');
    expect(wrapper.first().prop('pristine')).not.toEqual(true);
    expect(wrapper.first().prop('valid')).not.toEqual(true);
    expect(wrapper.first().prop('validate')).toBeUndefined();
    expect(jest.isMockFunction(wrapper.first().prop('onChange'))).toBeFalsy();
    expect(jest.isMockFunction(wrapper.first().prop('onFocus'))).toBeFalsy();
    expect(jest.isMockFunction(wrapper.first().prop('onBlur'))).toBeFalsy();
  });

  test('Should pass [value] to input', () => {
    const value = 'some';
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name='name' value={value} onChange={onChange} />);
    expect(wrapper.first().prop('value')).toEqual(value);
  });

  test('Should forse providing [name] property to handle updates', () => {
    const onChange = jest.fn();
    shallow(<TextField onChange={onChange} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'Input'));
  });

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<TextField name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Input'));
  });

  test('Should toggle [focused] state and Call [onFocus/onBlur] callbacks if provided', () => {
    const name = 'name';
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const wrapper = shallow(<TextField name={name} onChange={jest.fn()} onFocus={onFocus} onBlur={onBlur} />);
    wrapper.first().simulate('focus', mockedEvent);
    expect(wrapper.state('focus')).toBeTruthy();
    wrapper.first().simulate('blur', mockedEvent);
    expect(wrapper.state('focus')).toBeFalsy();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('Should call [onChange] handler with proper data', () => {
    const name = 'name';
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name={name} onChange={onChange} />);
    wrapper.first().simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ [name]: 'a' }, true);
  });

  test('Should call [getValue] function with proper data', () => {
    const name = 'name';
    const onChange = jest.fn();
    const getValue = jest.fn(({target}, name) => ({ [name]: target.value }))
    const Field = makeFormField(getValue)(Input);
    const wrapper = shallow(<Field name={name} onChange={onChange} value='a' />);
    wrapper.first().simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(getValue).toHaveBeenCalledTimes(1);
    expect(getValue).toHaveBeenCalledWith(mockedEvent, {name, onChange, value: 'a'});
  });

  test('Should call [validate] function with proper data and pass result to [onChange] func', () => {
    const name = 'name';
    const validate = jest.fn(() => ['error']);
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name={name} validate={validate} onChange={onChange} />);
    wrapper.first().simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith({ [name]: 'a' });
    expect(onChange).toHaveBeenCalledWith({ [name]: 'a' }, ['error']);
  });

  test('If validation fails and input was touched. Message should be shown', () => {
    const name = 'name';
    const wrapper = shallow(<TextField name={name} valid={['Error']} onChange={jest.fn()} />);
    expect(wrapper.first().prop('error')).toBeFalsy();
    wrapper.setProps({ pristine: false, validate: jest.fn() });
    expect(wrapper.first().prop('error')).toEqual('Error');
  });
});
