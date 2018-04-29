import React from 'react';
import { shallow } from 'enzyme';
import Media from './index';

describe('<Media/>', () => {
  const error = jest.spyOn(console, 'error');
  const onLoad = jest.spyOn(Media.prototype, 'onLoad');
  const onError = jest.spyOn(Media.prototype, 'onError');

  beforeEach(() => {
    error.mockReset();
  });

  test('Should render Figure component, place src of a image as background of root and create Image element with onLoad and onError handlers', () => {
    const src = 'https://bo.pb.ua/resources/images/content/advantages/2.png';
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Media src={src} alt={alt} />);
    const image = wrapper.find('img');
    expect(wrapper.type()).toEqual('figure');
    expect(wrapper.prop('style').backgroundImage).toEqual(expect.stringContaining(src));
    expect(image.prop('src')).toEqual(src);
    expect(image.prop('alt')).toEqual(alt);
    expect(image.prop('onError')).toBeInstanceOf(Function);
    expect(image.prop('onLoad')).toBeInstanceOf(Function);
  });

  test('Should pass props to root Figure element', () => {
    const value = 'some';
    const src = 'https://bo.pb.ua/resources/images/content/advantages/2.png';
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Media src={src} alt={alt} data-some={value} />);
    expect(wrapper.prop('data-some')).toEqual(value);
  });

  test('Should render error placeholder image encountered error during loading. If [onError] prop is function - it should be invoked with [src] argument', () => {
    const onError = jest.fn();
    const src = 'https://bo.pb.ua/resources/images/content/advantages/2.png';
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Media src={src} alt={alt} onError={onError} />);
    wrapper.find('img').simulate('error');
    expect(wrapper.state('state')).toEqual('error');
    expect(wrapper.find('.error-message').length).toEqual(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith(src);
  });

  test('Should render error placeholder [isBroken] is set', () => {
    const src = 'https://bo.pb.ua/resources/images/content/advantages/2.png';
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Media src={src} alt={alt} isBroken />);
    expect(wrapper.find('.error-message').length).toEqual(1);
  });

  test('Should forse providing [src] property to load media', () => {
    shallow(<Media alt='Ihor Koptielov' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('src', 'Image'));
  });

  test('Should forse providing [alt] function to handle aria', () => {
    shallow(<Media src='https://bo.pb.ua/resources/images/content/advantages/2.png' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('alt', 'Image'));
  });

  test('Should have state loading being positive, untill [onLoad] method will be fired on image.load event', () => {
    const src = 'https://bo.pb.ua/resources/images/content/advantages/2.png';
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Media src={src} alt={alt} isBroken />);
    expect(wrapper.state('state')).toEqual('loading');
    wrapper.find('img').simulate('load');
    expect(wrapper.state('state')).toEqual(false);
  });

  test('Should reset component state if [src] of an image will change', () => {
    const src = ['https://bo.pb.ua/resources/images/content/advantages/2.png', 'https://bo.pb.ua/resources/images/content/advantages/3.png'];
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Media src={src[0]} alt={alt} />);
    expect(wrapper.state('state')).toEqual('loading');
    wrapper.find('img').simulate('load');
    expect(wrapper.state('state')).toEqual(false);
    wrapper.setProps({src: src[1]});
    expect(wrapper.state('state')).toEqual('loading');
  })

});
