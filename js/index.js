/**
 * The Goal of this script is to be able to resolve any sudoku
 * Goal:
 * Have in each 3*3 area (called subgrids), all numbers from 1 to 9 in any order
 * Have in each row and collumn, all numbers from 1 to 9 in any order
 * Workflow on run:
 * Get possible value of each cell that needs a value
 * if this cell has one possible value, fill it with it
 * For each row
 *  for each cell
 *      if this cell has one possible value, fill it with it
 *      else
 *          fill the key with one of the possible value left randomly
 *      actualize value left
 *
 * For each fill value, check if if didn't create error,
 * if an error is spoted, re run algo
 */

let soluceTab = [[], [], [], [], [], [], [], [], []];
let probabilityTab = [[], [], [], [], [], [], [], [], []];
let needValueCells = [[], [], [], [], [], [], [], [], []];
let numberOfReset = 0;

document.getElementById('launch').addEventListener('click', start);
document.getElementById('fill').addEventListener('click', fillTableTest);
document.getElementById('fill2').addEventListener('click', fillTableEasy);
document.getElementById('fill3').addEventListener('click', fillTableMedium);
document.getElementById('fill4').addEventListener('click', fillTableHard);
document.getElementById('fill5').addEventListener('click', fillTableVeryHard);
document.getElementById('fill6').addEventListener('click', fillTableImpossiblyHard);
document.getElementById('clear').addEventListener('click', clearTable);

