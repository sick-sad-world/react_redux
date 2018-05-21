import { Component } from 'react';
import { shallow } from 'enzyme';
import Image from './index';

describe('<Image/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockClear();
  })

  test('Should render Image component', () => {
    const wrapper = shallow(<Image src='https://bo.pb.ua/resources/images/content/advantages/2.png' alt='Ihor Koptielov' />);
    expect(wrapper.type()).toEqual('img');
  })

  test('Should place specific class if image should be rounded', () => {
    const wrapper = shallow(<Image rounded src='https://bo.pb.ua/resources/images/content/advantages/2.png' alt='Ihor Koptielov' />);
    expect(wrapper.hasClass('style--rounded')).toBeTruthy();
  })

  test('Should pass props to image element', () => {
    const value = 'some';
    const src = 'https://bo.pb.ua/resources/images/content/advantages/2.png';
    const alt = 'Ihor Koptielov';
    const wrapper = shallow(<Image src={src} alt={alt} data-some={value} />);
    expect(wrapper.prop('data-some')).toEqual(value);
    expect(wrapper.prop('src')).toEqual(src);
    expect(wrapper.prop('alt')).toEqual(alt);
  })

  test('Should forse providing [src] property to load media', () => {
    shallow(<Image alt='Ihor Koptielov' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('src', 'Image'));
  })

  test('Should forse providing [alt] function to handle aria', () => {
    shallow(<Image src='https://bo.pb.ua/resources/images/content/advantages/2.png' />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('alt', 'Image'));
  })

  test('Should apply DOM event handlers to image', () => {
    const onClick= jest.fn();
    const wrapper = shallow(<Image src='https://bo.pb.ua/resources/images/content/advantages/2.png' alt='Ihor Koptielov' onClick={onClick} />);
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  })
})
