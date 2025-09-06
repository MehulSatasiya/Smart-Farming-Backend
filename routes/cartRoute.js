import express from "express"; // ✅ use express, not mongoose
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";

const cartRouter = express.Router(); // ✅ Correct router declaration

cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