function start() {
  numberOfReset = 0;
  initiateArrays();
  console.log('soluceTab', soluceTab);
  console.log('probabilityTab', probabilityTab);
  console.log('needValueCells', needValueCells);
  if (!isFinished()) {
    completeSudoku();
  }
}
const completeSudoku = () => {
  if (isFinished()) {
    return;
  }
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (needValueCells[x][y] && !soluceTab[x][y]) {
        const selectedRandomValue =
          probabilityTab[x][y][getRandomArbitrary(0, probabilityTab[x][y].length - 1)];
        if (!selectedRandomValue) {
          resetAndComplete();
        } else {
          writeValue(x, y, selectedRandomValue);
          runProbabilityTab(false);
          if (!verifyIntegrity()) {
            resetAndComplete();
          }
        }
      }
    }
  }
};
const resetAndComplete = () => {
  numberOfReset++;
  if (numberOfReset > 600) {
    console.log("Ca n'a pas marché");
    return;
  } else {
    console.log('numberOfReset: ', numberOfReset);
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (probabilityTab[x][y]) {
          soluceTab[x][y] = null;
        }
      }
    }
    completeSudoku();
  }
};
function initiateArrays() {
  for (let x = 0; x <= 8; x++) {
    for (let y = 0; y <= 8; y++) {
      soluceTab[x][y] = document.getElementById('input' + x + y).value;
      if (document.getElementById('input' + x + y).value) {
        needValueCells[x][y] = false;
      } else {
        needValueCells[x][y] = true;
      }
      probabilityTab[x][y] = null;
    }
  }
  runProbabilityTab(true);
}
const runProbabilityTab = isInitalization => {
  for (let x = 0; x <= 8; x++) {
    for (let y = 0; y <= 8; y++) {
      if (needValueCells[x][y] && !soluceTab[x][y]) {
        probabilityTab[x][y] = getPossibleValues(x, y);
        if (probabilityTab[x][y] && probabilityTab[x][y].length === 1) {
          writeValue(x, y, probabilityTab[x][y][0]);
          if (isInitalization) {
            needValueCells[x][y] = false;
          }
          runProbabilityTab(isInitalization);
        }
      }
    }
  }
};
const isFinished = () => {
  for (let x = 0; x <= 8; x++) {
    for (let y = 0; y <= 8; y++) {
      if (!soluceTab[x][y]) {
        return false;
      }
    }
  }
  return true;
};
function clearTable() {
  soluceTab = [[], [], [], [], [], [], [], [], []];
  probabilityTab = [[], [], [], [], [], [], [], [], []];
  needValueCells = [[], [], [], [], [], [], [], [], []];
  for (let x = 0; x <= 8; x++) {
    for (let y = 0; y <= 8; y++) {
      document.getElementById('input' + x + y).value = null;
    }
  }
}
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function writeValue(x, y, newValue) {
  soluceTab[x][y] = `${newValue}`;
  document.getElementById('input' + x + y).value = `${newValue}`;
}
function checkAllClose(X, Y) {
  //Must find the all numbers on the horizontaly or verticaly close Cube and send them back
  let trueX = getXCube(X);
  let trueY = getYCube(Y);
  let stockMissingClose = Array();
  let whichCube = getCloseCube(trueY, trueX);
  for (let ix = 0; ix < 4; ix++) {
    //Must check 4 closest cube
    if (whichCube[ix] == 1) {
      if (ix == 0 || ix == 2) {
        stockMissingClose.push(fullCheckCube(trueX + 3, trueY));
      } else {
        stockMissingClose.push(fullCheckCube(trueX, trueY + 3));
      }
    } else if (whichCube[ix] == 2) {
      if (ix == 0 || ix == 2) {
        stockMissingClose.push(fullCheckCube(trueX + 3, trueY));
        stockMissingClose.push(fullCheckCube(trueX + 6, trueY));
      } else {
        stockMissingClose.push(fullCheckCube(trueX, trueY + 3));
        stockMissingClose.push(fullCheckCube(trueX, trueY + 6));
      }
    } else if (whichCube[ix] == -1) {
      if (ix == 0 || ix == 2) {
        stockMissingClose.push(fullCheckCube(trueX - 3, trueY));
      } else {
        stockMissingClose.push(fullCheckCube(trueX, trueY - 3));
      }
    } else if (whichCube[ix] == -2) {
      if (ix == 0 || ix == 2) {
        stockMissingClose.push(fullCheckCube(trueX - 3, trueY));
        stockMissingClose.push(fullCheckCube(trueX - 6, trueY));
      } else {
        stockMissingClose.push(fullCheckCube(trueX, trueY - 3));
        stockMissingClose.push(fullCheckCube(trueX, trueY - 6));
      }
    }
  }
  return stockMissingClose;
}
function getMissingCloseSub(closeCubes, possibleValue) {
  //check in close Table, if a possibleValue is present, stock it's coordonate
  let valueFound = Array(Array(), Array(), Array()); //[ [coordonate[ [x][y]^n ]] [value] [n number time seen] ]
  for (let nbCubes = 0; nbCubes < 4; nbCubes++) {
    let thisCube = closeCubes[nbCubes][0];
    for (let i = 0; i < thisCube[1].length; i++) {
      if (thisCube[1][i] == possibleValue) {
        let indexPossibleValue = search(valueFound[1], possibleValue);
        if (indexPossibleValue != false) {
          valueFound[0][indexPossibleValue].push([thisCube[0][0][i], thisCube[0][0][i]]); // Add the coordonate of this value in the close cube
          valueFound[2][indexPossibleValue] += 1; // Increment the number of time we've seen this number
        } else {
          valueFound[0].push([[thisCube[0][0][i], thisCube[0][0][i]]]); // Add the coordonate of this value in the close cube
          valueFound[1].push(possibleValue); // Add the value that are in close cubes
          valueFound[2].push(1); // Increment the number of time we've seen this number
        }
      }
    }
  }
  return valueFound;
}
/**
 * Get the possible value of this cell in the subGrid
 * @param {number} X
 * @param {number} Y
 * @returns {[number]}
 */
const getMissingSubgrid = (X, Y) => {
  const allCellPossibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let allCellPossibleValuesLeft = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const closeCellValues = [];
  const topLeftSubX = getXCube(X);
  const topLeftSubY = getYCube(Y);

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const thisCellValue = getValueInSoluce(topLeftSubX + x, topLeftSubY + y);

      if (thisCellValue) {
        closeCellValues.push(thisCellValue);
      }
    }
  }
  for (let v = 0; v < closeCellValues.length; v++) {
    const value = closeCellValues[v];

    for (let p = 0; p < allCellPossibleValues.length; p++) {
      const possibleValue = allCellPossibleValues[p];

      if (possibleValue === value) {
        const posInLeft = search(allCellPossibleValuesLeft, possibleValue);
        if (posInLeft !== false) {
          allCellPossibleValuesLeft.splice(posInLeft, 1);
        }
      }
    }
  }
  return allCellPossibleValuesLeft;
};
/**
 * Get the value of a cell
 * @param {number} X
 * @param {number} Y
 * @returns {number}
 */
const getValueInSoluce = (X, Y) => {
  return parseInt(soluceTab[X][Y], 10);
};

