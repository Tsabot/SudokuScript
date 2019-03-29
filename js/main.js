let Tab = [[],[],[],[],[],[],[],[],[]];
let actualMissingStockX;
let nbManquant;
document.getElementById("launch").addEventListener("click", start);
document.getElementById("fill").addEventListener("click", fillTableTest);
document.getElementById("fill2").addEventListener("click", fillTableMore);
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
function fillTableMore(){
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
    document.getElementById("input" + 5 + 5).value = 9;
    document.getElementById("input" + 4 + 7).value = 1;
    document.getElementById("input" + 8 + 8).value = 7;
}
function getRandomArbitrary(min, max) {
    return Math.round( Math.random() * (max - min) + min );;
}
function writeValue(x, y, newValue){
    Tab[x][y] = `${newValue}`;
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
    for(let i = 0; i < missingStockX[1].length; i++){
        console.log("\nChangement de i");
        console.log(actualMissingStockX[0]);
        console.log(actualMissingStockX[1]);
        if(actualMissingStockX[0].length == 1){
            console.log("nb left x = 1");
            //S'il ne manque qu'une valeur sur X, la mettre
            if(findIfPossible(actualMissingStockX[1], actualMissingStockX[1][0]) == true){
                writeValue(X, actualMissingStockX[0][0], actualMissingStockX[1][0]);
            }
        }
        else {
            stockAbsY = check_manquantY(actualMissingStockX[0][0]);//A revoir
            if(stockAbsY[0].length == 1){
                console.log("nb left y = 1");
                //S'il ne manque qu'une valeur sur Y, la mettre
                if(findIfPossible(actualMissingStockX[1], stockAbsY[1][0])  == true){
                    writeValue(X, missingStockX[0][i], stockAbsY[1][0]);
                }
            }
            else {
                stockAbsCube = checkAbs_Cube(getXCube(X), getYCube(actualMissingStockX[0][0]));//[[posX],[posY]],[Val]
                if(stockAbsCube[1].length == 1){
                    console.log("nb cube x = 1");
                    //S'il ne manque qu'une valeur dans le Cube, la mettre
                    if(findIfPossible(actualMissingStockX[1], stockAbsCube[1][0])  == true){
                        writeValue(stockAbsCube[0][0][0], stockAbsCube[0][1][0], stockAbsCube[1][0]);
                    }
                }
                else{
                    //check sur chaque x x+1 x+2 si il y a pas de pb
                    console.log(actualMissingStockX[1])
                    console.log(stockAbsY[1])
                    console.log(stockAbsCube[1])
                    stockPossibilite = findPossible(actualMissingStockX, stockAbsY, stockAbsCube);
                    if(stockPossibilite.length == 1){
                        console.log("nb possibility = 1");
                        writeValue(X, missingStockX[0][i],  stockPossibilite[0]);
                    }
                    else{
                        let stockFinal = checkXY(X, actualMissingStockX[0][i]);
                        console.log(`stock possibilite = ${stockPossibilite}`);
                        console.log(stockFinal);
                        let newStockPossible = Array();
                        stockPossibilite.forEach( possibleVal =>{
                            let deleteThisValue = 0;
                            for(nbTable = 0; nbTable < 4; nbTable++){
                                if(stockFinal[nbTable][1].length == 1){
                                    if(possibleVal == stockFinal[nbTable][1]){
                                        deleteThisValue = 1
                                        //writeValue(stockFinal[nbTable][0][0], stockFinal[nbTable][0][1],  stockFinal[nbTable][1]);
                                    }
                                }
                                else if(stockFinal[nbTable][1].length <= 3){
                                    stockFinal[nbTable][1].forEach( alsoNeededValue => {
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
                        console.log(`stock possibilite = ${newStockPossible}`);
                        if(stockPossibilite.length == 1){
                            console.log("nb possibility after = 1");
                            writeValue(X, actualMissingStockX[0][0],  stockPossibilite[0]);
                        }
                        else{
                            if(stockPossibilite.length != 0){
                                console.log("nb possibility > 1");
                                console.log(`stock possibilite = ${stockPossibilite}`);
                                let randomY = getRandomArbitrary(0, stockPossibilite.length-1);
                                writeValue(X, actualMissingStockX[0][0],  stockPossibilite[randomY]);
                            }
                            else{
                                console.log("Nombre introuvable sur x = " + X + " Y = " + missingStockX[0][i]);
                                nbManquant++;
                            }
                        }
                    }  
                }
            } 
        }
    }
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
function checkXY(X,Y){
    //Must find the number wich are missing on the horizontaly or verticaly close Cube and send them back
    let trueX = getXCube(X);
    let trueY = getYCube(Y);
    let stockMissingClose = Array();
    let whichCube = getCloseCube(trueY,trueX);
    for(let ix = 0; ix < 4; ix++){
        //Must check 4 closest cube
        if(whichCube[ix] == 1){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(checkAbs_Cube(trueX + 3, trueY ));
            }else{
                stockMissingClose.push(checkAbs_Cube(trueX , trueY + 3));
            }
        }else if(whichCube[ix] == 2){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(checkAbs_Cube(trueX + 3, trueY ));
                stockMissingClose.push(checkAbs_Cube(trueX + 6, trueY ));
            }else{
                stockMissingClose.push(checkAbs_Cube(trueX , trueY + 3));
                stockMissingClose.push(checkAbs_Cube(trueX , trueY + 6));
            }
        }else if(whichCube[ix] == -1){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(checkAbs_Cube(trueX - 3, trueY ));
            }else{
                stockMissingClose.push(checkAbs_Cube(trueX , trueY - 3));
            }
        }else if(whichCube[ix] == -2){
            if(ix == 0 || ix == 2){
                stockMissingClose.push(checkAbs_Cube(trueX - 3, trueY ));
                stockMissingClose.push(checkAbs_Cube(trueX - 6, trueY ));
            }else{
                stockMissingClose.push(checkAbs_Cube(trueX , trueY - 3));
                stockMissingClose.push(checkAbs_Cube(trueX , trueY - 6));
            }
        }
    }
    return stockMissingClose;
}
function findPossible(absX, absY, absC){
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
        absC[1].forEach( nbC =>{
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
function checkAbs_Cube(X,Y){//TODO has errors [[[X][Y]][4]]
    //Take the coord of the cube and send wich numbers are missing and where are numbers missing
    let stockPossibleVal = Array(1,2,3,4,5,6,7,8,9);
    let stockPresent = [[],[],[]];
    for(let h = 0; h <= 2; h++){
        for(let g = 0; g <= 2; g++){
            stockPossibleVal.forEach(nbPossible => {
                if(nbPossible == Tab[X + h][Y + g]){
                    stockPresent[2].push(nbPossible);
                }
            });
            if(Tab[X + h][Y + g] == ""){
                stockPresent[0].push(X + h);
                stockPresent[1].push(Y + g);
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
    return Array(Array(stockPresent[0],stockPresent[1]),stockPossibleVal);
}
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
//function check_Diagonale()