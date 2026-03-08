import {reverse} from "./reverse.mjs";

// Index 2 holds the first actual command line argument
let argument = process.argv[2];

console.log(reverse(argument));