// Import utility stuff
// ===========================================================================
import { includes, bindAll, filter } from 'lodash';
import { formatNumber, sortParamToShort } from '../helpers/functions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import LazyLoad from 'react-lazy-load';
import Icon from './icon';

// Main app screen - Dashboard
// ===========================================================================
class Result extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      fulltext: false
    }

    bindAll(this, 'checkDisplay', 'toggleFullText')
  }

  checkDisplay (stat) {
    let value = this.props[stat];
    return includes(this.props.display_settings, stat) && ((typeof value === 'string' && value.length) || (typeof value === 'number' && value >= 0));
  }

  toggleFullText (e) {
    e.preventDefault();
    this.setState({fulltext: !this.state.fulltext});
  }

  render() {
    let props = this.props;
    let display = props.display_settings;
    let isWideImage = includes(display, 'wide_image');
    let tableRows = filter(this.props.tableStats, this.checkDisplay);
    return (
      <li>
        <article className='mod-result'>
          <aside>
            <span className='badge comparator'>
              <b>{(props.sort === 'found') ? 'Found' : formatNumber(props[props.sort])}</b>
              { sortParamToShort(props.sort) }
            </span>
            {/*<a onClick={props.makeAction('refresh', {hash: props.hash})} title='Refresh this result'>
              <Icon icon='cw' />
            </a>
            <a onClick={props.makeAction('favorite', {hash: props.hash, unfavorite: props.favorite})} title={props.favoriteBtndata[props.favorite].title}>
              <Icon icon={props.favoriteBtndata[props.favorite].icon} />
            </a>
            <a onClick={props.makeAction('ignore', {hash: props.hash, unignore: props.ignore})} title={props.ignoreBtndata[props.ignore].title}>
              <Icon icon={props.ignoreBtndata[props.ignore].icon} />
            </a>*/}
          </aside>
          <div className='content'>
            <header>
              { (this.checkDisplay('title')) ? <h1><a href={props.url} target='_blank'>{props.title}</a></h1> : null }
              { (this.checkDisplay('url')) ? <small className='t-ellipsis'>Found at: <a target='_blank' href={props.url}>{props.url}</a></small> : null }
              <small className='t-ellipsis'>
                { (this.checkDisplay('found')) ? <span>On: <b><time dateTime={props.found}>{props.found}</time></b></span> : null }
                { (this.checkDisplay('author')) ? <span>by: <b>{props.Author}</b></span> : null }
              </small>
            </header>
            { (this.checkDisplay('image')) ? (
              <figure className={(isWideImage) ? 'is-wide' : null}>
                <LazyLoad>
                  <img src={props.image} />
                </LazyLoad>
                { (isWideImage) ? <figcaption>{props.title}</figcaption> : null }
              </figure>
            ) : null }
            { (this.checkDisplay('description')) ? (
              <div className='descr'>
                <div className='summary'>{ props.description }</div>
                { (props.additional.length) ? <a className="btn-toggle-text" onClick={null}> Show full text</a> : null }
                {(this.state.fulltext && props.additional.length) ? <div className='full'>{props.additional}</div> : null }
              </div>
            ) : null }
            <footer>
              { (tableRows.length) ? (
                <table>
                  <tbody>
                    <tr>
                      <th>Measure</th>
                      <th>Total</th>
                      <th>Rate</th>
                      <th>Maxrate</th>
                      <th>Hotness</th>
                    </tr>
                    { tableRows.map((stat) => {
                      return (
                        <tr key={stat}>
                          <td><b>{stat}</b></td>
                          <td>{ props[stat] }</td>
                          <td>{ props[`rate_${stat}`] }</td>
                          <td>{ props[`maxrate_${stat}`] }</td>
                          <td title="<%= title %>">
                            <div>{ props[`hotness_${stat}`] }
                              <span style={{paddingRight: (100 - parseFloat(props[`hotness_${stat}`]) * 100) + '%'}} className={`color-bar`}></span>
                            </div>
                          </td>
                        </tr>
                      );
                    }) || null }
                  </tbody>
                </table>
              ) : null }
            </footer>
          </div> 
        </article>

      </li>
    );
  }
}
Result.defaultProps = {
  favorite: 0,
  ignore: 0,
  tableRange: [0.3, 0.5, 0.75, 0.99999],
  tableTexts: [
    'These story is not "hot" anymore',
    'A bit hot, but past it prime',
    'This is "hot" story',
    'This is very "hot" story',
    'Be careful this is "new" story and result may be different'
  ],
  tableStats: ['tweets', 'likes', 'shares', 'pins', 'comments', 'votes_video', 'views_video', 'comments_video'],
  favoriteBtndata: [{icon: 'star', title: 'Favorite this result'}, {icon: 'star-outlined', title: 'Unfavorite this result'}],
  ignoreBtndata: [{icon: 'eye-with-line', title: 'Ignore this result'}, {icon: 'eye', title: 'Unignore this result'}]
};

export default Result;