import { Component } from 'react';
import { shallow } from 'enzyme';
import Fieldset from './index';

describe('<Fieldset/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render children inside div.content-body element', () => {
    const wrapper = shallow(<Fieldset title='bla'><div foo='bar'>content</div></Fieldset>);
    expect(wrapper.containsMatchingElement(<div foo='bar'>content</div>)).toBeTruthy();
  })

  test('Should intercept and render Error property', () => {
    const error = ['ab','cd'];
    const wrapper = shallow(<Fieldset title='bla' error={error}><div foo='bar'>content</div></Fieldset>);
    expect(wrapper.containsMatchingElement('ab, cd')).toBeTruthy();
  })

  test('Should handle children visibility through [state--open] class on root element', () => {
    const wrapper = shallow(<Fieldset title='bla' collapsable><div foo='bar'>content</div></Fieldset>);
    expect(wrapper.hasClass('state--open')).toBeFalsy();
    wrapper.find('legend').simulate('click');
    expect(wrapper.hasClass('state--open')).toBeTruthy();
    wrapper.find('legend').simulate('click');
    expect(wrapper.hasClass('state--open')).toBeFalsy();
  })

  test('Should forse open state through [open] property', () => {
    const wrapper = shallow(<Fieldset title='bla' collapsable open><div foo='bar'>content</div></Fieldset>);
    expect(wrapper.hasClass('state--open')).toBeTruthy();
    wrapper.find('legend').simulate('click');
    expect(wrapper.hasClass('state--open')).toBeFalsy();
  })

  test('Should forse providing [title] property', () => {
    shallow(<Fieldset><div foo='bar'>content</div></Fieldset>);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('title', 'Fieldset'));
  })

})
