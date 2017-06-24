import { pickBy, intersection, transform } from 'lodash';

const data = {
  title: {
    height: 72,
    disabled: true,
    default: true,
    row: 0
  },
  url: {
    disabled: true,
    default: true,
    height: 0
  },
  author: {
    height: 24,
    row: 1
  },
  found: {
    height: 24,
    default: true,
    row: 1
  },
  domain: {
    height: 24,
    default: true,
    row: 1
  },
  image: {
    height: 160,
    default: true,
    row: 2
  },
  wide_image: {
    height: 160,
    parent: 'image',
    row: 2
  },
  description: {
    height: 160,
    default: true,
    row: 2
  },
  likes: {
    height: 18,
    table: true,
    default: true,
    graphs: true
  },
  // graphs: {
  //   height: 0,
  //   table: false,
  //   default: false
  // },
  tweets: {
    height: 18,
    table: true,
    graphs: true
  },
  pins: {
    height: 18,
    table: true,
    graphs: true
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
    table: true,
    graphs: true
  },
  views_video: {
    height: 18,
    table: true,
    graphs: true
  },
  comments_video: {
    height: 18,
    table: true,
    graphs: true
  }
};

class DisplaySettings {
  constructor(config) {
    this.data = config;
    this.rows = [];
    this.gutter = 12;
    this.aside = 26;
    this.tableHeader = 0;
    Object.keys(config).forEach((item) => {
      if (config[item].table) {
        this.rows.push([item]);
        if (!this.tableHeader) this.tableHeader = config[item].height + 8;
      } else if (this.rows[config[item].row] instanceof Array) {
        this.rows[config[item].row].push(item);
      } else {
        this.rows[config[item].row] = [item];
      }
    });
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
    return transform(this.data, (acc, { disabled }, k) => {
      acc.push({
        name: k,
        disabled
      });
      return acc;
    }, []);
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
    let table = false;
    const value = settings.filter(stat => !!this.data[stat]);
    return this.rows.reduce((acc, row) => {
      if (intersection(row, value).length) {
        acc += this.data[row[0]].height;
        if (!table && this.data[row[0]].table) {
          acc += this.tableHeader;
          table = true;
        }
      }
      return acc;
    }, this.gutter + this.aside);
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
