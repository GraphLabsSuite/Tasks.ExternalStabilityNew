
import {graph, IEdgeView, store, Template, Toolbar, ToolButtonList} from "graphlabs.core.template";
import {Edge, Graph, IEdge, IGraph, IVertex, Vertex} from "graphlabs.core.graphs";

export function FindExternalStability(gr: IGraph<IVertex, IEdge>): boolean[][]{
    let CNF: boolean[][] =  new Array(gr.vertices.length);
    for (let i = 0; i < gr.vertices.length; i++) {
        CNF[i] = new Array(gr.vertices.length);
        for (let j = 0; j < gr.vertices.length; j++) {
            if (i == j || gr.getEdge(gr.vertices[i], gr.vertices[j]).length !== 0) {
                console.log(gr.getEdge(gr.vertices[i], gr.vertices[j]))
                CNF[i][j] = true;
            }
            else {
                CNF[i][j] = false;
            }
        }
    }
    console.log("Conjunctive form:\n")
    console.log(CNF)
    let DNF = CNFtoDNF(CNF);
    return DNF;
}

function disjBoolArrays(a:  boolean[], b:  boolean[]):  boolean[]{
    console.log("TWO ARRAYS DISJUNCTION\nArrays before disjunction:\n")
    console.log(a)
    console.log(b)
    let res = new Array<boolean>();
    console.log(res)
    for(let i = 0; i < a.length; i++){
        res.push(a[i] || b[i])
        console.log("disjunction at position " + i.toString())
        console.log(a[i])
        console.log(b[i])
        console.log(res[i])
        console.log(res)
    }
    console.log("Result:\n")
    console.log(res)
    console.log(res[0])
    return res;
}

function arrayConj(a:  boolean[]): boolean{
    console.log("ARRAY CONJUNCTION\nArray before conjunction:\n")
    console.log(a)
    let res: boolean = true;
    for(let i = 0; i < a.length;  i++){
        res = res && a[i];
    }
    console.log("Result:\n")
    console.log(res)
    return res;
}

function arrayDisj(a:  boolean[]): boolean{
    //console.log("ARRAY DISJUNCTION\nArray before disjunction:\n")
    //console.log(a)
    let res: boolean = false;
    for(let i = 0; i < a.length;  i++){
        res = res || a[i];
    }
    //console.log("Result:\n")
    //console.log(res)
    return res;
}

function stretch(arr: boolean[]): boolean[][]{
    console.log("STRETCHING\nArray before stretching:\n")
    console.log(arr)
    let res: boolean[][] = new Array();
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === true){
            let s: boolean[] = new Array(arr.length);
            for(let j = 0; j < arr.length; j++){
                if(j === i){
                    s[j] = arr[i];
                }
                else{
                    s[j] = false;
                }
            }
            res.push(s);
        }

    }
    console.log("Result\n: ")
    console.log(res)
    return res;
}

export function arraysAreEqual(a: any[], b: any[]){
    let res = true;
    let i = 0;
    while(res && i < a.length){
        res = res && (a[i] === b[i])
        i++
    }
    return res;
}

function isUnique(element: boolean[], index: number, array: boolean[][]): boolean{
    let res = true;
    if(element.length == 0){
        console.log("Error! Element is empty")
    }
    for(let i = 0; i < array.length; i++){
        if(array[i].length == 0){
            console.log("Error! Array is empty")
        }
        //console.log(i)
        if(i !== index){
            if(arraysAreEqual(element, array[i])){
                if(i < index){
                    console.log("Duplicate!")
                    res = false;
                }
            } else {
                let s = new Array<boolean>();
                //console.log(array[i]);
                //console.log(element)
                for(let j = 0; j < element.length; j++) {
                    let a = array[i][j] === element[j] ? false : array[i][j]
                    s.push(a);
                    }
                //console.log(s)
                if(!arrayDisj(s)){
                    console.log("Disqualified!")
                    console.log(element)
                    console.log(array[i])
                }
                res = res && arrayDisj(s)
                }
            }
        }
    //console.log(res)
    return res;
}

function linearCombination(set1: boolean[][], set2: boolean[][]): boolean[][]{
    console.log("LINEAR COMBINATION\nArrays before combination:\n")
    console.log(set1)
    console.log(set2)
    let res: Array<Array<boolean>> = new Array();
    console.log("length: " + res.length.toString())
    console.log("content: " + res.toString())
    for(let i = 0; i < set1.length; i++){
        for(let j = 0; j < set2.length; j++){
            let a = disjBoolArrays(set1[i], set2[j])
            console.log(a)
            res.push(a);
            console.log(res)
            console.log(res[res.length-1])
        }
    }
    console.log("Result\n: ")
    console.log(res)
    console.log(res[1])
    return res;

}

function CNFtoDNF(CNF: boolean[][]): boolean[][]{
    let DNF: boolean[][] = stretch(CNF[0]);
    for(let i = 1; i < CNF.length; i++){
        DNF = linearCombination(DNF, stretch(CNF[i]))
    }
    DNF = DNF.filter(isUnique)
    return DNF;
}