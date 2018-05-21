import { Component } from 'react';
import { shallow } from 'enzyme';
import TagList from './index';
import Image from '../Image';
import Badge from '../Badge';
import Icon from '../Icon';

const content = [{
  id: 1,
  value: 'Some'
}, {
  id: 2,
  prefix: <Icon g='bell' />,
  value: 'List Item'
}, {
  id: 3,
  value: 'Assigned'
}, {
  id: 4,
  prefix: <Image src='https://picsum.photos/200' alt='Some' />,
  value: 'Ihor Koptielov'
}, {
  id: 5,
  prefix: <Badge theme='accent' value='123' />,
  value: 'List of Tags'
}, {
  id: 6,
  value: 'Cool item'
}];

describe('<TagList/>', () => {
  const error = jest.spyOn(console, 'error');

  beforeEach(() => {
    error.mockClear();
  })

  test('Should render <li> component for each data entry given', () => {
    const wrapper = shallow(<TagList data={content} />);
    expect(wrapper.find('li').length).toEqual(content.length);
  })

  test('Should render Error state instead of data if error is provided', () => {
    const wrapper = shallow(<TagList data={content} error={<b>THIS LIST</b>} />);
    expect(wrapper.containsMatchingElement(<b>THIS LIST</b>)).toBeTruthy();
  })

  test('Should render empty message if data length == 0', () => {
    const wrapper = shallow(<TagList data={[]} empty='Empty' />);
    expect(wrapper.containsMatchingElement(<li>Empty</li>)).toBeTruthy();
  })

  test('Should render Prefix as it given, String or Element', () => {
    const wrapper = shallow(<TagList data={content} />);
    expect(wrapper.containsMatchingElement(content[1].prefix)).toBeTruthy();
    expect(wrapper.containsMatchingElement(content[3].prefix)).toBeTruthy();
    expect(wrapper.containsMatchingElement(content[4].prefix)).toBeTruthy();
  })

  test('Should pass all props <ul> except listed in propTypes', () => {
    const fn = jest.fn();
    const wrapper = shallow(<TagList data={content} label='foo' bar='baz' onClick={fn} />);
    expect(wrapper.prop('bar')).toEqual('baz');
    expect(wrapper.prop('label')).toEqual('foo');
    expect(wrapper.prop('onClick')).not.toEqual(fn);
  })
})
