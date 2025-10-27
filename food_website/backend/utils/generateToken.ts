import jwt from "jsonwebtoken"; // import 'jwt' object from 'jsonwebtoken' library to generate and verify JSON web tokens
import { IUserDocument } from "../models/user.model"; // import 'IUserDocument' interface from 'user.model' file
import { Response } from "express"; // import 'Response' object from 'express' library to handle HTTP responses

export const generateToken = (res: Response, user: IUserDocument) => { // create a function named 'generateToken' to generate a JSON web token
    const token = jwt.sign( // create a JSON web token using 'sign' method
        { userId: user._id }, // unique ID of a document of 'user' collection is payload ie data for which JWT is generated
        process.env.SECRET_KEY!, // secret key used to generate digital signature for JWT which will change if token is tampered, to ensure security by disallowing it's access and interactions
        { expiresIn: '1d' }); // the token expires in 1 day
    
    res.cookie("token", token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
    /* set value of 'token' cookie of response object to 'token' generated
    'httpOnly: true' means that cookie will only be accessed and used in HTTP and HTTPS sites, this ensures security
    'sameSite: strict' means that cookie is only sent to URL from which request was made, cookie will expire in 24 hours */
    
    return token; // return the token generated
}