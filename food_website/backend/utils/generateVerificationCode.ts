export const generateVerificationCode = (length = 6): string => { // create a function that generates a random verification code of given length and returns it in string form
    // if no value is given to 'length' parameter, it will be set to 6 by default
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // characters to be used in verification code generation

    let verificationCode = ''; // variable to store the generated verification code, initialized as an empty string

    const charactersLength = characters.length; // length of 'characters' string

    /* iterate in a for loop 'length' times, every time add a character to 'verificationCode'
    to get the character to add, first generate a random decimal number b/w 0 and 1 like 0.87 0.54 etc.
    multiply the randomly generated number to 'charactersLength' and floor it to nearest integer
    the character at index of resultant number will be character added to verification code in current iteration */
    
    for (let i = 0; i < length; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return verificationCode; // return the generated verification code
};