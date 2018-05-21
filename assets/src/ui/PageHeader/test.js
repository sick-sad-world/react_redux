import React from 'react';
import { shallow } from 'enzyme';
import PageHeader from './index';

describe('<PageHeader/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockClear();
  })

  test('Should render PageHeader component with given Title, Subtitle, and search field by default', () => {
    const title = 'Title';
    const subtitle = 'subtitle';
    const wrapper = shallow(<PageHeader title={title} subtitle={subtitle} onChnage={jest.fn()} />);
    expect(wrapper.containsMatchingElement(title)).toBeTruthy();
    expect(wrapper.containsMatchingElement(subtitle)).toBeTruthy();
    expect(wrapper.containsMatchingElement(<input type='text' />)).toBeTruthy();
  })

  test('When Search controls used, should invoke [onChange] function with {search} config as argument', () => {
    const title = 'Title';
    const onChange = jest.fn();
    const wrapper = shallow(<PageHeader title={title} onChange={onChange} />);
    const input = wrapper.find('input[name="search"]');
    input.value = 'some arg1:value arg2:value2';
    input.simulate('change', {target: input})
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatchObject({
      search: {
        'name': 'some',
        'arg1': 'value',
        'arg2': 'value2'
      }
    })
  })

  test('When Sort controls used, should invoke [onChange] function with {sort,group} config as argument, group options values starts with [group:] but never have bot valuse positive', () => {
    const title = 'Title';
    const onChange = jest.fn();
    const sort = [
      {value: 'id', label:'By Id'}, 
      {value: 'name', label: 'By name'}, 
      {value: 'recipient', label: 'By recipient'}, 
      {value: 'group:column', label: 'Group By Column'}
    ];
    const wrapper = shallow(<PageHeader title={title} onChange={onChange} sort={sort} />);
    wrapper.instance().onSort({sort: sort[0].value})
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatchObject({
      sort: 'id',
      group: null
    })
    wrapper.instance().onSort({sort: sort[3].value})
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0]).toMatchObject({
      sort: null,
      group: 'column'
    })
  })

  test('Should forse providing [title] property', () => {
    shallow(<PageHeader onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('title', 'PageHeader'));
  })

  test('Should forse providing [onChange] handler to handle updates', () => {
    shallow(<PageHeader title='Some' onChange={null} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'PageHeader'));
  })

  test('Should pass all props to root element except listed in propTypes', () => {
    const wrapper = shallow(<PageHeader raised title='Some' type='error' foo='bar' onChange={jest.fn()} />);
    expect(wrapper.prop('foo')).toEqual('bar');
    expect(wrapper.prop('raised')).toBeTruthy();
    expect(wrapper.prop('type')).toEqual('error');
    expect(wrapper.prop('title')).not.toEqual('Some');
  })
})