const $cuerpoTabla = document.querySelector("#cuerpoTabla");
var limiteIteraciones = 0;
var showTableFlag = false;
var valueInput;
var iteracionActual = [[]];
var iteracion = [[]];
var cromosomaA1 = [12, 05, 23, 08];
var cromosomaA2 = [02, 21, 18, 03];
var cromosomaA3 = [10, 04, 13, 14];
var cromosomaA4 = [20, 01, 10, 06];
var cromosomaA5 = [01, 04, 13, 19];
var cromosomaA6 = [20, 05, 17, 01];

var valoresA1 = [12, 05, 23, 08];
var valoresA2 = [02, 21, 18, 03];
var valoresA3 = [10, 04, 13, 14];
var valoresA4 = [20, 01, 10, 06];
var valoresA5 = [01, 04, 13, 19];
var valoresA6 = [20, 05, 17, 01];

// Variable para graficación
let valoresIteraciones = new Array(6);
valoresIteraciones[0] = new Array(); // Todos los valores del individuo uno, se separarán por múltiples de 4
valoresIteraciones[1] = new Array();
valoresIteraciones[2] = new Array();
valoresIteraciones[3] = new Array();
valoresIteraciones[4] = new Array();
valoresIteraciones[5] = new Array();

valoresIteraciones[0].push(...valoresA1);
valoresIteraciones[1].push(...valoresA2);
valoresIteraciones[2].push(...valoresA3);
valoresIteraciones[3].push(...valoresA4);
valoresIteraciones[4].push(...valoresA5);
valoresIteraciones[5].push(...valoresA6);

function iniciarGen() {
    let valor = document.getElementById("ciclos").value;
    if (valor) {
        limiteIteraciones = valor;
    } else {
        limiteIteraciones = 0;
    }
    document.getElementById("cuerpoTabla").innerHTML = "";
    showTableFlag = true;
    algoritmoGenetico(cromosomaA1, cromosomaA2, cromosomaA3, cromosomaA4, cromosomaA5, cromosomaA6, 1);
}


