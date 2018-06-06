import React from 'react';
import { mount, shallow } from 'enzyme';
import Assignment from './index';
import MOCK_DATA from './MOCK_DATA.json';

describe('<Assignment/>', () => {
  const error = jest.spyOn(console, 'error');
  const Item = jest.fn(({data, selected, dragHandleProps, onClick, className}) => (
    <div className={className} style={{color: (selected) ? 'red' : 'inherit', display: 'flex'}} onClick={onClick}>
      {dragHandleProps && <span {...dragHandleProps} />}
      <b>{data.type}</b>: {data.name}
    </div>
  ));

  beforeEach(() => {
    Item.mockClear();
    error.mockClear();
  })
  
  test('Should render complex cmponent containing two lists', () => {
    const wrapper = mount(<Assignment data={MOCK_DATA.slice(0, 10)} selected={[4,5,6]} onChange={jest.fn()} Item={Item} />);
    expect(Item).toHaveBeenCalledTimes(10 + 3);
    expect(wrapper.containsMatchingElement(Item)).toBeTruthy();
  })

  test('Should call [onChange] functon with proper Array(id) on item click', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Assignment data={MOCK_DATA.slice(0, 10)} selected={[4,5,6]} onChange={onChange} Item={Item} />);
    wrapper.find('.choises').find(Item).first().simulate('click');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({id: 1, selection: [1,4,5,6]})
  })

  test('Should allow to search among proposed options', () => {
    const wrapper = mount(<Assignment data={MOCK_DATA.slice(0, 10)} selected={[4,5,6]} onChange={jest.fn()} Item={Item} />);
    wrapper.find('.choises header input').simulate('change', {target: {value: 'type:html'}})
    expect(wrapper.find('.choises').find(Item)).toHaveLength(4);
  })

  test('Should preserve order of selected items', () => {
    const wrapper = mount(<Assignment data={MOCK_DATA.slice(0, 10)} selected={[4,5,6]} onChange={jest.fn()} Item={Item} />);
    expect(wrapper.state('selection').map(({id}) => id)).toEqual([4,5,6]);
  })

  test('Should forse providing [onChange] function to handle updates', () => {
    shallow(<Assignment data={MOCK_DATA.slice(0, 10)} selected={[4,5,6]} Item={Item} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Assignment'));
  })

  test('Should forse providing [Item] function to handle updates', () => {
    shallow(<Assignment data={MOCK_DATA.slice(0, 10)} selected={[4,5,6]} onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('onChange', 'Assignment'));
  })

  test('Should forse providing [data] function to handle updates', () => {
    shallow(<Assignment selected={[4,5,6]} Item={Item} onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('data', 'Assignment'));
  })

  test('Should forse providing [selected] function to handle updates', () => {
    shallow(<Assignment data={MOCK_DATA.slice(0, 10)} Item={Item} onChange={jest.fn()} />);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toMatch(global.getPropTypeWarningTester('selected', 'Assignment'));
  })

  test('Should pass all props to root div except listed in propTypes', () => {
    const onChange = jest.fn();
    const wrapper = shallow(<Assignment name='name' label='foo' bar='baz' data={MOCK_DATA.slice(0, 10)} Item={Item} onChange={onChange} />);
    expect(wrapper.prop('bar')).toEqual('baz');
    expect(wrapper.prop('label')).toEqual('foo');
    expect(wrapper.prop('name')).toEqual('name');
    expect(wrapper.prop('onChange')).not.toEqual(onChange)
  })
})
