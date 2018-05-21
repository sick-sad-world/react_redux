import { Component } from 'react';
import { shallow, mount } from 'enzyme';
import Modal, { ModalHeader, ModalFooter } from './index';

describe('<Modal/>', () => {
  const error = jest.spyOn(console, 'error');
  const body = global.document.querySelector('body');
  const modalRoot = global.document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  body.appendChild(modalRoot);
  let wrapper = null;

  beforeEach(() => {
    error.mockReset();
  })

  afterEach(() => {
    wrapper.unmount();
  })

  test('Should render <Overlay> and <Modal> elements, into target element found in DOM,', () => {
    wrapper = mount(<Modal key='test' open>Content</Modal>);
    expect(wrapper.childAt(0).children().length).toEqual(2);
    expect(wrapper.find('.overlay').length).toEqual(1);
    expect(wrapper.find('.Modal--root').length).toEqual(1);
    expect(modalRoot.querySelector('.Modal--root')).toBeTruthy();
    expect(modalRoot.querySelector('.overlay')).toBeTruthy();
  })

  test('[children] acts as content of Modal window', () => {
    wrapper = mount(<Modal key='test' open><span foo='data'>Content</span></Modal>);
    expect(wrapper.containsMatchingElement(<span foo='data'>Content</span>)).toBeTruthy();
  })

  test('Should throw an Error if Target is not found', () => {
    expect(() => {
      mount(<Modal target={null}>Some body</Modal>);
      expect(error).toHaveBeenCalledTimes(2);
      expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('target', 'Modal'));
    }).toThrow();
  })

  test('Should pass all props to <modal/> except listed in proptypes', () => {
    wrapper = mount(<Modal key='test' foo='foo' bar='bar'>Content</Modal>);
    expect(wrapper.prop('key')).not.toEqual('test');
    expect(wrapper.prop('foo')).toEqual('foo');
    expect(wrapper.prop('bar')).toEqual('bar');
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