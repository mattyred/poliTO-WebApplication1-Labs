'use strict'

const modifyString = function(stringArray){
    let newStringArray = [];
    for(let str of stringArray){
        let newString;
        if(str.length < 2){
            newString = '';
        }else{
            let lastIndex = str.length - 1;
            newString = str.charAt(0) + str.charAt(1) + str.charAt(lastIndex-1) + str.charAt(lastIndex);       
        }
        newStringArray.push(newString);
    }
    return newStringArray;
}

let arr =  modifyString(['cat']);

for(let s of arr){
    console.log(s);
}