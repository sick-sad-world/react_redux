import React from 'react';
import { shallow, mount } from 'enzyme';
import Form from './index';

describe('<Form/>', () => {

  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockClear();
  })

  test('Should render <form/> element, and render children as a function with values given, and bindInput function', () => {
    const wrapper = shallow(<Form onSubmit={jest.fn()}>{jest.fn()}</Form>);
    expect(wrapper.is('form')).toBeTruthy();
  })

  test('Should render children as a function with values given, and bindInput function', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const values = {a: 1};
    shallow(<Form values={values} onSubmit={onSubmit}>{children}</Form>);
    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenLastCalledWith(expect.objectContaining({
      valid: true,
      values: expect.objectContaining(values),
      bindInput: expect.any(Function)
    }))
  })

  test('Should register [getChildContext] context method', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const values = {a: 1};
    jest.spyOn(Form.prototype, 'getChildContext');
    const wrapper = mount(<Form values={values} onSubmit={onSubmit}>{children}</Form>, { lifecycleExperimental: true });
    expect(wrapper.instance().getChildContext).toHaveBeenCalledTimes(1);
  })

  test('Should enforce providing [children] of form component', () => {
    const onSubmit = jest.fn();
    shallow(<Form onSubmit={onSubmit} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('children', 'Form'));
  })

  test('Should enforce providing [onSubmit] of form component', () => {
    const children = jest.fn();
    shallow(<Form>{children}</Form>);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onSubmit', 'Form'));
  })

  test('Should pass all props to <form> except ones listed in prop-types', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const values = {a: 1};
    const wrapper = shallow(<Form values={values} foo='foo' bar='bar' action='action' onSubmit={onSubmit}>{children}</Form>);
    expect(wrapper.prop('foo')).toEqual('foo');
    expect(wrapper.prop('bar')).toEqual('bar');
    expect(wrapper.prop('action')).toEqual('action');
    expect(wrapper.prop('values')).toBeFalsy();
  })

  test('Should pass bindInput function that provides [value] and [onChange] function which update state of form correspondently', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const values = {a: 1};
    const wrapper = shallow(<Form values={values} onSubmit={onSubmit}>{children}</Form>);
    expect(children).toHaveBeenCalledTimes(1);
    const bindInput = children.mock.calls[0][0].bindInput;
    const bind = bindInput('name');
    expect(bind.value).toEqual(null);
    expect(bind.name).toEqual('name');
    expect(bind.onChange).toBeInstanceOf(Function);
    bind.onChange({name: 1});
    expect(wrapper.state('values').name).toEqual(1);
  })

  test('Running [updatePosition] wiil create an entry in <Form/> state. If all entries are valid - overall form is also valid', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const wrapper = shallow(<Form onSubmit={onSubmit}>{children}</Form>);
    wrapper.instance().updatePosition({
      key: 'name',
      valid: true
    });
    wrapper.instance().updatePosition({
      key: 'email',
      valid: true
    });
    wrapper.instance().updatePosition({
      key: 'password',
      valid: true
    });
    wrapper.instance().updatePosition({
      key: 'password2',
      valid: true
    });
    expect(wrapper.update().state('valid')).toMatchObject({
      name: true,
      email: true,
      password: true,
      password2: true
    });
    expect(children.mock.calls[children.mock.calls.length - 1][0].valid).toBeTruthy();
  })

  test('Running [updatePosition] wiil updates apropriate state entry. If at leas one of entries is invalid, then overall form invalid also', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const wrapper = shallow(<Form onSubmit={onSubmit}>{children}</Form>);
    wrapper.instance().updatePosition({
      key: 'name',
      valid: true
    });
    wrapper.instance().updatePosition({
      key: 'email',
      valid: true
    });
    wrapper.instance().updatePosition({
      key: 'email',
      valid: ['error']
    });
    wrapper.update().instance().updatePosition({
      key: 'email',
      valid: ['error']
    });
    expect(children.mock.calls[children.mock.calls.length - 1][0].valid).toBeFalsy();
  })

  test('Form validation key may be removed by using [updatePosition] method with [valid=undefined]', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const wrapper = shallow(<Form onSubmit={onSubmit}>{children}</Form>);
    wrapper.instance().updatePosition({
      key: 'name',
      valid: true
    });
    wrapper.update().instance().updatePosition({
      key: 'name',
      valid: undefined
    });
    expect(wrapper.update().state('valid').name).toBeUndefined();
  })

})
