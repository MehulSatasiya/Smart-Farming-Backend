import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe"

// Place COD Order /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);
    // console.log(amount);

    // Create Order
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Place stripe Order : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const {origin} = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData =[];

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      productData.push({
        name:product.name,
        price : product.offerPrice,
        quantity : item.quantity,
      });
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);
    // console.log(amount);

    // Create Order
   const order =  await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    //stripe gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //create line items for stripe

    const line_items = productData.map((item)=>{
      return {
        price_data:{
          currency : "inr",
          product_data:{
            name: item.name,

          },
          unit_amount: Math.floor(item.price+item.price*0.02) * 100
        },
        quantity: item.quantity,
      }
    })

//create session

const session = await stripeInstance.checkout.sessions.create({
  line_items,
  mode:"payment",
  success_url : `${origin}/loader?next=my-orders`,
  cancel_url : `${origin}/cart`,
  metadata:{
    orderId:order._id.toString(),
    userId,
  }
})


    res.json({ success: true,url:session.url, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Orders by User ID
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (Admin/Seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
