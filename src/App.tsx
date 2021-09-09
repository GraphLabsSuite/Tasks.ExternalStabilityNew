import {IGraphView, store, Template, Toolbar, ToolButtonList} from "graphlabs.core.template";
import { Matrix } from './Matrix';
import React from 'react';
import {FindExternalStability, arraysAreEqual} from "./ExternalStability";
import './App.css';
import {IEdge, IGraph, IVertex, Vertex, StateColor} from "graphlabs.core.graphs";
import {select} from "d3-selection";



class App extends Template {

    values: number[][];
    vertLabels: number[] = [];
    externalStability: boolean[][] = new Array();
    correctAnswersReq: number = 0;
    answers: boolean[][] = new Array();
    updateNeeded: boolean = true;
    graph: IGraph<IVertex, IEdge> = this.get_graph();



    constructor(props: {}) {
        super(props);
        this.values  = [[]];
        this.calculate = this.calculate.bind(this);
        this.handler = this.handler.bind(this);


    }



    handler(values: number[][]) {
        this.values = values;
        let gr = this.get_graph();
        let vertices = gr.vertices
        let edges = gr.edges
        for(let i = 0; i < vertices.length; i++) {
            select(`#vertex_${+i}`).style('fill', "#eee")
        }
        for(let i = 0; i < vertices.length; i++) {
            if(values[i][1] == 1){
                select(`#vertex_${+i}`).style('fill', "#31660d")
                vertices.forEach((v: any, j) => {
                    if (vertices[i].isAdjacent(gr, v) && values[j][1] == 0) {
                        select(`#vertex_${+j}`).style('fill', "#a8eb7c")
                    }
                })
         }
        }

    }

    calculate() {
        let correctAnswersGiven = 0
        let correctAnswers: boolean[][] = []
        this.answers.forEach((answer)=>{
        for(let i = 0; i < this.externalStability.length; i++){
            if(arraysAreEqual(answer, this.externalStability[i])){
                console.log("Correct!")
                correctAnswers = correctAnswers.concat(this.externalStability.splice(i, 1))
                correctAnswersGiven++
                break;
            }
        }
        })
        let res = 40 * (1 - (correctAnswersGiven/this.correctAnswersReq)) + 5 * (this.answers.length - correctAnswersGiven);
        this.externalStability = this.externalStability.concat(correctAnswers)
        this.forceUpdate()
        console.log(this.externalStability)
        if(res > 40) {
            res = 40;
        }
        res = Math.round(res)
        return { success: res === 0, fee: res };
    }

    make_vec() {
        const graph = store.getState().graph;
        // console.log('Vert: ', graph.vertices.length);

        for (let i = 0; i < graph.vertices.length; i++) {
                    this.vertLabels.push(i);
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
            ToolButtonList.prototype.help = () => `В данном задании вы должны найти все множества внешней устойчивости предоставленного вам графа. \n
            Чтобы добавить множество к списку ответов, отметьте входящие в него вершины нажимая на ячейки в правой части модуля, после чего нажмите "Добавить". \n
            Чтобы удалить множество из списка ответов, отметьте входящие в него вершины нажимая на ячейки в правой части модуля, после чего нажмите "Удалить". \n
            Чтобы очистить свой список ответов, нажмите "Очистить". \n
            В ответ должны входить только множества внешней устойчивости минимального включения. \n
            Если вы считаете, что нашли все возможные множества внешней устойчивости, нажмите галочку для проверки задания. В случае если были допущены ошибки, вам будет предоставлена возможность исправить их.
            `;
            return ToolButtonList;
        };

        return Toolbar;
    }
    task() {
        const graph: IGraphView = store.getState().graph;
        if(this.updateNeeded) {
            let gr: IGraph<IVertex, IEdge> = this.get_graph();
            this.externalStability = FindExternalStability(gr);
            this.correctAnswersReq = this.externalStability.length
            this.updateNeeded = false
        }
        this.make_vec();
        return () => (
            <div style={{textAlign: 'center'}}>
            <Matrix
                rows={graph.vertices.length}
                columns={2}
                handler={this.handler}
                vertices={this.vertLabels}
            /> <button onClick={() => this.add()}>Добавить</button> <button onClick={() => this.delete()}>Удалить</button> <button onClick={() => this.clear()}>Очистить</button> <div style={{ border: '0px', textAlign: 'center', width: '300px', minHeight: '10px', background: '', padding: '6px' }}>
                {"Ваши ответы: " + this.buildString()}
            </div></div>);
    }

    add(){
        const graph = store.getState().graph;
        let answer: boolean[] = new Array();
        let dupCheck = false
        for(let i = 0; i < graph.vertices.length; i++){
            answer.push(this.values[i][1] === 1)
        }
        for(let i = 0; i < this.answers.length; i++) {
            dupCheck = dupCheck || arraysAreEqual(answer, this.answers[i])
        }
        if(!dupCheck) {
            this.answers.push(answer)
        }
        this.forceUpdate()
    }

    delete(){
        const graph = store.getState().graph;
        let answer: boolean[] = new Array();
        for(let i = 0; i < graph.vertices.length; i++){
            answer.push(this.values[i][1] === 1)
        }
        for(let i = 0; i < this.answers.length; i++) {
            if(arraysAreEqual(answer, this.answers[i])){
                this.answers.splice(i, 1)
                break;
            }
        }
        this.forceUpdate()
    }

    clear(){
        this.answers = []
        this.forceUpdate()
    }

    buildString(): string{
        let res: string = "";
        this.answers.forEach((a)=>{
            res+="{"
            let f = false
            a.forEach((e, i) => {
                if(e){
                    if(f){
                        res += ", "
                    }
                    res += +i;
                    f = true
                }
                if(i == a.length - 1){
                    res += "}\n"
                }
            })
        })
        return res;
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
        data[0].value.vertices.splice(0, data[0].value.vertices.length)
        data[0].value.edges.splice(0, data[0].value.edges.length)
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

