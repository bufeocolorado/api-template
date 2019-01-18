# Setup
- npm install
- npm install serverless -g
- npm install -g swagger
- npm install -g aws-sdk 
- npm install -g amazon-cognito-identity-js
- npm install -g node-fetch
- npm install serverless-offline --save-dev
- npm start

---
# API SEGURIDAD

## Authentication Flow
 - Client: Ingresa documento y numero de documento
 - Client: 
 - Client: 
 - Server: 
 - Server: 
 - Server: 
 - Client: 
 - Client: Remueve el token del local storage.

## API Reference
 - rimac/seguridad/auth/login
 
 ---
## TODOs:
- Email API service
- Loggin API service
- Audit API service

## Checklist:
- Code style (Best practices)
- Unit testing 
- Code coverage report
- Error Handler
- Loggin Handler
- Code debugging

############################################################
## Best Practice JavaScript

#String
#Bad
    const name = "Capt. Janeway";

    // template literals should contain interpolation or newlines
    const name = `Capt. Janeway`;

    const val = 'abc';
    console.log('The value is ' + val) ;
#Good
    const name = 'Capt. Janeway';

    const val = 'abc';
    console.log(`The value is ${val}`);

---
#Nomenclature
    Classes => DummyClass {...} (UpperCamelCase)
    Variables and Functions => dummyClass (camelCase)

---
#Declaration of variables
#Bad
    var value = 'abc'
#Good
    const valueConstant = 'abc'
    let valueDynamic = 'cba'; valueDynamic = 'abcdef' 

---
#Arrays
#Bad
    const items = new Array();

    const arr = [1, 2, 3, 4];
    const first = arr[0];
    const second = arr[1];
#Good
    const items = [];

    const arr = [1, 2, 3, 4];
    const [first, two, c] = arr; 

---
#Arrow Functions
#Bad
    [1, 2, 3].map(function (x) {
        const y = x + 1;
        return x * y;
    });

    [1, 2, 3].map(number => {
        const nextNumber = number + 1;
        `A string containing the ${nextNumber}.`;
    });

    foo(() => bool = true);
#Good
    [1, 2, 3].map((x) => {
        const y = x + 1;
        return x * y;
    });

    [1, 2, 3].map(number => `A string containing the ${number}.`);

    [1, 2, 3].map((number) => {
        const nextNumber = number + 1;
        return `A string containing the ${nextNumber}.`;
    });

    foo(() => {
        bool = true;
    });

---
#Comparison Operators & Equality
    Use === and !== over == and !=
    Objects evaluate to true
    Undefined evaluates to false
    Null evaluates to false
    Booleans evaluate to the value of the boolean
    Numbers evaluate to false if +0, -0, or NaN, otherwise true
    Strings evaluate to false if an empty string '', otherwise true
