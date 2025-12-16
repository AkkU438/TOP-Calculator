// Global Variables (start of your script)
const buttons = document.querySelectorAll(".buttons-container li");
const display = document.querySelector(".output");

// --- REPLACED: let operators = ""; ---
// NEW State Variables:
let currentInput = '0';     // The number currently being typed (operand 2)
let previousValue = '';     // The result/first operand (operand 1)
let operator = null;        // The pending operator (+, x, ÷, -)
const operatorSymbols = ['+', '-', 'x', '÷', '%']; // List of valid operators
// Helper to perform the math evaluation
function calculate() {
    // If we only have the first value and no operator/second value, return.
    if (!operator || currentInput === '') {
        return; 
    }
    
    // Use previousValue as the first operand, operator, and currentInput as the second
    const expression = `${previousValue} ${operator.replace('x', '*').replace('÷', '/')} ${currentInput}`;
    
    try {
        const result = math.evaluate(expression);
        
        previousValue = result.toString();
        currentInput = '';
        display.textContent = previousValue; 
    } catch (error) {
        display.textContent = 'Error';
        previousValue = '';
        currentInput = '0';
        operator = null;
    }
}

// Helper to manage operator clicks and trigger calculations
function handleOperator(nextOperator) {
    // 1. If we are starting with no numbers, and the operator is not '-', just stop.
    if (currentInput === '0' && previousValue === '' && nextOperator !== '-') {
        return; 
    }

    // 2. If this is the *first* operator pressed (no operator pending)
    if (operator === null) {
        // Use currentInput as the first operand, unless it's the default '0'
        previousValue = (currentInput === '0' && previousValue === '') ? '0' : currentInput;
        currentInput = ''; // Clear input for the second operand
    } 
    // 3. If an operator is already pending (this is the *second* operator)
    else if (currentInput !== '') {
        // Force the calculation of the pending operation (this is the key step!)
        calculate(); 
    }

    // 4. Store the new operator
    operator = nextOperator;
    
    // Display the first number and the pending operator
    display.textContent = previousValue + ' ' + operator;
}

function handleButtonClick(value) {
    const isOperatorButton = operatorSymbols.includes(value);

    // --- C (Clear) ---
    if (value === "C") {
        currentInput = '0';
        previousValue = '';
        operator = null;
        display.textContent = "0";
        return;
    }
    
    // --- Equals (=) ---
    if (value === "=") {
        if (operator && currentInput !== '') {
            calculate();
            operator = null; // Calculation is complete
        }
        return;
    }

    // --- Operator Buttons (+, x, ÷, -, %) ---
    if (isOperatorButton) {
        handleOperator(value);
        return;
    }

    // --- Numbers and Dot (.) Handling ---
    // If we are starting from '0' or a new calculation, reset currentInput
    if (currentInput === '0' && value !== '.') {
        currentInput = ''; 
    }
    // Prevent multiple decimal points
    if (value === '.' && currentInput.includes('.')) {
        return;
    }
    
    // Append the number/dot
    currentInput += value;
    
    // --- Update Display & Styles ---
    display.textContent = currentInput;
    display.style.fontSize = "3em";
    display.style.textAlign = "right";
    display.style.color = "black";
}

buttons.forEach(button =>{
    button.addEventListener("click", (event)=>{
        const buttonValue = event.target.textContent;

        handleButtonClick(buttonValue);
    });
});