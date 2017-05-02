import PropTypes from 'prop-types';
import { oneOfValues } from 'common/typecheck';

export const feedTypes = [
  { value: 'autodetect', label: 'Autodetect' },
  { value: 'RSS', label: 'RSS/XML/ATOM Feed' },
  { value: 'HTML', label: 'HTML Scraping' },
  { value: 'Facebook', label: 'Facebook Page' },
  { value: 'Twitter', label: 'Twitter Search' },
  { value: 'Reddit', label: '(Sub)Reddit' }
];

export const testUrls = {
  RSS: 'find_feeds',
  HTML: 'find_urls',
  Facebook: 'find_facebook'
};

export const defaultData = {

};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  feedurl: PropTypes.string.isRequired,
  frequency: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: oneOfValues(feedTypes).isRequired,
  nextupdate: PropTypes.string,
  lastfound: PropTypes.string
};
