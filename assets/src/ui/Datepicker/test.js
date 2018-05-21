import { Component } from 'react';
import { shallow, mount } from 'enzyme';
import Datepicker from './index';
import Datetime from 'react-datetime';
import TextInput from '../TextInput';

describe('<Datepicker/>', () => {

  test('Should render default input component', () => {
    const wrapper = mount(<Datepicker name='name' onChange={jest.fn()} />);
    expect(wrapper.containsMatchingElement(<TextInput name='name' />)).toBeTruthy();
  })

  test('Should split format property and provide correct [dateFormat] and [timeFormat]', () => {
    const wrapper = mount(<Datepicker name='name' format='YYYY-MM-DD HH:mm:ss' onChange={jest.fn()} />);
    const picker = wrapper.find(Datetime);
    expect(picker.prop('dateFormat')).toEqual('YYYY-MM-DD');
    expect(picker.prop('timeFormat')).toEqual('HH:mm:ss');
  })
})