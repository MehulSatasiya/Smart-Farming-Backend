import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  const { sellertoken } = req.cookies;

  if (!sellertoken) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(sellertoken, process.env.JWT_SECRET);

    if (decoded.email === process.env.SELLER_EMAIL) {
      req.seller = { email: decoded.email };  // ✅ safer place to store authenticated user data
      next(); // Continue
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authSeller;