async function algoritmoGenetico(cromosoma1, cromosoma2, cromosoma3, cromosoma4, cromosoma5, cromosoma6, numIteracion) {
    iteracionActual = [[]];
    iteracionActual[0] = cromosoma1;
    iteracionActual[1] = cromosoma2;
    iteracionActual[2] = cromosoma3;
    iteracionActual[3] = cromosoma4;
    iteracionActual[4] = cromosoma5;
    iteracionActual[5] = cromosoma6;


    //Calculo de Fx
    //Se coloca en columna 4
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][4] = (iteracionActual[i][0] + (2 * iteracionActual[i][1]) + (3 * iteracionActual[i][2]) + (4 * iteracionActual[i][3])) - 30;
    }

    //Calculo de fitness
    //Se coloca en la columna 5
    let totalFitness = 0;
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][5] = parseFloat((1 / (1 + iteracionActual[i][4])).toFixed(9));
        totalFitness += iteracionActual[i][5];
    }

    //Calculo de probabilidad
    //Se coloca en la columna 6
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][6] = parseFloat((iteracionActual[i][5] / totalFitness).toFixed(9));
    }

    //Probabilidad acumulada
    //Se coloca en columna 7
    let probabilidadAcum = 0;
    for (let i = 0; i < 6; i++) {
        probabilidadAcum += iteracionActual[i][6];
        iteracionActual[i][7] = parseFloat(probabilidadAcum.toFixed(9));
    }

    //Numero random
    //Se coloca en columna 8
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][8] = parseFloat(Math.random().toFixed(3));
    }

    //Se busca el rango al que pertenecen
    //Columna 9
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][9] = buscarRango(generarArreglo(iteracionActual, 7), iteracionActual[i][8]);
    }


    //Se reacomodan los cromosomas
    //Columna 10,11,12,13
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][10] = iteracionActual[iteracionActual[i][9]][0];
        iteracionActual[i][11] = iteracionActual[iteracionActual[i][9]][1];
        iteracionActual[i][12] = iteracionActual[iteracionActual[i][9]][2];
        iteracionActual[i][13] = iteracionActual[iteracionActual[i][9]][3];
    }

    //Numeros random
    //Columna 14
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][14] = parseFloat(Math.random().toFixed(3));
    }

    //Seleccionados para el crossover
    //Columna 15
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][15] = (iteracionActual[i][14] <= .25) ? 1 : 0;
    }

    //Columna de reacomodo
    //Columna 16
    let crossoverArray = new Array();
    crossoverArray[0] = new Array();
    crossoverArray[1] = new Array();
    for (let i = 0; i < 6; i++) {

        if (iteracionActual[i][15] == 1) {
            crossoverArray[0].push(i);
            crossoverArray[1].push(i);
        }
    }
    let mezclaExitosa = false;
    let total = 0;
    if (crossoverArray[0].length > 1) {
        crossoverArray[1].sort(() => Math.random() - 0.5);
        while (!mezclaExitosa) {
            for (let i = 0; i < crossoverArray[1].length; i++) {
                if (crossoverArray[0][i] == crossoverArray[1][i]) {
                    total = 0;
                    await crossoverArray[1].sort(() => Math.random() - 0.5);
                    break;
                } else {
                    total++;
                }
            }

            if (total == crossoverArray[0].length) {
                mezclaExitosa = true;
            } else {
                total = 0;
            }
        }
    }

    for (let i = 0; i < 6; i++) {
        iteracionActual[i][16] = i;
        for (let j = 0; j < crossoverArray[0].length; j++) {
            if (i == crossoverArray[0][j]) {
                iteracionActual[i][16] = crossoverArray[1][j];
            }
        }
    }

    //Corte de crossover
    //Columna 17
    for (let i = 0; i < 6; i++) {
        if (iteracionActual[i][15] == 1 && crossoverArray[0].length > 1) {
            iteracionActual[i][17] = Math.floor(Math.random() * ((3 + 1) - 1) + 1);
        } else {
            iteracionActual[i][17] = 0;
        }
    }


    //Reacomodo de los genes
    //Columnas 18,19,20,21
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][18] = iteracionActual[i][10];
        iteracionActual[i][19] = iteracionActual[i][11];
        iteracionActual[i][20] = iteracionActual[i][12];
        iteracionActual[i][21] = iteracionActual[i][13];
    }

    for (let i = 0; i < crossoverArray[0].length; i++) {
        let renglonOrigianl = crossoverArray[0][i];
        let rengloNuevo = crossoverArray[1][i];

        //Solo se cambia si sale 2 o mas
        iteracionActual[renglonOrigianl][19] = (iteracionActual[renglonOrigianl][17] >= 2) ? iteracionActual[renglonOrigianl][11] : iteracionActual[rengloNuevo][11];
        //Solo se cambia si sale 3
        iteracionActual[renglonOrigianl][20] = (iteracionActual[renglonOrigianl][17] == 3) ? iteracionActual[renglonOrigianl][12] : iteracionActual[rengloNuevo][12];
        //El ultimo siempre se cambia y el primero se mantiene igual
        iteracionActual[renglonOrigianl][13] = iteracionActual[rengloNuevo][21];
    }

    //Reacomodo de cromosomas
    //columnas 22,23,24,25
    for (let i = 0; i < 6; i++) {
        iteracionActual[i][22] = iteracionActual[i][18];
        iteracionActual[i][23] = iteracionActual[i][19];
        iteracionActual[i][24] = iteracionActual[i][20];
        iteracionActual[i][25] = iteracionActual[i][21];
    }

    //El ratio es de 10%
    let mutacion = Math.floor(Math.random() * ((100 + 1) - 1) + 1);
    let aviso = '--';
    if (mutacion <= 10) {
        //console.log('Si hay mutación');
        let posicion1 = 0;
        let posicion2 = 0;
        do {
            posicion1 = Math.floor(Math.random() * ((24 + 1) - 1) + 1);
            posicion2 = Math.floor(Math.random() * ((24 + 1) - 1) + 1);
        } while (posicion1 == posicion2);
        let nuevoGen1 = Math.floor(Math.random() * ((30 + 1) - 1) + 1);
        let nuevoGen2 = Math.floor(Math.random() * ((30 + 1) - 1) + 1);


        nuevaMutacion(posicion1, nuevoGen1);
        nuevaMutacion(posicion2, nuevoGen2);
        aviso = 'MM';
    }

    //En caso de que se esten mostrando las tablas
    if (showTableFlag) {
        mostrarTabla(iteracionActual, aviso);
    }

    let nuevoCromosoma1 = [iteracionActual[0][22], iteracionActual[0][23], iteracionActual[0][24], iteracionActual[0][25]];
    let nuevoCromosoma2 = [iteracionActual[1][22], iteracionActual[1][23], iteracionActual[1][24], iteracionActual[1][25]];
    let nuevoCromosoma3 = [iteracionActual[2][22], iteracionActual[2][23], iteracionActual[2][24], iteracionActual[2][25]];
    let nuevoCromosoma4 = [iteracionActual[3][22], iteracionActual[3][23], iteracionActual[3][24], iteracionActual[3][25]];
    let nuevoCromosoma5 = [iteracionActual[4][22], iteracionActual[4][23], iteracionActual[4][24], iteracionActual[4][25]];
    let nuevoCromosoma6 = [iteracionActual[5][22], iteracionActual[5][23], iteracionActual[5][24], iteracionActual[5][25]];

    let nuevoValorCromosoma1 = [iteracionActual[0][22], iteracionActual[0][23], iteracionActual[0][24], iteracionActual[0][25]];
    let nuevoValorCromosoma2 = [iteracionActual[1][22], iteracionActual[1][23], iteracionActual[1][24], iteracionActual[1][25]];
    let nuevoValorCromosoma3 = [iteracionActual[2][22], iteracionActual[2][23], iteracionActual[2][24], iteracionActual[2][25]];
    let nuevoValorCromosoma4 = [iteracionActual[3][22], iteracionActual[3][23], iteracionActual[3][24], iteracionActual[3][25]];
    let nuevoValorCromosoma5 = [iteracionActual[4][22], iteracionActual[4][23], iteracionActual[4][24], iteracionActual[4][25]];
    let nuevoValorCromosoma6 = [iteracionActual[5][22], iteracionActual[5][23], iteracionActual[5][24], iteracionActual[5][25]];

    valoresIteraciones[0].push(...nuevoValorCromosoma1);
    valoresIteraciones[1].push(...nuevoValorCromosoma2);
    valoresIteraciones[2].push(...nuevoValorCromosoma3);
    valoresIteraciones[3].push(...nuevoValorCromosoma4);
    valoresIteraciones[4].push(...nuevoValorCromosoma5);
    valoresIteraciones[5].push(...nuevoValorCromosoma6);

    /*---------------------------------------------------------------------------------------------------------*/
    if (limiteIteraciones == 0) {
        /*--------------------EL FINAL ES CUANDO FX ES CERO EN TODOS LOS CROMOSOMAS--------------------------------*/
        if ((iteracionActual[0][4] <= 1 && iteracionActual[1][4] <= 1 && iteracionActual[2][4] <= 1 && iteracionActual[3][4] <= 1 && iteracionActual[4][4] <= 1 && iteracionActual[5][4] <= 1) || numIteracion >= 1000) {
            console.log(numIteracion);
            document.getElementById("generaciones").innerHTML = "Generaciones obtenidas: " + numIteracion;
            return;
        } else {
            algoritmoGenetico(nuevoCromosoma1, nuevoCromosoma2, nuevoCromosoma3, nuevoCromosoma4, nuevoCromosoma5, nuevoCromosoma6, (numIteracion + 1));
        }
        /*
        NOTA:
        En muy raras ocaciones, FX da numeros negativos y en cuanto da numeros negativos da el caso en el que se cicla
        es por eso que agregamos como límite del método recursivo que FX sea menor o igual que 1, para que se pare.
        También es muy raro pero suele pasar que las iteraciones superan las 1000 por lo que pusimos de tope ese numero para
        evitar que se cicle, esto pasa por los numeros aleatorios, pero es muy raro.  
        */

        /*---------------------------------------------------------------------------------------------------------*/
    } else {
        /*-----------------EL FINAL DEPENDE DEL NUMERO LIMITE DE ITERACIONES---------------------------------------*/
        if (numIteracion >= limiteIteraciones) {
            document.getElementById("generaciones").innerHTML = "Generaciones obtenidas: " + numIteracion;
            return;
        } else {
            algoritmoGenetico(nuevoCromosoma1, nuevoCromosoma2, nuevoCromosoma3, nuevoCromosoma4, nuevoCromosoma5, nuevoCromosoma6, (numIteracion + 1));
        }
        /*---------------------------------------------------------------------------------------------------------*/
    }
    /*---------------------------------------------------------------------------------------------------------*/

}