//Function that work 100%
function getMissingX(X) {
  let stockPresent = [[], []];
  let stockPossibleVal = Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  let stockPossiblePos = Array(0, 1, 2, 3, 4, 5, 6, 7, 8);
  for (let k = 0; k <= 8; k++) {
    if (soluceTab[X][k]) {
      stockPresent[1].push(soluceTab[X][k]);
      stockPresent[0].push(k);
    }
  }
  stockPresent[1].forEach(nbPresent => {
    posX = 0;
    stockPossibleVal.forEach(nbPossible => {
      if (nbPresent == nbPossible) {
        stockPossibleVal.splice(posX, 1);
      }
      posX++;
    });
  });
  let nbRet = 0;
  stockPresent[0].forEach(posX => {
    stockPossiblePos.splice(posX - nbRet, 1);
    nbRet++;
  });
  return Array(stockPossiblePos, stockPossibleVal);
}
function getMissingY(Y) {
  let stockPresent = [[], []];
  let stockPossibleVal = Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  let stockPossiblePos = Array(0, 1, 2, 3, 4, 5, 6, 7, 8);
  for (let k = 0; k <= 8; k++) {
    if (soluceTab[k][Y]) {
      stockPresent[1].push(soluceTab[k][Y]);
      stockPresent[0].push(k);
    }
  }
  stockPresent[1].forEach(nbPresent => {
    posX = 0;
    stockPossibleVal.forEach(nbPossible => {
      if (nbPresent == nbPossible) {
        stockPossibleVal.splice(posX, 1);
      }
      posX++;
    });
  });
  let nbRet = 0;
  stockPresent[0].forEach(posX => {
    stockPossiblePos.splice(posX - nbRet, 1);
    nbRet++;
  });
  return Array(stockPossiblePos, stockPossibleVal);
}
function fullCheckCube(X, Y) {
  //Take the coord of the cube and send wich numbers are missing and where are numbers missing
  let stockPossibleVal = Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  let stockPresent = [[], [], []]; // hold in [[x coord of absent value],[y coord of absent value],[absent]]
  let stockMissing = [[], [], []]; // hold in [[x coord of absent value],[y coord of absent value],[present value]]
  for (let h = 0; h <= 2; h++) {
    for (let g = 0; g <= 2; g++) {
      stockPossibleVal.forEach(nbPossible => {
        if (nbPossible == soluceTab[X + h][Y + g]) {
          stockPresent[2].push(nbPossible);
          stockPresent[0].push(X + h);
          stockPresent[1].push(Y + g);
        }
      });
      if (soluceTab[X + h][Y + g] == '') {
        stockMissing[0].push(X + h);
        stockMissing[1].push(Y + g);
      }
    }
  }

  stockPresent[2].forEach(nbPresent => {
    posX = 0;
    stockPossibleVal.forEach(nbPossible => {
      if (nbPresent == nbPossible) {
        stockPossibleVal.splice(posX, 1);
      }
      posX++;
    });
  });
  stockMissing[2] = stockPossibleVal;
  return Array(stockPresent, stockMissing);
}
const verifyIntegrity = () => {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const thisCellValue = getValueInSoluce(x, y);

      for (let t = 0; t < 8; t++) {
        let thisTestCellValue;
        if (t !== y) {
          thisTestCellValue = getValueInSoluce(x, t);

          if (thisTestCellValue && thisTestCellValue === thisCellValue) {
            return false;
          }
        }
        if (t !== x) {
          thisTestCellValue = getValueInSoluce(t, y);

          if (thisTestCellValue && thisTestCellValue === thisCellValue) {
            return false;
          }
        }

        const topLeftSubX = getXCube(x);
        const topLeftSubY = getYCube(y);

        for (let subX = 0; subX < 3; subX++) {
          for (let subY = 0; subY < 3; subY++) {
            if (topLeftSubX + subX !== x && topLeftSubY + subY !== y) {
              thisTestCellValue = getValueInSoluce(topLeftSubX + subX, topLeftSubY + subY);

              if (thisTestCellValue && thisTestCellValue === thisCellValue) {
                return false;
              }
            }
          }
        }
      }
    }
  }
  return true;
};
/**
 * Calcul the possible value of a cell and returns them
 * @param {*} X
 * @param {*} Y
 */
