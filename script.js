document.addEventListener("DOMContentLoaded", function () {
    // Selecting elements
    const calculatorLink = document.getElementById("calculatorLink");
    const eliminationLink = document.getElementById("eliminationLink");
    const calculatorSection = document.getElementById("calculatorSection");
    const eliminationSection = document.getElementById("eliminationSection");

    // Hide the elimination section initially
    eliminationSection.style.display = "none";

    // Add event listeners to the links
    calculatorLink.addEventListener("click", function () {
        calculatorSection.style.display = "block";
        eliminationSection.style.display = "none";
    });

    eliminationLink.addEventListener("click", function () {
        calculatorSection.style.display = "none";
        eliminationSection.style.display = "block";
    });

    const resultCalculatorTextArea = document.getElementById("resultCalculator");
    const resultEliminationTextArea = document.getElementById("resultElimination");

    document.getElementById("createMatrixA").addEventListener("click", function () {
        createMatrix("matrixAInput", "rowsA", "colsA");
    });

    document.getElementById("createMatrixB").addEventListener("click", function () {
        createMatrix("matrixBInput", "rowsB", "colsB");
    });

    document.getElementById("createMatrixR").addEventListener("click", function () {
        createMatrix("matrixRInput", "rowsR", "colsR");
    });

    document.getElementById("add").addEventListener("click", function () {
        performOperation("add");
    });

    document.getElementById("subtract").addEventListener("click", function () {
        performOperation("subtract");
    });

    document.getElementById("multiply").addEventListener("click", function () {
        performOperation("multiply");
    });

    document.getElementById("reducedRowEchelon").addEventListener("click", function () {
        performOperation("reducedRowEchelon");
    });

    document.getElementById("rowEchelon").addEventListener("click", function () {
        performOperation("rowEchelon");
    });

    function createMatrix(containerId, rowsId, colsId) {
        const container = document.getElementById(containerId);
        const rows = parseInt(document.getElementById(rowsId).value);
        const cols = parseInt(document.getElementById(colsId).value);

        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
            alert("Invalid dimensions!");
            return;
        }

        container.innerHTML = "";

        for (let i = 0; i < rows; i++) {
            const rowDiv = document.createElement("div");
            for (let j = 0; j < cols; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.className = "matrix-element";
                input.setAttribute("placeholder", "0");
                rowDiv.appendChild(input);
            }
            container.appendChild(rowDiv);
        }
    }

    function performOperation(operation) {
        let result;
        if (operation === "add" || operation === "subtract" || operation === "multiply") {
            const matrixA = parseMatrix("matrixAInput");
            const matrixB = parseMatrix("matrixBInput");

            if (operation === "add") {
                result = addMatrices(matrixA, matrixB);
            } else if (operation === "subtract") {
                result = subtractMatrices(matrixA, matrixB);
            } else if (operation === "multiply") {
                result = multiplyMatrices(matrixA, matrixB);
            }

            resultCalculatorTextArea.value = result ? matrixToString(result) : "Invalid operation!";
        } else if (operation === "reducedRowEchelon" || operation === "rowEchelon") {
            const matrixR = parseMatrix("matrixRInput");

            if (operation === "rowEchelon") {
                result = rowEchelonMatrix(matrixR);
            } else if (operation === "reducedRowEchelon") {
                result = reducedRowEchelonMatrix(matrixR);
            }

            resultEliminationTextArea.value = result ? matrixToString(result) : "Invalid operation!";
        }
    }

    function parseMatrix(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const rows = container.children.length;
        const cols = container.children[0].children.length;
        const matrix = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            const rowInputs = container.children[i].querySelectorAll(".matrix-element");
            for (let j = 0; j < cols; j++) {
                row.push(parseFloat(rowInputs[j].value));
            }
            matrix.push(row);
        }

        return matrix;
    }

    function addMatrices(matrixA, matrixB) {
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            alert("Matrices must have the same dimensions for addition!");
            return null;
        }

        const result = [];
        for (let i = 0; i < matrixA.length; i++) {
            const newRow = [];
            for (let j = 0; j < matrixA[i].length; j++) {
                newRow.push(matrixA[i][j] + matrixB[i][j]);
            }
            result.push(newRow);
        }
        return result;
    }

    function subtractMatrices(matrixA, matrixB) {
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            alert("Matrices must have the same dimensions for subtraction!");
            return null;
        }

        const result = [];
        for (let i = 0; i < matrixA.length; i++) {
            const newRow = [];
            for (let j = 0; j < matrixA[i].length; j++) {
                newRow.push(matrixA[i][j] - matrixB[i][j]);
            }
            result.push(newRow);
        }
        return result;
    }

    function multiplyMatrices(matrixA, matrixB) {
        const rowsA = matrixA.length;
        const colsA = matrixA[0].length;
        const rowsB = matrixB.length;
        const colsB = matrixB[0].length;

        if (colsA !== rowsB) {
            alert("Number of columns in Matrix A must be equal to the number of rows in Matrix B for multiplication!");
            return null;
        }

        const result = [];
        for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
                result[i][j] = 0;
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += matrixA[i][k] * matrixB[k][j];
                }
            }
        }
        return result;
    }

    function matrixToString(matrix) {
        return matrix.map(row => row.join("\t")).join("\n");
    }

    function rowEchelonMatrix(matrixR) {
        const m = matrixR.length;
        const n = matrixR[0].length;
        let lead = 0;

        // Copy the input matrix to the result matrix
        const result = matrixR.map(row => [...row]);

        for (let r = 0; r < m; r++) {
            if (lead >= n) {
                return result;
            }

            let i = r;
            while (result[i][lead] === 0) {
                i++;
                if (i === m) {
                    i = r;
                    lead++;
                    if (n === lead) {
                        return result;
                    }
                }
            }

            [result[i], result[r]] = [result[r], result[i]];

            const lv = result[r][lead];
            result[r] = result[r].map(x => x / lv);

            for (let i = r + 1; i < m; i++) {
                const lv = result[i][lead];
                for (let j = lead; j < n; j++) {
                    result[i][j] -= lv * result[r][j];
                }
            }

            lead++;
        }

        return result;
    }

    function reducedRowEchelonMatrix(matrixR) {
        const m = matrixR.length;
        const n = matrixR[0].length;
        let lead = 0;

        // Copy the input matrix to the result matrix
        const result = matrixR.map(row => [...row]);

        for (let r = 0; r < m; r++) {
            if (lead >= n) {
                return result;
            }

            let i = r;
            while (result[i][lead] === 0) {
                i++;
                if (i === m) {
                    i = r;
                    lead++;
                    if (n === lead) {
                        return result;
                    }
                }
            }

            [result[i], result[r]] = [result[r], result[i]];

            const lv = result[r][lead];
            result[r] = result[r].map(x => x / lv);

            for (let i = 0; i < m; i++) {
                if (i !== r) {
                    const lv = result[i][lead];
                    result[i] = result[i].map((x, j) => x - lv * result[r][j]);
                }
            }

            lead++;
        }

        return result;
    }

});
