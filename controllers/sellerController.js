import jwt from 'jsonwebtoken';

// Seller Login: POST /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie("sellertoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: "Logged in successfully" });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } 
  catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


// Seller Auth: GET /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    const { email } = req.seller;  
    return res.json({ success: true, message: "Authorized", email });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};




// Seller Logout: GET /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellertoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
