import { pickBy, intersection, transform, includes } from 'lodash';

const TABLE = 18;
const CONTENT = 160;
const DETAIL = 24;

const data = {
  title: {
    height: 64,
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
    height: DETAIL,
    row: 1
  },
  found: {
    height: DETAIL,
    default: true,
    row: 1
  },
  domain: {
    height: DETAIL,
    default: true,
    row: 1
  },
  image: {
    height: CONTENT,
    default: true,
    row: 2
  },
  wide_image: {
    height: CONTENT,
    parent: 'image',
    row: 2
  },
  description: {
    height: CONTENT,
    default: true,
    row: 2
  },
  // graphs: {
  //   height: 0,
  //   table: false,
  //   default: false
  // },
  likes: {
    height: TABLE,
    table: true,
    default: true,
    graphs: true
  },
  tweets: {
    height: TABLE,
    table: true,
    graphs: true
  },
  pins: {
    height: TABLE,
    table: true,
    graphs: true
  },
  shares: {
    height: TABLE,
    table: true,
    graphs: true
  },
  comments: {
    height: TABLE,
    table: true,
    graphs: true
  },
  votes_video: {
    height: TABLE,
    table: true,
    graphs: true
  },
  views_video: {
    height: TABLE,
    table: true,
    graphs: true
  },
  comments_video: {
    height: TABLE,
    table: true,
    graphs: true
  }
};

class DisplaySettings {
  constructor(config) {
    this.data = config;
    this.rows = [];
    this.gutter = 12;
    this.aside = 20;
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
    console.log('gutter', this.gutter);
    console.log('aside', this.aside);
    const res = this.rows.reduce((acc, row) => {
      const inter = intersection(row, value);
      const stat = this.data[row[0]];
      if (inter.length) {
        console.log(inter, stat.height);
        acc += stat.height;
        // acc += (includes(inter, 'wide_image') && includes(inter, 'description')) ? h * 2 : h;
        if (stat.table && !table && stat) {
          console.log('th', stat.height);
          acc += this.tableHeader;
          table = true;
        }
      }
      return acc;
    }, this.gutter + this.aside);
    console.log(res);
    return res;
  }

  getHeights(settings) {
    return settings.reduce((acc, stat) => {
      if (!this.data[stat]) return acc;
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
