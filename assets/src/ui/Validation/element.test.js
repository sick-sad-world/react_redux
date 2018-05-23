import React from 'react';
import { shallow } from 'enzyme';
import { Element } from './Element';
import TargetElement from './target.element';

function simUpdate(Wp, v) {
  Wp.find(TargetElement).prop('validate')(v);
}

describe('Testing [Validation Element HOC] rendering child component', () => {
  let Wrapper = null;

  beforeAll(() => {
    const Target = Element('required')(TargetElement);
    Wrapper = shallow(<Target value='good' name='test' valid={false} validate={false} />);
  });

  test('Should render child component', () => {
    expect(Wrapper.find(TargetElement)).toHaveLength(1);
  });

  test('Should pass props to child component', () => {
    expect(Wrapper.find(TargetElement).prop('value')).toEqual('good');
    expect(Wrapper.find(TargetElement).prop('name')).toEqual('test');
  });

  test('Should prevent reassigning reserved props [valid,validate] from outside', () => {
    expect(Wrapper.find(TargetElement).prop('valid')).toEqual(true);
    expect(Wrapper.find(TargetElement).prop('validate')).toBeInstanceOf(Function);
  });

  test('Should allow reassigning [pristine] from outside to [false] in order to mark whatever form was touched while field not', () => {
    Wrapper.setProps({ pristine: false });
    expect(Wrapper.find(TargetElement).prop('pristine')).toEqual(false);
  });

  test('Should prevent reassigning [pristine] from outside to [true]', () => {
    simUpdate(Wrapper, 'someval');
    Wrapper.setProps({ pristine: true });
    expect(Wrapper.prop('pristine')).toEqual(false);
  });

  test('Should throw an Error if rule not found in rules list', () => {
    expect(() => {
      Element('wrong')(TargetElement);
    }).toThrowError(/wrong/);
  });
});

describe('Testing [Validation Element HOC] itself: its props, state, context action calling', () => {
  let Wrapper = null;

  const updatePosition = jest.fn();
  const createPosition = jest.fn();

  beforeAll(() => {
    const Target = Element('required')(TargetElement);
    Wrapper = shallow(<Target value={null} name='test' valid={false} validate={false} />, {
      context: {
        updatePosition,
        createPosition
      }
    });
  });

  afterEach(() => {
    updatePosition.mockClear();
    createPosition.mockClear();
  });

  test('Should call [updatePosition] once with [key] and [valid=Array|true] on initial rendering', () => {
    expect(updatePosition).toHaveBeenCalledTimes(1);
    expect(updatePosition).toBeCalledWith(expect.objectContaining({
      key: expect.stringContaining('test'),
      valid: expect.any(Array)
    }));
  });

  test('Should have [pristine=true] by default and [valid=Array] if value is invalid', () => {
    expect(Wrapper.state('pristine')).toEqual(true);
    expect(Wrapper.state('valid')).toHaveLength(1);
  });

  test('Should have [valid=true] if valid value providen', () => {
    simUpdate(Wrapper, 'good value');
    expect(Wrapper.state('valid')).toEqual(true);
  });

  test('Should have [updatePosition] to be called once with [key] and [valid] on value change', () => {
    simUpdate(Wrapper, 'anoter value');
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
