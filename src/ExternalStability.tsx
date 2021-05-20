
import {IEdgeView, store, Template, Toolbar, ToolButtonList} from "graphlabs.core.template";
import {Edge, Graph, Vertex} from "graphlabs.core.graphs";

export function FindInternalStability(g: Graph<Vertex, Edge>){
    let matrix: boolean[][] =  new Array(g.vertices.length);
    let result: boolean[][];
    for (let i = 0; i < g.vertices.length; i++) {
        matrix[i] = new Array(g.vertices.length);
        for (let j = 0; j < g.vertices.length; j++) {
            if(i == j || g.getEdge(g.vertices[i], g.vertices[j]) != null){
                matrix[i][j] = true;
                }
        }
    }
    for (let i = 0; matrix.length; i++) {
        let coveredVetices: boolean[] = matrix[i];

        for (let j = i; j < matrix.length; j++) {
            let coveredVeticesNow: boolean[] = disjBoolArrays(matrix[i], matrix[j]);
            if(arrayConj(coveredVeticesNow)){

            } else{
                coveredVetices = coveredVeticesNow;
            }
        }
    }

}

function disjBoolArrays(a:  boolean[], b:  boolean[]):  boolean[]{
    let c: boolean[] = new Array(a.length);
    for(let i = 0; i < a.length;  i++){
        c[i] = a[i] || b[i];
    }
    return c;
}

function arrayConj(a:  boolean[]): boolean{
    let res: boolean = true;
    for(let i = 0; i < a.length;  i++){
        res = res && a[i];
    }
    return res;
}