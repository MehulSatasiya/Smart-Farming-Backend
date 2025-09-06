import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized: No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Not Authorized: Invalid token" });
    }

    // req.userId = { _id: decoded.id };
    req.userId = decoded.id ;
    // console.log("Authenticated User ID:", req.userId);
    // console.log("decoded User ID:", decoded);

    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token verification failed" });
  }
};

export default authUser;
