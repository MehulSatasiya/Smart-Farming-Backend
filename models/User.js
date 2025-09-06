import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // fixed: 'reuired' → 'required'
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },       // fixed: should be Object, not String
  },
  { minimize: false } 
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
