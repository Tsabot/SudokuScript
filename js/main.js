let Tab = [[],[],[],[],[],[],[],[],[]];
let actualMissingStockX;
let nbManquant;
let numberOfChange;
document.getElementById("launch").addEventListener("click", start);
document.getElementById("fill").addEventListener("click", fillTableTest);
document.getElementById("fill2").addEventListener("click", fillTableEasy);
document.getElementById("fill3").addEventListener("click", fillTableMedium);
document.getElementById("fill4").addEventListener("click", fillTableHard);
document.getElementById("fill5").addEventListener("click", fillTableVeryHard);
document.getElementById("fill6").addEventListener("click", fillTableImpossiblyHard);
document.getElementById("clear").addEventListener("click", clearTable);
function start(){
    console.log("############################")
    console.log("############################")
    console.log("--------CORRECTION----------")
    console.log("############################")
    console.log("############################")
    intoTable();
    for(let x = 0; x <= 8; x++){
        completeX(x); 
    }
}
function intoTable(){
    for(let x = 0; x <= 8; x++){
        for(let y = 0; y <= 8; y++){
            Tab[x][y] = document.getElementById("input" + x + y).value;
        }
    }
}
function clearTable(){
    Tab = [[],[],[],[],[],[],[],[],[]];
    actualMissingStockX = null;
    nbManquant = null;
    for(let x = 0; x <= 8; x++){
        for(let y = 0; y <= 8; y++){
           document.getElementById("input" + x + y).value = null;
        }
    }
}
function getRandomArbitrary(min, max) {
    return Math.round( Math.random() * (max - min) + min );;
}
function writeValue(x, y, newValue){
    Tab[x][y] = `${newValue}`;
    numberOfChange++;
    document.getElementById("input" + x + y).value = `${newValue}`;;
    posValX = search(actualMissingStockX[1], newValue);
    posValY = search(actualMissingStockX[0], y);
    actualMissingStockX[0].splice(posValY, 1);
    actualMissingStockX[1].splice(posValX, 1);
    console.log(`Wrote ${newValue} at x=${x} and y=${y}`);
    //Improvement need delete val already in array missingStockX
}
function completeX(X){
    const missingStockX = check_manquantX(X); //missingStockX [0] = pos; missingStockX[1]=val;
    actualMissingStockX = check_manquantX(X);
    numberOfChange = 0;
    console.log("-------------++++++++++--------------")
    console.log("New Row :" + X)
    for(let i = 0; i < missingStockX[1].length; i++){
        console.log("________________________")
        console.log(`looking for x = ${actualMissingStockX[0][i - numberOfChange]}`)
        console.log(actualMissingStockX[0]);
        console.log(actualMissingStockX[1]);
        let iActual = search(actualMissingStockX[1], actualMissingStockX[1][i - numberOfChange]);
        let stockAbsY = check_manquantY(actualMissingStockX[0][iActual]);//A revoir
        let stockCube = fullCheckCube(getXCube(X), getYCube(actualMissingStockX[0][iActual]));//[[x of absent value],[y of absent value],[absent value]],[[x of present value],[y of present value],[present value]]
        let stockPossibilite = findPossible(actualMissingStockX, stockAbsY, stockCube[1]);
        console.log(stockPossibilite)
        if(stockPossibilite.length == 1){
            console.log("nb possibility after findPossible = 1");
            writeValue(X, actualMissingStockX[0][iActual],  stockPossibilite[0]);
        }
        else{
            if(stockPossibilite.length != 0){
                //
                let stockAllCLose = checkAllClose(X, actualMissingStockX[0][i]);
                console.log(`stock possibilite after checkAll = ${stockPossibilite}`);
                let newStockPossible = Array();
                stockPossibilite.forEach( possibleVal =>{
                    let deleteThisValue = 0;
                    for(nbTable = 0; nbTable < 4; nbTable++){
                        if(stockAllCLose[nbTable][1].length == 1){
                            if(possibleVal == stockAllCLose[nbTable][1]){
                                deleteThisValue = 1;
                            }
                        }//migth have to change the bellow thing ?
                        else if(stockAllCLose[nbTable][1].length <= 3){
                            stockAllCLose[nbTable][1].forEach( alsoNeededValue => {
                                if(possibleVal == alsoNeededValue){
                                    deleteThisValue = 1
                                }
                            });
                        }
                    }
                    if(deleteThisValue == 0){
                        newStockPossible.push(possibleVal);
                    }
                });
                stockPossibilite = newStockPossible;
                if(stockPossibilite.length == 1){
                    console.log("nb possibility after checkXY = 1");
                    writeValue(X, actualMissingStockX[0][iActual],  stockPossibilite[0]);
                }else if(stockPossibilite.length != 0){
                    //Need lot of impovements such as if both close tables has NumberX && last possible emplacement on this X then X is NumberX
                    let stockCloseTable = checkCloseTable(stockAllCLose, stockPossibilite);
                    
                    //if this value is the last in his cube and all arround have it (not on his X or Y) then this is the place for this value
                    for(let i = 0; i < stockCloseTable[1].length; i++){
                        let checkCountdown = stockCloseTable[0][i].length;
                        for(let j = 0; j < stockCloseTable[0][i].length; j++){
                            if(stockCloseTable[0][i][j][0] != X && stockCloseTable[0][i][j][0] != stockAbsY[0]){
                                checkCountdown += -1;
                            }
                        }
                        if(checkCountdown == 0){
                            stockPossibilite = stockCloseTable[1][i];
                        }
                    }
                    if(stockPossibilite.length == 1){
                        console.log("nb possibility after checkClose = 1");
                        writeValue(X, actualMissingStockX[0][iActual],  stockPossibilite[0]);
                    }else{
                        console.log("nb >1 after checkClose so write random");
                        let randomY = getRandomArbitrary(0, stockPossibilite.length-1);
                        writeValue(X, actualMissingStockX[0][iActual],  stockPossibilite[randomY]);
                    }
                }else{
                    console.log("Number not found on x = " + X + " Y = " + missingStockX[0][i]);
                    nbManquant++;
                }
            }
            else{
                console.log("Number not found on x = " + X + " Y = " + missingStockX[0][i]);
                nbManquant++;
            }
        }
    }
}

