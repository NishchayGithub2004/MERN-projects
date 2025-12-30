import jwt from "jsonwebtoken"

const isAuth = async ( // define an authentication middleware to validate jwt from cookies and attach user identity to the request which takes the following arguments
  req, // HTTP request object containing cookies and a place to store authenticated user data
  res, // HTTP response object used to return authentication and server error responses
  next // callback to forward the request to the next middleware or route handler after successful authentication
) => {
  try {
    let { token } = req.cookies; // extract jwt token from cookies to identify and authenticate the user session

    if (!token) return res.status(400).json({ message: "user doesn't have token" }); // stop request if no token exists because authentication cannot be performed

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET); // validate token signature and decode payload using server secret to ensure authenticity

    if (!verifyToken) return res.status(400).json({ message: "user doesn't have valid token" }); // reject request if token verification fails because user identity is untrusted

    req.userId = verifyToken.userId; // attach authenticated user's id to request object for downstream authorization logic

    next(); // allow request to proceed since authentication succeeded
  } catch (error) {
    console.log(error); // log unexpected authentication errors for debugging and monitoring
    return res.status(500).json({ message: `is auth error ${error}` }); // return server error to indicate middleware failure
  }
};

export default isAuth