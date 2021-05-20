import {IEdgeView, IGraphView, store, Template, Toolbar, ToolButtonList} from "graphlabs.core.template";
import { Matrix } from './Matrix';
import React from 'react';
import {FindExternalStability, arraysAreEqual} from "./ExternalStability";
import './App.css';
import {Edge, Graph, IEdge, IGraph, IVertex, Vertex} from "graphlabs.core.graphs";
import logo from './logo.svg';



class App extends Template {

    values: number[][];
    myTuple: number[] = [];
    externalStability: boolean[][] = new Array();
    correctAnswersReq: number = 0
    correctAnswersGiven: number = 0
    answers: boolean[][] = new Array();

    constructor(props: {}) {
        super(props);
        this.values  = [[]];
        this.calculate = this.calculate.bind(this);
        this.handler = this.handler.bind(this);

    }

    handler(values: number[][]) {
        this.values = values;
    }

    calculate() {
        let graph: IGraph<IVertex, IEdge> = store.getState().graph;
        let res = 100 * (1 - (this.correctAnswersGiven/this.correctAnswersReq)) + 5 * (this.answers.length - this.correctAnswersGiven);
        /*
        for (let i = 1; i < graph.vertices.length + 1; i++) {
            for (let j = 1; j < graph.edges.length + 1; j++) {
                if (this.values[i][j] === 1) {
                    if ((this.myTuple[j - 1][0] === i - 1) || (this.myTuple[j - 1][1] === i - 1)) {
                        continue;
                    }
                    if ((this.myTuple[j - 1][0] !== i - 1) && (this.myTuple[j - 1][1] !== i - 1)) {
                        res += 5;
                    }
                }
                if (this.values[i][j] === 0) {
                    if ((this.myTuple[j - 1][0] !== i - 1) && (this.myTuple[j - 1][1] !== i - 1)) {
                        continue;
                    }
                    if ((this.myTuple[j - 1][0] === i - 1) || (this.myTuple[j - 1][1] === i - 1)) {
                        res += 5;
                    }
                }
            }
        }*/
        if(res > 100) {
            res = 100;
        }
        return { success: res === 0, fee: res };
    }

    make_vec() {
        const graph = store.getState().graph;
        // console.log('Vert: ', graph.vertices.length);

        for (let i = 0; i < graph.vertices.length; i++) {
                    this.myTuple.push(i);
            }
        }
        // console.log('Empty: ', this.myTuple);

    getTaskToolbar() {
        Toolbar.prototype.getButtonList = () => {
            function beforeComplete(this: App):  Promise<{ success: boolean; fee: number }> {
                return new Promise((resolve => {
                    resolve(this.calculate());
                }));
            }
            ToolButtonList.prototype.beforeComplete = beforeComplete.bind(this);
            ToolButtonList.prototype.help = () => `В данном задании вы должны заполнить матрицу инцеденций
в правой части модуля согласно выданному графу.
После заполнения матрицы нажмите галочку для проверки задания.`;
            return ToolButtonList;
        };
        return Toolbar;
    }
    task() {
        const graph = store.getState().graph;
        let gr = this.get_graph()
        console.log("TEST")
        this.externalStability = FindExternalStability(gr);
        this.correctAnswersReq = this.externalStability.length
        console.log(this.externalStability)
        this.make_vec();
        return () => (
            <div>
            <Matrix
                rows={graph.vertices.length + 1}
                columns={2}
                handler={this.handler}
                vertices={this.myTuple}
            /> <button onClick={() => this.confirm()}>Подтвердить</button> </div>);
    }

    confirm(){
        const graph = store.getState().graph;
        let answer: boolean[] = new Array();
        for(let i = 1; i < graph.vertices.length + 1; i++){
            answer.push(this.values[i][1] === 1)
        }
        console.log(answer)
        for(let i = 0; i < this.externalStability.length; i++){
            if(arraysAreEqual(answer, this.externalStability[i])){
                console.log("Correct!")
                this.externalStability[i].splice(i, 1)
                this.correctAnswersGiven++
                break;
            }
        }
        this.answers.push(answer)
    }

    private get_graph(): IGraph<IVertex, IEdge>
    {
        const graph: IGraphView = store.getState().graph;
        let data = [
            {
                "type": "graph",
                "value": {
                    "vertices": [""],
                    "edges": [{
                        "source": "",
                        "target": ""
                    }]
                }
            }
        ]
        let vertices = graph.vertices;
        let edges = graph.edges;
        console.log(edges)
        let i = 0
        data[0].value.vertices.shift();
        vertices.forEach(() => {
            i = data[0].value.vertices.push(i.toString());

        });
        data[0].value.edges.shift();
        edges.forEach((e: any) => {
            data[0].value.edges.push({"source": e.vertexOne,  "target": e.vertexTwo})
            data[0].value.edges.push({"source": e.vertexTwo,  "target": e.vertexOne})
        });
        console.log(data[0].value.edges)
        return this.graphManager(data[0].value)
    }

}




export default App;

