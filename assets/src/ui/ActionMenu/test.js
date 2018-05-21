import { Component } from 'react';
import { shallow } from 'enzyme';
import ActionMenu from './index';


describe('<ActionMenu/>', () => {
  const error = jest.spyOn(console, 'error');
  let data = [];

  beforeEach(() => {
    error.mockReset();
    data = [{
      label: 'Manage feeds',
      handler: jest.fn()
    }, {
      label: 'Edit item',
      handler: jest.fn()
    }, '---', {
      label: 'Delete item',
      icon: 'trash',
      handler: jest.fn()
    }];
  })

  test('Should render Action menu component contents', () => {
    const wrapper = shallow(<ActionMenu data={data} />);
    expect(wrapper.find('a').length).toEqual(data.length - 1);
    expect(wrapper.find('hr').length).toEqual(1);
  })

  test('Should pass all props to Action menu except listed in propTypes', () => {
    const wrapper = shallow(<ActionMenu name='name' label='foo' bar='baz' data={data} />);
    expect(wrapper.prop('name')).toEqual('name');
    expect(wrapper.prop('bar')).toEqual('baz');
    expect(wrapper.prop('label')).toEqual('foo');
  })
})