function checkAllClose(X, Y){
    //Must find the all numbers on the horizontaly or verticaly close Cube and send them back
    let trueX = getXCube(X);
    let trueY = getYCube(Y);
    let stockMissingClose = Array();
    let whichCube = getCloseCube(trueY,trueX);
    for(let ix = 0; ix < 4; ix++){
        //Must check 4 closest cube
        if(whichCube[ix] == 1){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(fullCheckCube(trueX + 3, trueY ));
            }else{
                stockMissingClose.push(fullCheckCube(trueX , trueY + 3));
            }
        }else if(whichCube[ix] == 2){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(fullCheckCube(trueX + 3, trueY ));
                stockMissingClose.push(fullCheckCube(trueX + 6, trueY ));
            }else{
                stockMissingClose.push(fullCheckCube(trueX , trueY + 3));
                stockMissingClose.push(fullCheckCube(trueX , trueY + 6));
            }
        }else if(whichCube[ix] == -1){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(fullCheckCube(trueX - 3, trueY ));
            }else{
                stockMissingClose.push(fullCheckCube(trueX , trueY - 3));
            }
        }else if(whichCube[ix] == -2){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(fullCheckCube(trueX - 3, trueY ));
                stockMissingClose.push(fullCheckCube(trueX - 6, trueY ));
            }else{
                stockMissingClose.push(fullCheckCube(trueX , trueY - 3));
                stockMissingClose.push(fullCheckCube(trueX , trueY - 6));
            }
        }
    }
    return stockMissingClose;
}
function checkCloseTable(closeCubes, possibleValue){//TODO
    //check in close Table, if a possibleValue is present, stock it's coordonate
    let valueFound = Array(Array(),Array(),Array());//[ [coordonate[ [x][y]^n ]] [value] [n number time seen] ]
    for(let nbCubes = 0; nbCubes < 4; nbCubes++){
        let thisCube = closeCubes[nbCubes][0];
        for(let i = 0; i < thisCube[1].length; i++){
            if(thisCube[1][i] == possibleValue){
                let indexPossibleValue = search(valueFound[1], possibleValue);
                if(indexPossibleValue != false){
                    valueFound[0][indexPossibleValue].push([thisCube[0][0][i],thisCube[0][0][i]]); // Add the coordonate of this value in the close cube
                    valueFound[2][indexPossibleValue] += 1;// Increment the number of time we've seen this number
                }else{
                    valueFound[0].push([[thisCube[0][0][i],thisCube[0][0][i]]]);// Add the coordonate of this value in the close cube
                    valueFound[1].push(possibleValue); // Add the value that are in close cubes
                    valueFound[2].push(1);// Increment the number of time we've seen this number
                }
            }
        }
    }
    return valueFound;
}

