import React from 'react';
import { shallow } from 'enzyme';
import Modal, { ModalHeader, ModalFooter } from './index';

describe('<Modal/>', () => {
  const error = jest.spyOn(console, 'error');
  const modalRoot = global.document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  const body = global.document.querySelector('body');
  body.appendChild(modalRoot);

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render <Overlay> and <Modal> elements, into target element found in DOM', () => {

  })

  test('[children] acts as content of Modal window', () => {

  })

  test('Should throw an Error if Target is not found', () => {

  })

  test('Should enforce providing [target] property', () => {

  })

  test('Should pass all props to <header/> except listed in proptypes', () => {

  })

})

describe('<ModalHeader/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render <header/> element with [title] given', () => {
    const title = 'Some title';
    const wrapper = shallow(<ModalHeader title={title} onClose={jest.fn()} />);
    expect(wrapper.find(`[children="${title}"]`).length).toEqual(1)
  })

  test('Should enforse providing [title] prop', () => {
    shallow(<ModalHeader onClose={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('title', 'ModalHeader'));
  })

  test('Should enforce providing [onClose] prop', () => {
    shallow(<ModalHeader title='Some' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onClose', 'ModalHeader'));
  })

  test('Should render children, if provided', () => {
    const additional = <div foo='bar'>some</div>;
    const wrapper = shallow(<ModalHeader title='some title' onClose={jest.fn()}>{additional}</ModalHeader>);
    expect(wrapper.containsMatchingElement(additional)).toBeTruthy()
  })

  test('Should pass all props to <header/> except listed in proptypes', () => {
    const title = 'Some title';
    const foo = 'foo';
    const bar = 'bar';
    const wrapper = shallow(<ModalHeader title={title} foo={foo} bar={bar} onClose={jest.fn()} />);
    expect(wrapper.prop('foo')).toEqual(foo);
    expect(wrapper.prop('bar')).toEqual(bar);
    expect(wrapper.prop('title')).not.toEqual(title);
  })

})

describe('<ModalFooter/>', () => {
  
  test('Should render children, if provided', () => {
    const additional = <div foo='bar'>some</div>;
    const wrapper = shallow(<ModalFooter title='some title' onClose={jest.fn()}>{additional}</ModalFooter>);
    expect(wrapper.containsMatchingElement(additional)).toBeTruthy()
  })

  test('Should pass all props to <header/> except listed in proptypes', () => {
    const foo = 'foo';
    const bar = 'bar';
    const additional = <div foo='bar'>some</div>;
    const wrapper = shallow(<ModalFooter foo={foo} bar={bar}>{additional}</ModalFooter>);
    expect(wrapper.prop('foo')).toEqual(foo);
    expect(wrapper.prop('bar')).toEqual(bar);
  })

})