function mostrarTabla(arr, aviso) {

    for (let i = 0; i < 6; i++) {
        const $tr = document.createElement("tr");


        //Primera linea de cromosomas
        let $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][0];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][1];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][2];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][3];
        $tr.appendChild($tdCromosomas);

        //Funcion f(x)
        let $tdfx = document.createElement("td");
        $tdfx.textContent = arr[i][4];
        $tr.appendChild($tdfx);

        //Fitness
        let $tdfitness = document.createElement("td");
        $tdfitness.textContent = arr[i][5];
        $tr.appendChild($tdfitness);


        //Probabilidad
        let $tdprobabilidad = document.createElement("td");
        $tdprobabilidad.textContent = arr[i][6];
        $tr.appendChild($tdprobabilidad);

        //Probabilidad Acumulada
        let $tdProbabilidadAcum = document.createElement("td");
        $tdProbabilidadAcum.textContent = arr[i][7];
        $tr.appendChild($tdProbabilidadAcum);


        //Numero Random
        let $tdNumeroRandom1 = document.createElement("td");
        $tdNumeroRandom1.textContent = arr[i][8];
        $tr.appendChild($tdNumeroRandom1);

        //Rango
        let $tdRango = document.createElement("td");
        $tdRango.textContent = arr[i][9];
        $tr.appendChild($tdRango);

        //Segunda linea de cromosomas
        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][10];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][11];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][12];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][13];
        $tr.appendChild($tdCromosomas);


        //Numero Random
        let $tdNumeroRandom2 = document.createElement("td");
        $tdNumeroRandom2.textContent = arr[i][14];
        $tr.appendChild($tdNumeroRandom2);


        //Crossover
        let $tdCrossover = document.createElement("td");
        $tdCrossover.textContent = arr[i][15];
        $tr.appendChild($tdCrossover);


        //Columna de reacomodo
        let $tdReacomodo = document.createElement("td");
        $tdReacomodo.textContent = arr[i][16];
        $tr.appendChild($tdReacomodo);

        //Corte de crossover
        let $tdCorteCrossover = document.createElement("td");
        $tdCorteCrossover.textContent = arr[i][17];
        $tr.appendChild($tdCorteCrossover);


        //Tercera linea de cromosomas
        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][18];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][19];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][20];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][21];
        $tr.appendChild($tdCromosomas);


        //ESPACIADO
        let $tdespaciado = document.createElement("td");
        $tdespaciado.textContent = "*";
        $tr.appendChild($tdespaciado);

        //Cuarta linea de cromosomas
        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][22];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][23];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][24];
        $tr.appendChild($tdCromosomas);

        $tdCromosomas = document.createElement("td");
        $tdCromosomas.textContent = arr[i][25];
        $tr.appendChild($tdCromosomas);

        $cuerpoTabla.appendChild($tr);
    }

    const $tr = document.createElement("tr");
    for (let i = 0; i < arr[0].length; i++) {

        let $tdDivision = document.createElement("td");
        $tdDivision.textContent = aviso;
        $tr.appendChild($tdDivision);

        $cuerpoTabla.appendChild($tr);
    }
}


