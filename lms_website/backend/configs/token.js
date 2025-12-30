import jwt from "jsonwebtoken"; // import jsonwebtoken library to generate signed jwt tokens for authentication

export const genToken = async (userId) => { // define a function to generate a jwt for user authentication that takes userId to embed user identity inside the token
    try {
        let token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" }); // create a signed jwt containing user id with a 7 day expiry using server secret
        return token; // return generated token so it can be sent to client or stored
    } catch (error) {
        console.log("token error"); // log token generation failure for debugging
    }
};