//Function that work 100%
function check_manquantX(X){
    let stockPresent = [[],[]];
    let stockPossibleVal = Array(1,2,3,4,5,6,7,8,9);
    let stockPossiblePos = Array(0,1,2,3,4,5,6,7,8);
    for(let k = 0; k <= 8; k++){
        if(Tab[X][k]){
            stockPresent[1].push(Tab[X][k]);
            stockPresent[0].push(k); 
        }
    }
    stockPresent[1].forEach(nbPresent => {
        posX = 0;
        stockPossibleVal.forEach(nbPossible => {
            if(nbPresent == nbPossible){
                stockPossibleVal.splice(posX, 1);
            }
            posX++;
        });
    });
    let nbRet = 0;
    stockPresent[0].forEach(posX => {
        stockPossiblePos.splice(posX  - nbRet, 1);
        nbRet++;
    });
    return Array(stockPossiblePos,stockPossibleVal);
}
function check_manquantY(Y){
    let stockPresent = [[],[]];
    let stockPossibleVal = Array(1,2,3,4,5,6,7,8,9);
    let stockPossiblePos = Array(0,1,2,3,4,5,6,7,8)
    for(let k = 0; k <= 8; k++){
        if(Tab[k][Y]){
            stockPresent[1].push(Tab[k][Y]);
            stockPresent[0].push(k); 
        }
    }
    stockPresent[1].forEach(nbPresent => {
        posX = 0;
        stockPossibleVal.forEach(nbPossible => {
            if(nbPresent == nbPossible){
                stockPossibleVal.splice(posX, 1);
            }
            posX++;
        });
    });
    let nbRet = 0;
    stockPresent[0].forEach(posX => {
        stockPossiblePos.splice(posX  - nbRet, 1);
        nbRet++;
    });
    return Array(stockPossiblePos,stockPossibleVal);
}
function fullCheckCube(X,Y){
    //Take the coord of the cube and send wich numbers are missing and where are numbers missing
    let stockPossibleVal = Array(1,2,3,4,5,6,7,8,9);
    let stockPresent = [[],[],[]];// hold in [[x coord of absent value],[y coord of absent value],[absent]]
    let stockMissing = [[],[],[]];// hold in [[x coord of absent value],[y coord of absent value],[present value]]
    for(let h = 0; h <= 2; h++){
        for(let g = 0; g <= 2; g++){
            stockPossibleVal.forEach(nbPossible => {
                if(nbPossible == Tab[X + h][Y + g]){
                    stockPresent[2].push(nbPossible);
                    stockPresent[0].push(X + h);
                    stockPresent[1].push(Y + g);
                }
            });
            if(Tab[X + h][Y + g] == ""){
                stockMissing[0].push(X + h);
                stockMissing[1].push(Y + g);
            }
        }
    }
    
    stockPresent[2].forEach(nbPresent => {
        posX = 0;
        stockPossibleVal.forEach(nbPossible => {
            if(nbPresent == nbPossible){
                stockPossibleVal.splice(posX, 1);
            }
            posX++;
        });
    });
    stockMissing[2] = stockPossibleVal;
    return Array(stockPresent, stockMissing);
}
function findPossible(absX, absY, absC){
    //Get all missing value on X,Y,Cube and delete all those that are not in the three
    let stockPossible = Array(Array(1,2,3,4,5,6,7,8,9),Array(0,0,0,0,0,0,0,0,0));
    let stockgood = [];
    let pos = 0;
    stockPossible[0].forEach(valPos => {
        absX[1].forEach( nbX =>{
            if(nbX ==  valPos){
                stockPossible[1][pos]++;
            }
        });
        absY[1].forEach( nbY =>{
            if(nbY ==  valPos){
                stockPossible[1][pos]++;
            }
        });
        absC[2].forEach( nbC =>{
            if(nbC ==  valPos){
                stockPossible[1][pos]++;
            }
        });
        if(stockPossible[1][pos] == 3){
            stockgood.push(valPos);
        }
        pos++;
    });
    return stockgood;
}
function createTable(){
    let sudoku;
    for(let x = 0; x <= 8; x++){
        sudoku += "<tr>";
        for(let y = 0; y <= 8; y++){
            if(x == 3 || x == 6){
                if(y == 2 || y == 5){
                    sudoku += '<th class="rightborder topborder"><input id=input' + x + y + ' type="text" value=""></th>';
                }
                else{
                    sudoku += '<th class="topborder"><input id=input' + x + y + ' type="text" value=""></th>';
                }       
            }
            else{
                if(y == 2 || y == 5){
                    sudoku += '<th class="rightborder"><input id=input' + x + y + ' type="text" value=""></th>';
                }
                else{
                    sudoku += '<th><input id=input' + x + y + ' type="text" value=""></th>';
                }
            }
        }
        sudoku += "</tr>";
    }
    document.getElementById("table").innerHTML += sudoku;
}
function search(table, value){
    //Find a value in the table
    for(let j = 0; j < table.length; j++){
        if(table[j] == value){
            return j;
        }
    }
    return false;
}
function findIfPossible(possibleValue, ourValue){
    possibleValue.forEach(possibleV => {
        if(ourValue == possibleV){
            return true;
        }
    });
    return false;
}
function getYCube(Y){
    //Identify the cube wich correspond to this Y exemple for the Y = 0,1,2, it's the first Cube on Y ...
    if (Y == 0 || Y == 1 || Y == 2){
        goodY = 0;
    }
    else if (Y == 3 || Y == 4 || Y == 5){
        goodY = 3;
    }else goodY = 6;
    return goodY;
}
function getXCube(X){
    //Identify the cube wich correspond to this X exemple for the x = 0,1,2, it's the first Cube on X ...
    if (X == 0 || X == 1 || X == 2){
        goodX = 0;
    }
    else if (X == 3 || X == 4 || X == 5){
        goodX = 3;
    }else goodX = 6;
    return goodX;
}
function getCloseCube(X, Y){
    //Return wich cube have to be checked when we send Ours exemple, if we send the cube at 0 - 0 we send [0,2,2,0] for [Top,Rigth,Bottom,Left] because there are 2 on right and 2 on bottom
    if(X == 0 && Y == 0){
        return [0,2,2,0];
    }
    else if(X == 3 && Y == 0){
        return [0,1,2,-1];
    }
    else if(X == 6 && Y == 0){
        return [0,0,2,-2];
    }
    else if(X == 0 && Y == 3){
        return [-1,2,1,0];
    }
    else  if(X == 3 && Y == 3){
        return [-1,1,1,-1];
    }
    else if(X == 6 && Y == 3){
        return [-1,0,1,-2];
    }
    else if(X == 0 && Y == 6){
        return [-2,2,0,0];
    }
    else if(X == 3 && Y == 6){
        return [-2,1,0,-1];
    }
    else if(X == 6 && Y == 6){
        return [-2,0,0,-2];
    }
}
//FillThing
function fillTableEasy(){
    document.getElementById("input" + 0 + 1).value = 3;
    document.getElementById("input" + 0 + 2).value = 2;
    document.getElementById("input" + 0 + 4).value = 5;
    document.getElementById("input" + 0 + 6).value = 1;
    document.getElementById("input" + 1 + 1).value = 4;
    document.getElementById("input" + 1 + 3).value = 6;
    document.getElementById("input" + 1 + 5).value = 2;
    document.getElementById("input" + 1 + 8).value = 7;
    document.getElementById("input" + 2 + 0).value = 1;
    document.getElementById("input" + 2 + 3).value = 7;
    document.getElementById("input" + 2 + 6).value = 5;
    document.getElementById("input" + 2 + 7).value = 4;
    
    document.getElementById("input" + 3 + 2).value = 1;
    document.getElementById("input" + 3 + 4).value = 9;
    document.getElementById("input" + 3 + 7).value = 7;
    document.getElementById("input" + 3 + 8).value = 3;
    document.getElementById("input" + 4 + 0).value = 8;
    document.getElementById("input" + 4 + 2).value = 6;
    document.getElementById("input" + 4 + 5).value = 3;
    document.getElementById("input" + 4 + 6).value = 2;
    document.getElementById("input" + 5 + 1).value = 7;
    document.getElementById("input" + 5 + 3).value = 8;
    document.getElementById("input" + 5 + 4).value = 4;
    document.getElementById("input" + 5 + 7).value = 9;

    document.getElementById("input" + 6 + 0).value = 3;
    document.getElementById("input" + 6 + 3).value = 9;
    document.getElementById("input" + 6 + 4).value = 6;
    document.getElementById("input" + 6 + 8).value = 8;
    document.getElementById("input" + 7 + 1).value = 8;
    document.getElementById("input" + 7 + 2).value = 4;
    document.getElementById("input" + 7 + 5).value = 7;
    document.getElementById("input" + 7 + 8).value = 1;
    document.getElementById("input" + 8 + 0).value = 5;
    document.getElementById("input" + 8 + 5).value = 4;
    document.getElementById("input" + 8 + 6).value = 7;
    document.getElementById("input" + 8 + 7).value = 3;
}
function fillTableMedium(){
    document.getElementById("input" + 0 + 0).value = 6;
    document.getElementById("input" + 0 + 1).value = 4;
    document.getElementById("input" + 0 + 4).value = 3;
    document.getElementById("input" + 0 + 8).value = 7;
    document.getElementById("input" + 1 + 0).value = 5;
    document.getElementById("input" + 1 + 2).value = 1;
    document.getElementById("input" + 1 + 4).value = 7;
    document.getElementById("input" + 1 + 6).value = 9;
    document.getElementById("input" + 2 + 7).value = 1;
    
    document.getElementById("input" + 3 + 2).value = 4;
    document.getElementById("input" + 3 + 3).value = 9;
    document.getElementById("input" + 3 + 5).value = 8;
    document.getElementById("input" + 3 + 7).value = 6;
    document.getElementById("input" + 4 + 1).value = 8;
    document.getElementById("input" + 4 + 5).value = 3;
    document.getElementById("input" + 4 + 7).value = 2;
    document.getElementById("input" + 5 + 3).value = 4;

    document.getElementById("input" + 6 + 0).value = 4;
    document.getElementById("input" + 6 + 3).value = 1;
    document.getElementById("input" + 6 + 4).value = 5;
    document.getElementById("input" + 6 + 5).value = 7;
    document.getElementById("input" + 6 + 7).value = 3;
    document.getElementById("input" + 7 + 0).value = 2;
    document.getElementById("input" + 7 + 2).value = 8;
    document.getElementById("input" + 7 + 3).value = 3;
    document.getElementById("input" + 7 + 7).value = 4;
    document.getElementById("input" + 8 + 0).value = 7;
    document.getElementById("input" + 8 + 1).value = 5;
    document.getElementById("input" + 8 + 7).value = 9;
    document.getElementById("input" + 8 + 8).value = 6;
}
function fillTableHard(){
    document.getElementById("input" + 0 + 0).value = 5;
    document.getElementById("input" + 0 + 1).value = 8;
    document.getElementById("input" + 0 + 2).value = 6;
    document.getElementById("input" + 0 + 4).value = 7;
    document.getElementById("input" + 1 + 3).value = 9;
    document.getElementById("input" + 1 + 5).value = 1;
    document.getElementById("input" + 1 + 6).value = 6;
    document.getElementById("input" + 2 + 3).value = 6;
    
    document.getElementById("input" + 3 + 2).value = 7;
    document.getElementById("input" + 4 + 0).value = 9;
    document.getElementById("input" + 4 + 2).value = 2;
    document.getElementById("input" + 4 + 4).value = 1;
    document.getElementById("input" + 4 + 6).value = 3;
    document.getElementById("input" + 4 + 8).value = 5;
    document.getElementById("input" + 5 + 2).value = 5;
    document.getElementById("input" + 5 + 4).value = 9;

    document.getElementById("input" + 6 + 1).value = 9;
    document.getElementById("input" + 6 + 4).value = 4;
    document.getElementById("input" + 6 + 8).value = 8;
    document.getElementById("input" + 7 + 2).value = 3;
    document.getElementById("input" + 7 + 3).value = 5;
    document.getElementById("input" + 7 + 7).value = 6;
    document.getElementById("input" + 8 + 4).value = 2;
    document.getElementById("input" + 8 + 6).value = 4;
    document.getElementById("input" + 8 + 7).value = 7;
}
function fillTableVeryHard(){
    document.getElementById("input" + 0 + 6).value = 3;
    document.getElementById("input" + 1 + 2).value = 1;
    document.getElementById("input" + 1 + 5).value = 7;
    document.getElementById("input" + 1 + 8).value = 6;
    document.getElementById("input" + 2 + 0).value = 5;
    document.getElementById("input" + 2 + 1).value = 4;
    document.getElementById("input" + 2 + 8).value = 8;
    
    document.getElementById("input" + 3 + 3).value = 7;
    document.getElementById("input" + 3 + 5).value = 8;
    document.getElementById("input" + 3 + 7).value = 2;
    document.getElementById("input" + 4 + 1).value = 6;
    document.getElementById("input" + 4 + 5).value = 9;
    document.getElementById("input" + 4 + 7).value = 5;
    document.getElementById("input" + 5 + 2).value = 8;
    document.getElementById("input" + 5 + 7).value = 4;

    document.getElementById("input" + 6 + 7).value = 8;
    document.getElementById("input" + 7 + 0).value = 1;
    document.getElementById("input" + 7 + 1).value = 5;
    document.getElementById("input" + 7 + 3).value = 3;
    document.getElementById("input" + 8 + 0).value = 2;
    document.getElementById("input" + 8 + 4).value = 1;
    document.getElementById("input" + 8 + 8).value = 7;
}
function fillTableImpossiblyHard(){
    document.getElementById("input" + 0 + 0).value = 8;
    document.getElementById("input" + 1 + 2).value = 3;
    document.getElementById("input" + 1 + 3).value = 6;
    document.getElementById("input" + 2 + 1).value = 7;
    document.getElementById("input" + 2 + 4).value = 9;
    document.getElementById("input" + 2 + 6).value = 2;
    
    document.getElementById("input" + 3 + 1).value = 5;
    document.getElementById("input" + 3 + 5).value = 7;
    document.getElementById("input" + 4 + 4).value = 4;
    document.getElementById("input" + 4 + 5).value = 5;
    document.getElementById("input" + 4 + 6).value = 7;
    document.getElementById("input" + 5 + 3).value = 1;
    document.getElementById("input" + 5 + 7).value = 3;

    document.getElementById("input" + 6 + 2).value = 1;
    document.getElementById("input" + 6 + 7).value = 6;
    document.getElementById("input" + 6 + 8).value = 8;
    document.getElementById("input" + 7 + 2).value = 8;
    document.getElementById("input" + 7 + 3).value = 5;
    document.getElementById("input" + 7 + 7).value = 1;
    document.getElementById("input" + 8 + 1).value = 9;
    document.getElementById("input" + 8 + 6).value = 4;
}
function fillTableTest(){
    for(let x = 0; x <= 8; x++){
        if(x != 5 && x != 1){
            document.getElementById("input" + 0 + x).value = x + 1;
        }
    }
    for(let y = 1; y <= 8; y++){
        if(y >= 6){
            document.getElementById("input" + 6 + 1).value = 9;
            document.getElementById("input" + 7 + 1).value = 3;
            document.getElementById("input" + 8 + 1).value = 1;
        }
        else document.getElementById("input" + y + 1).value = y + 3;
    }
    document.getElementById("input" + 1 + 3).value = 7;
    document.getElementById("input" + 2 + 3).value = 9;
    document.getElementById("input" + 2 + 4).value = 1;
    document.getElementById("input" + 2 + 5).value = 3;
    document.getElementById("input" + 1 + 5).value = 2;
}