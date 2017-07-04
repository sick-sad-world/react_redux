import { pickBy, intersection, transform, forOwn } from 'lodash';

const TABLE = 18;
const CONTENT = 125;
const DETAIL = 20;
const LENGTH = 52;

const data = {
  title: {
    max: 3,
    line: 21,
    length: LENGTH,
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
    max: 5,
    line: 18,
    length: LENGTH,
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
    this.gutter = 8;
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

  adjustHeight(res) {
    return (props) => {
      forOwn(props, (v, k) => {
        if (v === false || res[k] === undefined) return;

        const stat = this.data[k];

        if (typeof v === 'number') {
          const size = Math.ceil(v / stat.length);
          res[k] = size >= stat.max ? stat.line * stat.max : stat.line * size;
        } else if (v === true) {
          res[k] = stat.line * stat.max;
        }
      });
      return Object.values(res).reduce((acc, v) => {
        acc += v;
        return acc;
      }, 0);
    };
  }

  calculateHeight(settings) {
    let table = false;
    const value = settings.filter(stat => !!this.data[stat]);
    const res = this.rows.reduce((acc, row) => {
      const inter = intersection(row, value);
      const stat = this.data[row[0]];
      if (inter.length) {
        acc[row[0]] = (!stat.height) ? 0 : stat.height;
        if (stat.table && !table && stat) {
          acc.tableHeader = this.tableHeader;
          table = true;
        }
      }
      return acc;
    }, {
      gutter: (this.gutter * 2.5),
      aside: this.aside
    });
    return this.adjustHeight(res);
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
      aside: `${this.aside}px`
    });
  }
}

export default new DisplaySettings(data);
