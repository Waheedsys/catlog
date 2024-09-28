const fs = require('fs');

// Function to decode the y value from its respective base
function decodeY(base, value) {
    const decodedValue = parseInt(value, base);
    if (isNaN(decodedValue)) {
        throw new Error(`Invalid value "${value}" for base ${base}`);
    }
    return decodedValue;
}

// Function to apply Lagrange Interpolation to find the constant term 'c'
function lagrangeInterpolation(points) {
    let c = 0;
    for (let i = 0; i < points.length; i++) {
        const xi = points[i][0];
        const yi = points[i][1];
        let term = yi;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const xj = points[j][0];
                term *= (0 - xj) / (xi - xj);  // Applying Lagrange formula
            }
        }
        c += term;
    }

    // Round to the nearest integer to avoid floating-point precision errors
    return Math.round(c);
}

// Function to read and parse the input JSON file, decode values, and solve for 'c'
function findSecretConstantFromFile(fileName) {
    try {
        const inputJson = fs.readFileSync(fileName, 'utf-8');
        const data = JSON.parse(inputJson);

        // Extract the number of roots (n) and the required number of roots (k)
        const n = data.keys.n;
        const k = data.keys.k;

        // Collect the points (x, y)
        const points = [];
        for (const key in data) {
            if (key !== 'keys') {
                const x = parseInt(key);  // The x value is the key of the object
                const base = data[key].base;
                const value = data[key].value;
                const y = decodeY(base, value);  // Decode the y value based on the given base
                points.push([x, y]);
            }
        }

        // Use Lagrange interpolation to find the constant term 'c'
        const c = lagrangeInterpolation(points);
        return c;

    } catch (error) {
        console.error(`Error reading file ${fileName}:`, error.message);
        return null;
    }
}

// Run the function for test files
const testFiles = ['testcase1.json', 'testcase2.json'];
testFiles.forEach(file => {
    const secretConstant = findSecretConstantFromFile(file);
    if (secretConstant !== null) {
        console.log(`The constant term (c) of the polynomial for ${file} is: ${secretConstant}`);
    }
});
