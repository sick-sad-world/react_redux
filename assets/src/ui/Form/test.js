import React from 'react';
import { shallow } from 'enzyme';
import Form from './Form';
import { wrap } from 'module';

describe('<Form/>', () => {

  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockClear();
  })

  test('Should render <form/> element, and render children as a function with values given, and bindInput function', () => {
    const onSubmit = jest.fn();
    const children = jest.fn();
    const values = {a: 1};
    const wrapper = shallow(<Form values={values} onSubmit={onSubmit}>{children}</Form>);
    expect(wrapper.is('form')).toBeTruthy();
    expect(children).toHaveBeenCalledTimes(1);
    expect(children.mock.calls[0][0].valid).toBeTruthy();
    expect(children.mock.calls[0][0].values).toMatchObject(values)
    expect(children.mock.calls[0][0].bindInput).toBeInstanceOf(Function);
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
    expect(bind.onChange).toBeInstanceOf(Function);
    bind.onChange({name: 1});
    expect(wrapper.state('values').name).toEqual(1);
  })
})
