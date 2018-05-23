import set from 'lodash/set';
import React from 'react';
import { shallow } from 'enzyme';
import makeFormField from './index';

function Input(props) {
  return <input type='text' {...props} />;
}

describe('HOC: <FormField/>', () => {

  let TextField;

  const error = jest.spyOn(console, 'error');
  const mockedEvent = {
    persist: jest.fn(),
    target: {
      value: ''
    }
  }

  beforeEach(() => {
    TextField = makeFormField()(Input);
    error.mockClear();
    mockedEvent.persist.mockClear();
    mockedEvent.target.value = '';
  })

  test('Should render given component', () => {
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name='name' onChange={onChange} />);
    expect(wrapper.is(Input)).toBeTruthy();
  })

  test('Should not pass props listed in propTypes to child component except [name], []', () => {
    const wrapper = shallow(
      <TextField name='name' pristine valid label='foo' bar='baz' onChange={jest.fn()} onFocus={jest.fn()} onBlur={jest.fn()} />
    );
    expect(wrapper.first().prop('bar')).toEqual('baz');
    expect(wrapper.first().prop('label')).toEqual('foo');
    expect(jest.isMockFunction(wrapper.first().prop('onChange'))).toBeFalsy();
    expect(jest.isMockFunction(wrapper.first().prop('onFocus'))).toBeTruthy();
    expect(jest.isMockFunction(wrapper.first().prop('onBlur'))).toBeTruthy();
  })

  test('Should pass [value] to input', () => {
    const value = 'some';
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name='name' value={value} onChange={onChange} />);
    expect(wrapper.first().prop('value')).toEqual(value);
  })

  test('Should forse providing [name] property to handle updates', () => {
    const onChange = jest.fn();
    shallow(<TextField onChange={onChange} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('name', 'Input'));
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<TextField name='name' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Input'));
  })

  test('Should call [onChange] handler with proper data', () => {
    const name = 'name';
    const onChange = jest.fn();
    const wrapper = shallow(<TextField name={name} onChange={onChange} />);
    wrapper.first().simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ [name]: 'a' });
  })

  test('Should call [getValue] function with proper data', () => {
    const name = 'name';
    const onChange = jest.fn();
    const getValue = jest.fn(({target}, name) => ({ [name]: target.value }))
    const Field = makeFormField(getValue)(Input);
    const wrapper = shallow(<Field name={name} onChange={onChange} value='a' />);
    wrapper.first().simulate('change', set(mockedEvent, 'target.value', 'a'));
    expect(getValue).toHaveBeenCalledTimes(1);
    expect(getValue).toHaveBeenCalledWith(mockedEvent, {name, onChange, pristine: true, value: 'a'})
  })

  test('Should allow reassigning [pristine] from outside to [false] in order to mark whatever form was touched while field not, and prevent reassigning [pristine] from outside to [true]', () => {
    const name = 'name';
    const onChange = jest.fn();
    const getValue = jest.fn(({target}, name) => ({ [name]: target.value }))
    const Field = makeFormField(getValue)(Input);
    const wrapper = shallow(<Field name={name} onChange={onChange} value='a' prisitne={false} />);
    wrapper.setProps({ pristine: true });
    expect(wrapper.prop('pristine')).toBeFalsy();
  });

  test('Should throw an Error if rule not found in rules list', () => {
    expect(() => {
      const name = 'name';
      const onChange = jest.fn();
      const getValue = jest.fn(({target}, name) => ({ [name]: target.value }))
      const Field = makeFormField(getValue)(Input);
      shallow(<Field name={name} onChange={onChange} rules={['wrong']} value='a' prisitne={false} />);
    }).toThrowError(/wrong/);
  });

})


describe('Testing [Validation Element HOC] itself: its props, state, context action calling', () => {
  let Wrapper = null;
  
  function simUpdate(v) {
    Wrapper.instance().onChange({target: {value: v}});
  }

  const updatePosition = jest.fn();

  beforeAll(() => {
    const Field = makeFormField()(Input);
    const name = 'test';
    const onChange = jest.fn();
    Wrapper = shallow(<Field name={name} onChange={onChange} rules={['required']} value='a' />, {
      context: {
        updatePosition
      }
    });
  });

  afterEach(() => {
    updatePosition.mockClear();
  });

  test('Should call [updatePosition] once with [key] and [valid=Array|true] on initial rendering', () => {
    expect(updatePosition).toHaveBeenCalledTimes(1);
    expect(updatePosition).toBeCalledWith(expect.objectContaining({
      key: expect.stringContaining('test'),
      valid: true
    }));
  });

  test('Should have [pristine=true] by default and [valid=Array] if value is invalid', () => {
    expect(Wrapper.state('pristine')).toEqual(true);
    expect(Wrapper.state('valid')).toBeTruthy();
  });

  test('Should have [valid=true] if valid value providen', () => {
    simUpdate('good value');
    expect(Wrapper.state('valid')).toEqual(true);
  });

  test('Should have [updatePosition] to be called once with [key] and [valid] on value change', () => {
    simUpdate('anoter value');
    expect(updatePosition).toHaveBeenCalledTimes(1);
    expect(updatePosition).toBeCalledWith(expect.objectContaining({
      key: expect.stringContaining('test'),
      valid: true
    }));
  });

  test('Should call [updatePosition] once with [key] and [valid=undefined] on component unmount', () => {
    Wrapper.unmount();
    expect(updatePosition).toHaveBeenCalledTimes(1);
    expect(updatePosition).toBeCalledWith(expect.objectContaining({
      key: expect.stringContaining('test'),
      valid: undefined
    }));
  });
});
