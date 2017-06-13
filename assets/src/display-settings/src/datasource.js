import { pickBy, mapValues, transform, includes } from 'lodash';

const data = {
  title: {
    height: 68,
    disabled: true,
    default: true
  },
  url: {
    disabled: true,
    default: true,
    height: 0
  },
  author: {
    height: 24,
    siblings: ['found', 'domain']
  },
  found: {
    height: 24,
    siblings: ['author', 'domain'],
    default: true
  },
  domain: {
    height: 24,
    siblings: ['author', 'found'],
    default: true
  },
  image: {
    height: 160,
    default: true,
    siblings: ['description', 'wide_image'],
    opponents: ['wide_image'],
    childs: ['wide_image']
  },
  wide_image: {
    height: 160,
    siblings: ['description', 'image'],
    opponents: ['description', 'image'],
    parent: 'image'
  },
  description: {
    height: 160,
    default: true,
    siblings: ['image', 'wide_image'],
    opponents: ['wide_image']
  },
  likes: {
    height: 18,
    table: true,
    default: true,
    graphs: true
  },
  graphs: {
    height: 0,
    table: false,
    default: false
  },
  tweets: {
    height: 18,
    table: true,
    graphs: true
  },
  pins: {
    height: 18,
    table: true
  },
  shares: {
    height: 18,
    table: true,
    graphs: true
  },
  comments: {
    height: 18,
    table: true,
    graphs: true
  },
  votes_video: {
    height: 18,
    table: true
  },
  views_video: {
    height: 18,
    table: true,
    graphs: true
  },
  comments_video: {
    height: 18,
    table: true
  }
};

class DisplaySettings {
  constructor(config) {
    this.data = config;
    this.gutter = 12;
  }

  static toArray(selection) {
    return transform(selection, (acc, v, k) => {
      acc.push(k);
      return acc;
    }, []);
  }

  getRaw() {
    return { ...this.data };
  }

  getRenderMap() {
    return mapValues(this.data, ({ siblings, opponents, disabled, table, childs }) => ({ siblings, opponents, disabled, table, childs }));
  }

  getSelection(criterea, array) {
    const selection = pickBy(this.data, v => v[criterea]);
    return (array) ? DisplaySettings.toArray(selection) : selection;
  }

  getDefault(array = true) {
    return this.getSelection('default', array);
  }

  getGraphs(array = true) {
    return this.getSelection('graphs', array);
  }

  getTable(array = true) {
    return this.getSelection('table', array);
  }

  calculateHeight(settings) {
    let exclude = [];

    return settings.filter(stat => !!this.data[stat]).reduce((acc, stat) => {
      const map = this.data[stat];
      if (map.table && !includes(exclude, 'table')) {
        exclude.push('table');
        acc += (8 + map.height * 2);
      }
      if (stat === 'title') {
        acc += 4;
      }
      if (map.siblings) {
        if (!includes(exclude, stat)) {
          exclude = exclude.concat(map.siblings);
          acc += map.height;
        }
      } else {
        acc += map.height;
      }
      return acc;
    }, this.gutter);
  }

  getHeights(settings) {
    return settings.reduce((acc, stat) => {
      acc[stat] = `${this.data[stat].height}px`;
      if (!acc.table && this.data[stat].table) {
        acc.table = acc[stat];
      }
      return acc;
    }, {
      aside: '26px'
    });
  }
}

export default new DisplaySettings(data);
