export type Example={
    id:number;
    inputText:string;
    outputText:string;
    explanation?:string;
    img?:string;
    
}

//local data type
export type Problem ={
    id:string;
    title:string;
    problemStatement:string;
    examples:Example[];
    constraints:string;
    order:number;
    starterCode:string;
    handlerFunction:((fn: any)=> boolean)|string;
    starterFunctionName:string;
    
}
//
export type DBProblem ={
    id:string;
    title:string;
    difficulty:string;
    likes:number;
    dislikes:number;
    order:number;
    link?:string;
    
}