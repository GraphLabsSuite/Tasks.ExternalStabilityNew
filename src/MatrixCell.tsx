import { Component, ReactNode } from 'react';
import * as React from 'react';

export interface State {
  value: number;
}

export interface Props {
    value: number;
    index: number;
    get: (e: number) => void;
    vertices: string;
}

export class MatrixCell extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    // console.log('KEY:', this.props.index, 'VL:', this.props.value);
    if (this.props.value === 0) {
        this.state = {
            value: this.props.index,
        };
    } else {
        this.state = {
            value: 0,
        };
    }

    this.handler = this.handler.bind(this);
  }

  handler() {
    this.setState(
        {
            value: this.state.value ? 0 : 1,
        },
        () => {
          this.props.get(this.state.value);
        });
  }
  render(): ReactNode {
      if (this.props.value === -2) {
          return (
              <div style={{ border: '0px double black', textAlign: 'center', width: '40px', minHeight: '10px', background: 'white', padding: '6px' }}>
                  {this.props.vertices}
              </div>);
      }
      if (this.props.value === -3) {
          return (
              <div style={{ border: '0px double black', textAlign: 'center', width: '40px', minHeight: '10px', background: '', padding: '6px' }}>
                  {'  '}
              </div>);
      }
      if (this.props.value === 0) {
          if (this.state.value === -1) {
              return (
                  <div style={{ border: '0px', textAlign: 'center', width: '40px', minHeight: '10px', background: '', padding: '6px' }}>
                      {'  '}
                  </div>);
          } else {
              return (
                  <div style={{ border: '0px double black', textAlign: 'center', width: '40px', minHeight: '10px', background: 'white', padding: '6px' }}>
                      {this.state.value}
                  </div>);
          }

      } else {
          return (
              <div style={{ border: '1px double black', textAlign: 'center', width: '40px', minHeight: '10px', background: 'white', padding: '6px' }} onClick={this.handler}>
                  {this.state.value}
              </div>);
      }

  }
}
