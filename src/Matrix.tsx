import { Component, ReactNode } from 'react';
import * as React from 'react';
import { MatrixRow } from './MatrixRow';

interface Props {
    rows: number;
    columns: number;
    handler: (values: number[][]) => void;
    vertices: number[];
}

export class Matrix extends Component<Props> {

    values: number[][] = new Array(this.props.rows)
        .fill(new Array(this.props.columns).fill(0));

    constructor(props: Props) {
        super(props);
        this.props.handler(this.values);
    }

    get(elem: number, column: number, row: number): void {
        const res = [...this.values[row]];
        res[column] = elem;
        this.values[row] = res;
        this.props.handler(this.values);
    }

    render(): ReactNode {
        let count = -1;
        // console.log('MAT:', count);
        return (
            <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}}>
                <div>
                    {new Array(this.props.rows).fill(0).map((e, i) => {
                        count++;
                        return (
                            <div className="container" key={i}>
                                <MatrixRow
                                    keys={count}
                                    length={this.props.columns}
                                    get={(el, c) => this.get(el, c, i)}
                                    vertices={this.props.vertices}
                                />
                            </div>);
                    })}
                </div>
            </div>);
    }
}
