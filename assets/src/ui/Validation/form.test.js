import React from 'react';
import { shallow, mount } from 'enzyme';
import { Form } from './Form';
import TargetElement from './target.element';

function createConfig(Wp) {
  Wp.instance().updatePosition({
    key: 'name',
    valid: true
  });
  Wp.instance().updatePosition({
    key: 'email',
    valid: true
  });
  Wp.instance().updatePosition({
    key: 'password',
    valid: true
  });
  Wp.instance().updatePosition({
    key: 'password2',
    valid: true
  });
}

describe('Testing [Validation Form HOC] rendering child component', () => {
  let Wrapper = null;
  const onValidation = jest.fn();

  beforeAll(() => {
    const Target = Form(TargetElement);
    jest.spyOn(Target.prototype, 'getChildContext');
    Wrapper = mount(<Target onValidation={onValidation} exposeRaw action='some.php' method='post' />, { lifecycleExperimental: true });
  });

  test('Should render child component', () => {
    expect(Wrapper.find(TargetElement)).toHaveLength(1);
  });

  test('Should register [updatePosition, createPosition] context methods', () => {
    expect(Wrapper.instance().getChildContext).toHaveBeenCalledTimes(1);
  });

  test('Should pass props to child component', () => {
    expect(Wrapper.find(TargetElement).prop('action')).toEqual('some.php');
    expect(Wrapper.find(TargetElement).prop('method')).toEqual('post');
  });

  test('Should consume and prevent passing HOC options [onValidation, exposeRaw]', () => {
    expect(Wrapper.find(TargetElement).prop('onValidation')).toBeUndefined();
    expect(Wrapper.find(TargetElement).prop('exposeRaw')).toBeUndefined();
  });

  test('Should provide [valid=false] by default prop and [validationState] if [exposeRaw] option provided', () => {
    expect(Wrapper.find(TargetElement).prop('valid')).toEqual(false);
    expect(Wrapper.find(TargetElement).prop('validationState')).toMatchObject({});
  });
});

describe('Testing [Validation Form HOC] creating config', () => {
  let Wrapper = null;

  beforeAll(() => {
    const Target = Form(TargetElement);
    Wrapper = shallow(<Target />);
    createConfig(Wrapper);
  });

  test('Form component [updatePosition] method may be called number of times creating initial state', () => {
    expect(Wrapper.update().state('valid')).toMatchObject({
      name: true,
      email: true,
      password: true,
      password2: true
    });
  });
});

describe('Testing [Validation Form HOC] update reactions', () => {
  let Wrapper = null;
  const onValidation = jest.fn();

  beforeAll(() => {
    const Target = Form(TargetElement);
    Wrapper = shallow(<Target onValidation={onValidation} />);
    createConfig(Wrapper);
  });

  test('Form valid if all state keys are [true]', () => {
    expect(Wrapper.update().state('valid')).toMatchObject({
      name: true,
      email: true,
      password: true,
      password2: true
    });
    expect(Wrapper.update().find(TargetElement).prop('valid')).toEqual(true);
  });

  test('Form validation state may be changed by using [updatePosition] method', () => {
    Wrapper.update().instance().updatePosition({
      key: 'name',
      valid: ['error']
    });
    expect(Wrapper.update().state('valid')).toHaveProperty('name', ['error']);
  });

  test('Form invalid if at least one state key is [Array[message]]', () => {
    expect(Wrapper.update().state('valid')).toHaveProperty('name', ['error']);
    expect(Wrapper.update().find(TargetElement).prop('valid')).toEqual(false);
  });

  test('Form validation key may be removed by using [updatePosition] method with [valid=undefined]', () => {
    Wrapper.update().instance().updatePosition({
      key: 'email',
      valid: undefined
    });
    expect(Wrapper.update().state('valid').email).toBeUndefined();
  });
});
