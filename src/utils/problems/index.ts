import { reverseLinkedList } from "./reverse-linked-list";
import { twoSum } from "./two-sum";

import { Problem } from "../types/problem";
import { jumpGame } from "./jump-game";
import { validParentheses } from "./valid-parentheses";
import { search2DMatrix } from "./search-a-2d-matrix";

interface ProblemMap{
    [key:string]:Problem
}
export const problems:ProblemMap ={
    "two-sum":twoSum,
    "reverse-linked-list":reverseLinkedList,
    "jump-game":jumpGame,
    "search-a-2d-matrix":search2DMatrix,
    "valid-parentheses":validParentheses
    

};
//add all of them
