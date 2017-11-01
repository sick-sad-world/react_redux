import { pickBy, intersection, transform, forOwn } from 'lodash';
import data, { predefined } from './config';


class DisplaySettings {
  constructor(config) {
    this.data = config;
    this.rows = [];
    this.gutter = 8;
    this.aside = 26;
    this.tableHeader = 0;
    this.predefined = predefined;

    this.heightTester = document.createElement('div');
    this.heightTester.classList.add('height-tester');
    this.heightTester.style.position = 'absolute';
    document.body.appendChild(this.heightTester);

    Object.keys(config).forEach((item) => {
      if (config[item].table) {
        this.rows.push([item]);
        if (!this.tableHeader) this.tableHeader = config[item].height + 8 + 1;
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

  getPredefined() {
    return this.predefined.map(({ value, label }) => ({ label, value }));
  }

  inPredefined(val) {
    return !this.predefined.find(({ value }) => value === val);
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

  setHeightTesterWidth(width = 0) {
    this.heightTester.style.width = `${width}px`;
  }

  useHeightTester(text) {
    this.heightTester.innerHTML = text;
    const height = this.heightTester.clientHeight;
    this.heightTester.innerHTML = '';
    return height;
  }

  adjustHeight(res) {
    return (props) => {
      forOwn(props, (v, k) => {
        if (v === false || res[k] === undefined) return;

        const stat = this.data[k];

        if (typeof v === 'string') {
          const size = this.useHeightTester(v);
          res[k] = size >= stat.max ? stat.max : size;
        } else if (v === true) {
          res[k] = stat.max;
        }
      });
      return Object.values(res).reduce((acc, v) => {
        acc += v;
        return acc;
      }, 0);
    };
  }

  calculateHeight(settings) {
    if (typeof settings === 'string') {
      return (this.predefined.find(({ value }) => value === settings) || {}).height;
    }
    let table = 0;
    const value = settings.filter(stat => !!this.data[stat]);
    const res = this.rows.reduce((acc, row) => {
      const inter = intersection(row, value);
      const stat = this.data[row[0]];
      if (inter.length) {
        acc[row[0]] = (!stat.height) ? 0 : stat.height;
        if (stat.table && stat) {
          table += 1;
        }
      }
      return acc;
    }, {
      gutter: (this.gutter * 2.5),
      aside: this.aside
    });
    if (table > 0) {
      res.tableHeader = this.tableHeader + table;
    }
    return this.adjustHeight(res);
  }

  getHeights(settings) {
    if (typeof settings === 'string') {
      return settings;
    }
    return settings.reduce((acc, stat) => {
      const item = this.data[stat];
      if (!item) return acc;
      acc[stat] = `${((item.max)) ? item.line * item.max : item.height}px`;
      if (!acc.table && item.table) {
        acc.table = acc[stat];
      }
      return acc;
    }, {
      aside: `${this.aside}px`
    });
  }
}

export default new DisplaySettings(data);
