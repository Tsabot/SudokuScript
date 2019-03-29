let Tab = [[],[],[],[],[],[],[],[],[]];
let actualStocksManquantX;
let nbManquant;
document.getElementById("launch").addEventListener("click", start);
document.getElementById("fill").addEventListener("click", fillTable);
function start(){
    intoTable();
    for(let x = 0; x <= 8; x++){
        completterX(x); 
    }
    /*if(nbManquant != 0){
        console.log(`Il manque ${nbManquant} chiffres donc start again`);
        start();
    }*/
}
function intoTable(){
    for(let x = 0; x <= 8; x++){
        for(let y = 0; y <= 8; y++){
            Tab[x][y] = document.getElementById("input" + x + y).value;
        }
    }
}
function fillTable(){
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
function getRandomArbitrary(min, max) {
    return Math.round( Math.random() * (max - min) + min );;
}
function writeValue(x, y, newValue){
    console.log("complete value = " + newValue + ' at X =' + x + " and  Y =" + y);
    Tab[x][y] = `${newValue}`;
    document.getElementById("input" + x + y).value = `${newValue}`;;
    posValX = search(actualStocksManquantX[1], newValue);
    posValY = search(actualStocksManquantX[0], y);
    actualStocksManquantX[0].splice(posValY, 1);
    actualStocksManquantX[1].splice(posValX, 1);
    //Improvement need suppression valeur déja ajouter dans tab de stockManquantX
}
function completterX(X){
    const stockManquantX = check_manquantX(X); //stockManquantX [0] = pos; stockManquantX[1]=val;
    actualStocksManquantX = check_manquantX(X);
    console.log("\nChangement de X");
    for(let i = 0; i < stockManquantX[1].length; i++){
        console.log("\nChangement de i");
        console.log(actualStocksManquantX[0]);
        console.log(actualStocksManquantX[1]);
        if (actualStocksManquantX[0].length == 1){
            console.log("nb left x = 1");
            //S'il ne manque qu'une valeur sur X, la mettre
            writeValue(X, actualStocksManquantX[0][0], actualStocksManquantX[1][0]);
        }
        else {
            stockAbsY = check_manquantY(actualStocksManquantX[0][0]);//A revoir
            if (stockAbsY[0].length == 1){
                console.log("nb left y = 1");
                //S'il ne manque qu'une valeur sur Y, la mettre
                writeValue(X, stockManquantX[0][i], stockAbsY[1][0]);
            }
            else {
                stockAbsCube = checkAbs_Cube(getXCube(X),getYCube(actualStocksManquantX[0][i]));//[[posX],[posY]],[Val]
                if (stockAbsCube[1].length == 1){
                    console.log("nb cube x = 1");
                    //S'il ne manque qu'une valeur dans le Cube, la mettre
                    writeValue(stockAbsCube[0][0][0], stockAbsCube[0][1][0], stockAbsCube[1][0]);
                }
                else{
                    //check sur chaque x x+1 x+2 si il y a pas de pb
                    stockPossibilite = findPossible(actualStocksManquantX, stockAbsY, stockAbsCube);
                    if(stockPossibilite.length == 1){
                        console.log("nb possibility = 1");
                        writeValue(X, stockManquantX[0][i],  stockPossibilite[0]);
                    }
                    else{
                        //Improvement: check les cases sur tab cotès voir si une des possiblité est uniquement possible la bas.
                        let stockFinal = checkXY(X,actualStocksManquantX[0][i]);
                        let closeCubeStock = Array();
                        stockPossibilite.forEach( possibleVal =>{
                            for(nbTable = 0; nbTable < 4; nbTable++){
                                if(stockFinal[nbTable].length == 1){
                                    closeCubeStock.push(stockFinal[nbTable][0]);
                                }
                            }
                        });
                        let posCube = 0;
                        console.log(`stock possibilite = ${stockPossibilite}`);
                        console.log(`stockclosecube = ${closeCubeStock}`);
                        closeCubeStock.forEach(possibleElse=>{
                            if(stockPossibilite[posCube] == possibleElse){
                                stockPossibilite.splice(posCube, 1);
                            }
                            posCube++;
                        });
                        if(stockPossibilite.length == 1){
                            console.log("nb possibility after = 1");
                            writeValue(X, actualStocksManquantX[0][0],  stockPossibilite[0]);
                        }
                        else{
                            if(stockPossibilite.length != 0){
                                console.log("nb possibility > 1");
                                console.log(`stock possibilite = ${stockPossibilite}`);
                                console.log(stockPossibilite.length);
                                let randomY = getRandomArbitrary(0, stockPossibilite.length-1);
                                console.log(randomY);
                                writeValue(X, actualStocksManquantX[0][0],  stockPossibilite[randomY]);
                            }
                            else{
                                console.log("Nombre introuvable sur x = " + X + " Y = " + stockManquantX[0][i]);
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
    for(let j = 0; j < table.length; j++){
        if(table[j] == value){
            return j;
        }
    }
    return false;
}
function getYCube(Y){
    //trouve le Y du tableau le plus proche de la valeur donnée
    if (Y == 0 || Y == 1 || Y == 2){
        bonY = 0;
    }
    else if (Y == 3 || Y == 4 || Y == 5){
        bonY = 3;
    }else bonY = 6;
    return bonY;
}
function getXCube(X){
    //trouve le Y de base du tableau le plus proche de la valeur donnée
    if (X == 0 || X == 1 || X == 2){
        bonX = 0;
    }
    else if (X == 3 || X == 4 || X == 5){
        bonX = 3;
    }else bonX = 6;
    return bonX;
}
function getCloseCube(X, Y){
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
    let trueX = getXCube(X);
    let trueY = getYCube(Y);
    let stockManquantClose = Array(Array(),Array(),Array(),Array());
    let whichCube = getCloseCube(trueY,trueX);
    for(let ix = 0; ix < 4; ix++){
        if(ix == 0 || ix == 2){
            stockManquantClose[ix] = checkAbs_Cube(trueX+ whichCube[ix], trueY );
        }
        else if(ix == 1 || ix == 3){
            stockManquantClose[ix] = checkAbs_Cube(trueX , trueY+ whichCube[ix]);
        }
    }
    return stockManquantClose;
}
function findPossible(absX, absY, absC){
    let stockPossible = Array(Array(1,2,3,4,5,6,7,8,9),Array(0,0,0,0,0,0,0,0,0));
    let stockBon = [];
    let pos = 0;
    console.log(absX[1]);
    console.log(absY[1]);
    console.log(absC[1]);
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
            stockBon.push(valPos);
        }
        pos++;
    });
    console.log(stockPossible[0]);
    console.log(stockPossible[1]);
    return stockBon;
}
function checkAbs_Cube(X,Y){
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