function nuevaMutacion(posicion, nuevoGen) {
    let ajuste = 0;
    if (posicion >= 1 && posicion <= 4) {
        ajuste = 1;
    }
    if (posicion >= 5 && posicion <= 8) {
        ajuste = 2;
    }
    if (posicion >= 9 && posicion <= 12) {
        ajuste = 3;
    }
    if (posicion >= 13 && posicion <= 16) {
        ajuste = 4;
    }
    if (posicion >= 17 && posicion <= 20) {
        ajuste = 5;
    }
    if (posicion >= 21 && posicion <= 24) {
        ajuste = 6;
    }

    let renglon = ajuste - 1;
    let columna = posicion - (4 * (ajuste - 1)) + 21;
    iteracionActual[renglon][columna] = nuevoGen;
}

function generarArreglo(arr, columna) {
    let newArr = [];
    for (let i = 0; i < 6; i++) {
        newArr.push(arr[i][columna]);
    }

    return newArr;
}

function buscarRango(rangoTotal, numeroRandom) {
    let rango = 0;
    for (let i = 0; i < rangoTotal.length; i++) {
        if ((i + 1) <= rangoTotal.length) {
            if (numeroRandom > rangoTotal[i] && numeroRandom < rangoTotal[i + 1]) {
                rango = i + 1;
                break;
            }
        } else {
            rango = 0;
            break;
        }
    }
    return rango;
}
