import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Angular2Csv } from 'angular2-csv';

/**
 * Describe differences between two object
 */
export interface differences {
  /**
   * Only when two same prop have not same values
   */
  different: Array<string>;
  /**
   * Only missing properties from the first object
   */
  missing_from_first: Array<string>;
  /**
   * Only missing properties from the second object
   */
  missing_from_second: Array<string>;
}

/**
 * Share variable and function commonly use in the app
 */
@Injectable()
export class DefiCommonService {
  /**
   * Api URL
   */
  api: string;
  /**
   * GraphQL URL
   */
  graphQL: string;
  /**
   * Interval in ms between two refresh
   */
  refreshTokenInterval: number;

  /**
   * Instanciate all members
   */
  constructor() {
    this.api = 'http://localhost:3000';
    this.graphQL = this.api + '/graphql';
    this.refreshTokenInterval = 4000;
  }

  /**
   * Test equality objects
   */
  equalityObjects(a, b) {
    const differences = this.differences(a, b);
    const d = differences.different.length + differences.missing_from_first.length + differences.missing_from_second.length;
    return  d === 0 ? true : false;
  }

  /**
   * Load all
   */
  differences(a, b): differences {
    const result: differences = {
      different: [],
      missing_from_first: [],
      missing_from_second: []
    };

    _.reduce(a, (result, value, key) => {
      if (b.hasOwnProperty(key)) {
        if (_.isEqual(value, b[key])) { return result; } else {
          if (typeof (a[key]) !== typeof ({}) || typeof (b[key]) !== typeof ({})) {
            result.different.push(key);
            return result;
          } else {
            const deeper = this.differences(a[key], b[key]);
            result.different = result.different.concat(_.map(deeper.different, (sub_path) => key + '.' + sub_path));
            result.missing_from_second = result.missing_from_second.concat(_.map(deeper.missing_from_second, (sub_path) => key + '.' + sub_path));
            result.missing_from_first = result.missing_from_first.concat(_.map(deeper.missing_from_first, (sub_path) => key + '.' + sub_path));
            return result;
          }
        }
      } else {
        result.missing_from_second.push(key);
        return result;
      }
    }, result);

    _.reduce(b, function (result, value, key) {
      if (a.hasOwnProperty(key)) { return result; } else {
        result.missing_from_first.push(key);
        return result;
      }
    }, result);
    return result;
  }

  /**
   * Export a datable to an csv
   */
  // exportAsCSV(dataTable: DatatableComponent, filename: string = 'Export') {
  //   const columns: TableColumn[] = dataTable.columns || dataTable._internalColumns;
  //   const headers =
  //     columns
  //       .map((column: TableColumn) => column.name)
  //       .filter((e) => e);  // remove column without name

  //   const rows: any[] = dataTable.rows.map((row) => {
  //     let r = {};
  //     columns.forEach((column) => {
  //       let prop = column.prop;
  //       if (!column.name) return // ignore column without name
  //       if (prop) {
  //         if (row[prop] === null || row[prop] === undefined)
  //           r[prop] = ""
  //         else
  //           r[prop] = row[prop]
  //         if (typeof row[prop] === 'boolean')
  //           r[prop] = (row[prop]) ? 'Oui' : 'Non'
  //       }
  //     })
  //     return r;
  //   });
  //   return new Angular2Csv(rows, filename, {
  //     fieldSeparator: ',',
  //     quoteStrings: '"',
  //     decimalseparator: '.',
  //     showLabels: true,
  //     headers,
  //     showTitle: false,
  //     title: filename,
  //     useBom: false,
  //   });
  // }


  /**
   * Wait function
   */
  wait(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  /**
   * Flat an object
   */
  flatten(obj) {
    const newObj = {};
    function flat(obj) {
      Object.keys(obj).map(key => {
        if (typeof obj[key] === 'object') { flat(obj[key]); } else { newObj[key] = obj[key]; }
      });
    }
    flat(obj);
    return newObj;
  }

  /**
   * stringifyWithoutPropertiesQuote
   */
  stringifyWithoutPropertiesQuote(obj) {
    return JSON.stringify(obj)
            .replace(/(\{ *"enum" *\: *")([a-z A-Z 0-9]*)" *}/gm, '$2')
            .replace(/\\"/g, '\uFFFF')
            .replace(/\"([^"]+)\":/g, '$1:')
            .replace(/\uFFFF/g, '\\"');
  }


  filter() {
    let filterFun = (value) => value;
    return {
      filter: _ => filterFun,
      update: function (search, propertiesToSearch) {
        filterFun = (accounts) => {
          const tmpAccounts = [];
          propertiesToSearch.map(propertyToSearch => {
            accounts.forEach(account => {
              const accountValue = recursiveCheck(account, propertyToSearch.split('.'));
              if (accountValue && accountValue.toUpperCase().includes(search.toUpperCase())) {
                tmpAccounts.push(account);
              }
            });
          });
          return tmpAccounts.reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, []);
        };
      }
    };
    function recursiveCheck(obj, props) {
      if (props.length) return recursiveCheck(obj[props[0]], props.slice(1, props.length));
      return obj;
    }
  }
}
