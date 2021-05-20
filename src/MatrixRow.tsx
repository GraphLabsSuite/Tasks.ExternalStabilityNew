import { Component, ReactNode } from 'react';
import * as React from 'react';
import { MatrixCell } from './MatrixCell';

interface Props {
  // edge: [number, number][];
  keys: number;
  length: number;
  get: (elem: number, index: number) => void;
  vertices: number[];
}

export class MatrixRow extends Component<Props> {

  get(elem: number, index: number) {
    this.props.get(elem, index);
  }

  render(): ReactNode {
    // console.log('VEC: ', this.props.edge);
    let flag = -1;
    if (this.props.keys === -1) {
      // console.log('FLG');
      return new Array(this.props.length).fill(0).map((e, i) => {
        flag++;
        // console.log('FLAG: ', flag);
        if (flag === 0) {
          return (
              <div key={i} style={{ float: 'left', padding: '2px', cursor: 'pointer' }}>
                <MatrixCell
                    value={-3}
                    index={this.props.keys}
                    get={(el: number) => this.get(el, i)}
                    vertices={' '}
                />
              </div>);
        } else {
          // console.log('Edges: ', this.props.edges[flag - 1]);
          let a = '';
          a += this.props.vertices[flag - 1];;
          // console.log('Edges string: ', a);
          return (
              <div key={i} style={{ float: 'left', padding: '2px', cursor: 'pointer' }}>
                <MatrixCell
                    value={-2}
                    index={this.props.keys}
                    get={(el: number) => this.get(el, i)}
                    vertices={a}
                />
              </div>);
        }

      });
    }
    return new Array(this.props.length).fill(0).map((e, i) => {
      if (flag === 0) {
        flag++;
      }
      if (flag === -1) {
        flag++;
      }
      // console.log('KEYS:', this.props.keys, 'Ln:', this.props.length);
      return (
          <div key={i} style={{ float: 'left', padding: '2px', cursor: 'pointer' }}>
            <MatrixCell
                value={flag}
                index={this.props.keys}
                get={(el: number) => this.get(el, i)}
                vertices={' '}
            />
          </div>);
    });
  }
}
