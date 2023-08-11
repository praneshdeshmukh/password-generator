const passwordDisplay = document.querySelector("[data-passwordDisplay]") // display result pass
const copyBtn = document.querySelector("[data-copy]") //copy img btn
const copyMsg = document.querySelector("[data-copyMsg]") // pop up msg after copying
const lengthDisplay = document.querySelector("[data-lengthNumber]") //changing no acc to slider
const inputSlider = document.querySelector("[data-lengthSlider]") //range slider

// checkboxes
const uppercaseCheck = document.querySelector("#uppercase") // input uppercase only
const lowercaseCheck = document.querySelector("#lowercase") // input lowercase only
const numbersCheck = document.querySelector("#numbers") //input numbers only
const symbolsCheck = document.querySelector("#symbols") // input symbols only
const allCheckBox = document.querySelectorAll("input[type=checkbox]") // collecting all inputs of checkbox at once

// indicator
const indicator = document.querySelector("[data-indicator]") // displaying strength of pass through circle color

// generate button
const generateBtn = document.querySelector(".generateButton") // generate pass btn

// symbols
const symbols = '~`!@#$%^&**()_-+={[}]|:;"<,>.?/';

let password = ""; // defining pass as ntg by default, not set
let passwordLength = 10; // default pass length on slider
// set default circle color to gray
uppercaseCheck.checked = true
let checkCount = 1;



// sets password length
function handleSlider() {
    inputSlider.value = passwordLength
    lengthDisplay.innerText = passwordLength 

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}
handleSlider()

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
setIndicator("#ccc")

function getRandomInteger(min,max){
    // Important
    // Math.random()*(max-min) + min
    return Math.floor(Math.random()*(max-min)) + min
}
function getRandomNumber(){
    // min - 1
    // max - 10
    return getRandomInteger(1,10);
}
function generateLowercase() {
    // a - 97
    // z - 123 
    return String.fromCharCode(getRandomInteger(97,123))
}   
function generateUppercase() {
    // A - 65
    // Z - 91 
    return String.fromCharCode(getRandomInteger(65,91))   
}   
function generateSymbol() {
    // return String.fromCharCode(getRandomInteger(65,91))   
    const randNum = getRandomInteger(0,symbols.length)
    return symbols.charAt(randNum)
}



function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true
    if (lowercaseCheck.checked) hasLower = true 
    if (numbersCheck.checked) hasNum = true
    if (symbolsCheck.checked) hasSym = true
    
    // rules
    if (hasUpper && hasLower && (hasSym || hasNum) && passwordLength >= 8)  {
        setIndicator("#0f0"); // green
    }
    else if ((hasUpper || hasLower) && (hasSym || hasNum) && passwordLength >=6) {
        setIndicator("#ff0")
    }
    else {
        setIndicator("#f00")
    }
}

// copy button and copied message pop up
async function copyContent() {
    // navigator.clipboard.writeText()
    try {

        if (password === "") {
            alert('Generate password first')
            throw 'failed'
        }
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied"
    }
    catch(e) {
     copyMsg.innerText = error
    }
    // to make copy span visible
    copyMsg.classList.add("active")

    setTimeout(() =>{
        copyMsg.classList.remove("active")
    },2000)
};

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value
    handleSlider()
});

copyBtn.addEventListener('click',()=> {
    if (passwordDisplay.value) {
    // if (passwordLength >= 0) {
        copyContent()
    }
});

function handleCheckBoxChange() {
     checkCount = 0;
     allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount += 1;
        }
     })
    //  special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider()
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array) {
    // fisher Yate Method
    for (let i = array.length - 1; i > 0; i--) {
        // finding j randomly
        const j = Math.floor(Math.random() * (i + 1));
        // swapping
        const temp = array[i];
        array[j] = temp;
    }
    let str = ""
    str = array.join("");
    // array.forEach((el) => (str = str + el))
    return str;
}

function generatePassword() {
    // none of the checkbox are selected
    if(checkCount <= 0) {
        alert('Atleast check one checkbox')
        return;
    };

    if(passwordLength < checkCount) {
     passwordLength = checkCount;
     handleSlider()   
    }
    // remove old pass
        password = "";
    // 
    // if (uppercaseCheck.checked) {
    //     password = password + generateUppercase()
    // }
    // if (lowercaseCheck.checked) {
    //     password = password + generateLowercase()
    // }
    // if (numbersCheck.checked) {
    //     password = password + getRandomNumber()    
    // }
    // if (symbolsCheck.checked) {
    //     password = password + generateSymbol()
    // }

    let functionArr = []
    if (uppercaseCheck.checked) 
        functionArr.push(generateUppercase)
    if (lowercaseCheck.checked) 
        functionArr.push(generateLowercase)
    if (numbersCheck.checked) 
        functionArr.push(getRandomNumber)
    if (symbolsCheck.checked) 
        functionArr.push(generateSymbol)

    // compulsory additon
    for(let i=0; i<functionArr.length; i++) {
        password = password + functionArr[i](); 
    }

    // remaining addition
    for(let i =0 ; i< (passwordLength - functionArr.length); i++) 
    {
        let randIndex = getRandomInteger(0, functionArr.length)
        console.log("rand Index" + randIndex);
        password = password + functionArr[randIndex]();
    }
    // shuffle password
    password = shufflePassword(Array.from(password))
 
    passwordDisplay.value = password
    // strength
    calculateStrength();
};