const getPossibleValues = (X, Y) => {
  const possibleValuesSubgrid = getMissingSubgrid(X, Y);
  const possibleValueX = getMissingX(X);
  const possibleValueY = getMissingY(Y);
  return findPossible(possibleValueX[1], possibleValueY[1], possibleValuesSubgrid);
};
function findPossible(absX, absY, absC) {
  //Get all missing value on X,Y,Cube and delete all those that are not in the three
  let stockPossible = Array(Array(1, 2, 3, 4, 5, 6, 7, 8, 9), Array(0, 0, 0, 0, 0, 0, 0, 0, 0));
  let stockgood = [];
  let pos = 0;
  stockPossible[0].forEach(valPos => {
    absX.forEach(nbX => {
      if (nbX == valPos) {
        stockPossible[1][pos]++;
      }
    });
    absY.forEach(nbY => {
      if (nbY == valPos) {
        stockPossible[1][pos]++;
      }
    });
    absC.forEach(nbC => {
      if (nbC == valPos) {
        stockPossible[1][pos]++;
      }
    });
    if (stockPossible[1][pos] == 3) {
      stockgood.push(valPos);
    }
    pos++;
  });
  return stockgood;
}
function createTable() {
  let sudoku;
  for (let x = 0; x <= 8; x++) {
    sudoku += '<tr>';
    for (let y = 0; y <= 8; y++) {
      if (x == 3 || x == 6) {
        if (y == 2 || y == 5) {
          sudoku +=
            '<th class="rightborder topborder"><input id=input' +
            x +
            y +
            ' type="text" value=""></th>';
        } else {
          sudoku += '<th class="topborder"><input id=input' + x + y + ' type="text" value=""></th>';
        }
      } else {
        if (y == 2 || y == 5) {
          sudoku +=
            '<th class="rightborder"><input id=input' + x + y + ' type="text" value=""></th>';
        } else {
          sudoku += '<th><input id=input' + x + y + ' type="text" value=""></th>';
        }
      }
    }
    sudoku += '</tr>';
  }
  document.getElementById('table').innerHTML += sudoku;
}
function search(table, value) {
  //Find a value in the table
  for (let j = 0; j < table.length; j++) {
    if (table[j] === value) {
      return j;
    }
  }
  return false;
}
function findIfPossible(possibleValue, ourValue) {
  possibleValue.forEach(possibleV => {
    if (ourValue == possibleV) {
      return true;
    }
  });
  return false;
}
function getYCube(Y) {
  //Identify the cube wich correspond to this Y exemple for the Y = 0,1,2, it's the first Cube on Y ...
  if (Y == 0 || Y == 1 || Y == 2) {
    goodY = 0;
  } else if (Y == 3 || Y == 4 || Y == 5) {
    goodY = 3;
  } else goodY = 6;
  return goodY;
}
function getXCube(X) {
  //Identify the cube wich correspond to this X exemple for the x = 0,1,2, it's the first Cube on X ...
  if (X == 0 || X == 1 || X == 2) {
    goodX = 0;
  } else if (X == 3 || X == 4 || X == 5) {
    goodX = 3;
  } else goodX = 6;
  return goodX;
}
function getCloseCube(X, Y) {
  //Return wich cube have to be checked when we send Ours exemple, if we send the cube at 0 - 0 we send [0,2,2,0] for [Top,Rigth,Bottom,Left] because there are 2 on right and 2 on bottom
  if (X == 0 && Y == 0) {
    return [0, 2, 2, 0];
  } else if (X == 3 && Y == 0) {
    return [0, 1, 2, -1];
  } else if (X == 6 && Y == 0) {
    return [0, 0, 2, -2];
  } else if (X == 0 && Y == 3) {
    return [-1, 2, 1, 0];
  } else if (X == 3 && Y == 3) {
    return [-1, 1, 1, -1];
  } else if (X == 6 && Y == 3) {
    return [-1, 0, 1, -2];
  } else if (X == 0 && Y == 6) {
    return [-2, 2, 0, 0];
  } else if (X == 3 && Y == 6) {
    return [-2, 1, 0, -1];
  } else if (X == 6 && Y == 6) {
    return [-2, 0, 0, -2];
  }
}
//FillThing
function fillTableEasy() {
  clearTable();
  document.getElementById('input' + 0 + 1).value = 3;
  document.getElementById('input' + 0 + 2).value = 2;
  document.getElementById('input' + 0 + 4).value = 5;
  document.getElementById('input' + 0 + 6).value = 1;
  document.getElementById('input' + 1 + 1).value = 4;
  document.getElementById('input' + 1 + 3).value = 6;
  document.getElementById('input' + 1 + 5).value = 2;
  document.getElementById('input' + 1 + 8).value = 7;
  document.getElementById('input' + 2 + 0).value = 1;
  document.getElementById('input' + 2 + 3).value = 7;
  document.getElementById('input' + 2 + 6).value = 5;
  document.getElementById('input' + 2 + 7).value = 4;

  document.getElementById('input' + 3 + 2).value = 1;
  document.getElementById('input' + 3 + 4).value = 9;
  document.getElementById('input' + 3 + 7).value = 7;
  document.getElementById('input' + 3 + 8).value = 3;
  document.getElementById('input' + 4 + 0).value = 8;
  document.getElementById('input' + 4 + 2).value = 6;
  document.getElementById('input' + 4 + 5).value = 3;
  document.getElementById('input' + 4 + 6).value = 2;
  document.getElementById('input' + 5 + 1).value = 7;
  document.getElementById('input' + 5 + 3).value = 8;
  document.getElementById('input' + 5 + 4).value = 4;
  document.getElementById('input' + 5 + 7).value = 9;

  document.getElementById('input' + 6 + 0).value = 3;
  document.getElementById('input' + 6 + 3).value = 9;
  document.getElementById('input' + 6 + 4).value = 6;
  document.getElementById('input' + 6 + 8).value = 8;
  document.getElementById('input' + 7 + 1).value = 8;
  document.getElementById('input' + 7 + 2).value = 4;
  document.getElementById('input' + 7 + 5).value = 7;
  document.getElementById('input' + 7 + 8).value = 1;
  document.getElementById('input' + 8 + 0).value = 5;
  document.getElementById('input' + 8 + 5).value = 4;
  document.getElementById('input' + 8 + 6).value = 7;
  document.getElementById('input' + 8 + 7).value = 3;
}
function fillTableMedium() {
  clearTable();
  document.getElementById('input' + 0 + 0).value = 6;
  document.getElementById('input' + 0 + 1).value = 4;
  document.getElementById('input' + 0 + 4).value = 3;
  document.getElementById('input' + 0 + 8).value = 7;
  document.getElementById('input' + 1 + 0).value = 5;
  document.getElementById('input' + 1 + 2).value = 1;
  document.getElementById('input' + 1 + 4).value = 7;
  document.getElementById('input' + 1 + 6).value = 9;
  document.getElementById('input' + 2 + 7).value = 1;

  document.getElementById('input' + 3 + 2).value = 4;
  document.getElementById('input' + 3 + 3).value = 9;
  document.getElementById('input' + 3 + 5).value = 8;
  document.getElementById('input' + 3 + 7).value = 6;
  document.getElementById('input' + 4 + 1).value = 8;
  document.getElementById('input' + 4 + 5).value = 3;
  document.getElementById('input' + 4 + 7).value = 2;
  document.getElementById('input' + 5 + 3).value = 4;

  document.getElementById('input' + 6 + 0).value = 4;
  document.getElementById('input' + 6 + 3).value = 1;
  document.getElementById('input' + 6 + 4).value = 5;
  document.getElementById('input' + 6 + 5).value = 7;
  document.getElementById('input' + 6 + 7).value = 3;
  document.getElementById('input' + 7 + 0).value = 2;
  document.getElementById('input' + 7 + 2).value = 8;
  document.getElementById('input' + 7 + 3).value = 3;
  document.getElementById('input' + 7 + 7).value = 4;
  document.getElementById('input' + 8 + 0).value = 7;
  document.getElementById('input' + 8 + 1).value = 5;
  document.getElementById('input' + 8 + 7).value = 9;
  document.getElementById('input' + 8 + 8).value = 6;
}
function fillTableHard() {
  clearTable();
  document.getElementById('input' + 0 + 0).value = 5;
  document.getElementById('input' + 0 + 1).value = 8;
  document.getElementById('input' + 0 + 2).value = 6;
  document.getElementById('input' + 0 + 4).value = 7;
  document.getElementById('input' + 1 + 3).value = 9;
  document.getElementById('input' + 1 + 5).value = 1;
  document.getElementById('input' + 1 + 6).value = 6;
  document.getElementById('input' + 2 + 3).value = 6;

  document.getElementById('input' + 3 + 2).value = 7;
  document.getElementById('input' + 4 + 0).value = 9;
  document.getElementById('input' + 4 + 2).value = 2;
  document.getElementById('input' + 4 + 4).value = 1;
  document.getElementById('input' + 4 + 6).value = 3;
  document.getElementById('input' + 4 + 8).value = 5;
  document.getElementById('input' + 5 + 2).value = 5;
  document.getElementById('input' + 5 + 4).value = 9;

  document.getElementById('input' + 6 + 1).value = 9;
  document.getElementById('input' + 6 + 4).value = 4;
  document.getElementById('input' + 6 + 8).value = 8;
  document.getElementById('input' + 7 + 2).value = 3;
  document.getElementById('input' + 7 + 3).value = 5;
  document.getElementById('input' + 7 + 7).value = 6;
  document.getElementById('input' + 8 + 4).value = 2;
  document.getElementById('input' + 8 + 6).value = 4;
  document.getElementById('input' + 8 + 7).value = 7;
}
function fillTableVeryHard() {
  clearTable();
  document.getElementById('input' + 0 + 6).value = 3;
  document.getElementById('input' + 1 + 2).value = 1;
  document.getElementById('input' + 1 + 5).value = 7;
  document.getElementById('input' + 1 + 8).value = 6;
  document.getElementById('input' + 2 + 0).value = 5;
  document.getElementById('input' + 2 + 1).value = 4;
  document.getElementById('input' + 2 + 8).value = 8;

  document.getElementById('input' + 3 + 3).value = 7;
  document.getElementById('input' + 3 + 5).value = 8;
  document.getElementById('input' + 3 + 7).value = 2;
  document.getElementById('input' + 4 + 1).value = 6;
  document.getElementById('input' + 4 + 5).value = 9;
  document.getElementById('input' + 4 + 7).value = 5;
  document.getElementById('input' + 5 + 2).value = 8;
  document.getElementById('input' + 5 + 7).value = 4;

  document.getElementById('input' + 6 + 7).value = 8;
  document.getElementById('input' + 7 + 0).value = 1;
  document.getElementById('input' + 7 + 1).value = 5;
  document.getElementById('input' + 7 + 3).value = 3;
  document.getElementById('input' + 8 + 0).value = 2;
  document.getElementById('input' + 8 + 4).value = 1;
  document.getElementById('input' + 8 + 8).value = 7;
}
function fillTableImpossiblyHard() {
  clearTable();
  document.getElementById('input' + 0 + 0).value = 8;
  document.getElementById('input' + 1 + 2).value = 3;
  document.getElementById('input' + 1 + 3).value = 6;
  document.getElementById('input' + 2 + 1).value = 7;
  document.getElementById('input' + 2 + 4).value = 9;
  document.getElementById('input' + 2 + 6).value = 2;

  document.getElementById('input' + 3 + 1).value = 5;
  document.getElementById('input' + 3 + 5).value = 7;
  document.getElementById('input' + 4 + 4).value = 4;
  document.getElementById('input' + 4 + 5).value = 5;
  document.getElementById('input' + 4 + 6).value = 7;
  document.getElementById('input' + 5 + 3).value = 1;
  document.getElementById('input' + 5 + 7).value = 3;

  document.getElementById('input' + 6 + 2).value = 1;
  document.getElementById('input' + 6 + 7).value = 6;
  document.getElementById('input' + 6 + 8).value = 8;
  document.getElementById('input' + 7 + 2).value = 8;
  document.getElementById('input' + 7 + 3).value = 5;
  document.getElementById('input' + 7 + 7).value = 1;
  document.getElementById('input' + 8 + 1).value = 9;
  document.getElementById('input' + 8 + 6).value = 4;
}
function fillTableTest() {
  clearTable();
  for (let x = 0; x <= 8; x++) {
    if (x != 5 && x != 1) {
      document.getElementById('input' + 0 + x).value = x + 1;
    }
  }
  for (let y = 1; y <= 8; y++) {
    if (y >= 6) {
      document.getElementById('input' + 6 + 1).value = 9;
      document.getElementById('input' + 7 + 1).value = 3;
      document.getElementById('input' + 8 + 1).value = 1;
    } else document.getElementById('input' + y + 1).value = y + 3;
  }
  document.getElementById('input' + 1 + 3).value = 7;
  document.getElementById('input' + 2 + 3).value = 9;
  document.getElementById('input' + 2 + 4).value = 1;
  document.getElementById('input' + 2 + 5).value = 3;
  document.getElementById('input' + 1 + 5).value = 2;
}
