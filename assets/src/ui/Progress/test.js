import { Component } from 'react';
import { shallow } from 'enzyme';
import Progress, { BUFFER } from './index';
import RadialLoading from './radial';

describe('<Progress/>', () => {

  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockReset();
  })

  test('Should render children it wraps if [loading=false]', () => {
    const wrapper = shallow(<Progress><div foo='bar'>content</div></Progress>);
    expect(wrapper.containsMatchingElement(<div foo='bar'>content</div>)).toBeTruthy();
  })

  test('Should forse providing [type] property to radial or linear only', () => {
    shallow(<Progress type='fake'><div foo='bar'>content</div></Progress>);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('type', 'Progress'));
  })

  test(`Should switch state to loading in ${BUFFER}ms after [loading] is provided as true`, (done) => {
    const wrapper = shallow(<Progress><div foo='bar'>content</div></Progress>);
    expect(wrapper.state('loading')).toEqual(false);
    wrapper.setProps({loading: true})
    setTimeout(() => {
      expect(wrapper.state('loading')).toEqual(true);
      done();
    }, BUFFER);
  })
  
  test(`Should not switch state to loading if [loading] switched back faster than ${BUFFER}ms`, () => {
    const wrapper = shallow(<Progress><div foo='bar'>content</div></Progress>);
    expect(wrapper.state('loading')).toEqual(false);
    wrapper.setProps({loading: true});
    expect(wrapper.state('loading')).toEqual(false);
    wrapper.setProps({loading: false});
  })

  test('Should generate automatic % of [value] if [value=auto]', (done) => {
    const wrapper = shallow(<Progress><div foo='bar'>content</div></Progress>);
    expect(wrapper.state('value')).toEqual(0);
    wrapper.setProps({loading: true})
    setTimeout(() => {
      expect(wrapper.state('value')).toBeGreaterThan(0);
      done();
    }, 1000);
  })

  test('Should pass other props to Loading component, for example [text] prop', (done) => {
    const wrapper = shallow(<Progress text='Abracadabra' loading><div foo='bar'>content</div></Progress>);
    setTimeout(() => {
      expect(wrapper.find(RadialLoading).prop('text')).toEqual('Abracadabra');
      done();
    }, 350);
  })

  test('Should replace text $p in [text] prop with value', (done) => {
    const wrapper = shallow(<Progress text='Abracadabra $p' value='10' loading><div foo='bar'>content</div></Progress>);
    setTimeout(() => {
      expect(wrapper.html()).toContain('Abracadabra 10');
      done()
    }, BUFFER);
  })
})
