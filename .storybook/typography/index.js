import React from 'react';
import {storiesOf} from '@storybook/react';

import {colors} from './_colors.scss';

storiesOf('Global Elements', module)
  .add('Colors', () => (
    <div className='colors'>
      <span className='primary'><span className='lighten'></span><span className='lighten2'></span></span>
      <span className='secondary'><span className='darken2'></span><span className='darken'></span></span>
      <span className='accent'><span className='darken'></span><span className='lighten'></span></span>
      <span className='accent-sec'><span className='darken'></span><span className='lighten'></span></span>
      <span className='states'>
        <span className='error'></span>
        <span className='warning'></span>
        <span className='success'></span>
        <span className='info'></span>
      </span>
    </div>
  ))
  .add('Typography', () => (
    <div>
      <h1>30px Font size H1 Lorem ipsum dolor sit amet.</h1>
      <h2>26px Font size H2 Lorem ipsum dolor sit amet.</h2>
      <h3>22px Font size H3 Lorem ipsum dolor sit amet.</h3>
      <h4>18px Font size H4 Lorem ipsum dolor sit amet.</h4>
      <h5>16px Font size H5 Lorem ipsum dolor sit amet.</h5>
      <h6>14px Font size H6 Lorem ipsum dolor sit amet.</h6>
      <p>Default text have 13px. Lorem, <a href="">[Default text URL link]</a> ipsum dolor sit amet consectetur adipisicing elit. <b>[Bold text]</b> Lorem <strong>[Strong text]</strong> ipsum dolor sit amet. Repellendus nemo nisi autem praesentium voluptatum <i>[italic text]</i> sed facilis <em>[em tag italic]</em> dolor quam voluptatem pariatur odio mollitia voluptates, architecto quibusdam aut neque velit repudiandae necessitatibus, veritatis, fuga assumenda optio facere dolorem at. Cum, enim asperiores.</p>
      <ol>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dicta consequatur.</li>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dicta consequatur.</li>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, dicta consequatur.</li>
      </ol>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores <sub>sub text</sub> consequuntur <sup>sup text</sup> beatae enim totam voluptates optio omnis accusamus, molestias deleniti, est possimus at fuga qui officia neque cumque, repudiandae velit quibusdam in iusto. Iste molestiae a id consequuntur consequatur molestias minima.</p>
      <ul>
        <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste, eos.</li>
        <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste, eos.</li>
        <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste, eos.</li>
      </ul>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. <abbr title="Some abbreviation">[Abbr tag]</abbr> Nobis deserunt eum iste at quia architecto alias modi officiis eaque corporis optio, laudantium ipsa voluptates esse voluptatibus recusandae pariatur. Optio voluptatum dignissimos eius commodi nam alias.</p>
      <blockquote>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est odit ipsum itaque blanditiis nam amet dicta beatae earum et ut!
      </blockquote>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque, fuga! Sapiente dolor vero rerum perspiciatis molestiae doloremque aut eligendi, esse alias ad <mark>[Mark tag]</mark> quisquam voluptatum soluta adipisci nobis. Provident, neque in cupiditate quidem quae incidunt similique omnis? Itaque iusto asperiores dignissimos eaque delectus!</p>
    </div>
  ))
  .add('Badges', () => (
    <ol>
      <li key='-2'><samp>badge</samp> - simple badge</li>
      <li key='-1'>Status colors<hr/></li>
      {['error', 'warning', 'success', 'info'].map((itm, i) => (
        <li key={i}><samp className={itm}>badge</samp> - {itm} styled badge</li>
      ))}
      <li key='-3'>Accent colors<hr/></li>
      {['accent', 'accent-sec'].map((itm, i) => (
        <li key={i}><samp className={itm}>badge</samp> - {itm} styled badge</li>
      ))}
      <li key='-4'>Feeds colors<hr/></li>
      {['html', 'rss', 'facebook', 'reddit', 'twitter'].map((itm, i) => (
        <li key={i}><samp className={itm}>badge</samp> - {itm} styled badge</li>
      ))}
    </ol>
  ))
  .add('Table', () => (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Ihor Koptielov</td>
          <td>last.day@gmail.com</td>
          <td>active</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Andrew Koptielov</td>
          <td>last.evening@gmail.com</td>
          <td>inactive</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Jacob Koptielov</td>
          <td>last.morning@gmail.com</td>
          <td>active</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Serg Koptielov</td>
          <td>last.night@gmail.com</td>
          <td>active</td>
        </tr>
      </tbody>
    </table>
  ))
  .add('Embeded', () => (
    <div>
      <figure>
        <img style={{width: '250px'}} src="https://react-md.mlaursen.com/304b1cb39d4acefcf7310d66dd4a6a30.svg" alt="Material design" />
        <figcaption>Material design fundamentals</figcaption>
      </figure>
      <pre>
{`TextInput.defaultProps = {
  type: 'text',
  value: '',
  label: '',
  pristine: true,
  valid: true
};`}
      </pre>
    </div>
  ))