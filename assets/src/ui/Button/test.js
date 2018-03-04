import React from 'react';
import { shallow } from 'enzyme';
import Button from './index';
import styles from './styles.scss';

describe('<Button/>', () => {
  test('Should render button element with children', () => {
    const wrapper = shallow(<Button>Text</Button>);
    expect(wrapper.matchesElement(<button>Text</button>)).toBeTruthy();
  });

  test('Should render <a/> element if [el] set to [link]', () => {
    const wrapper = shallow(<Button el='link'>Text</Button>);
    expect(wrapper.matchesElement(<a>Text</a>)).toBeTruthy();
  });

  test('Should render <input[type="button"]/> element if [el] set to [input]', () => {
    const wrapper = shallow(<Button el='input' value='Text' />);
    expect(wrapper.matchesElement(<input type='button' value='Text'/>)).toBeTruthy();
  });

  test('Should give proper class name based on [theme] prop', () => {
    const theme = 'warning';
    const wrapper = shallow(<Button theme={theme}>Text</Button>);
    expect(wrapper.hasClass(styles[theme])).toBeTruthy();
  });
});
