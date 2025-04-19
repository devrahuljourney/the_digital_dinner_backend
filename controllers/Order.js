const { pgPool } = require("../config/database");

exports.createOrder = async (req, res) => {
    const pool = pgPool();
    const { phone, address, cartItems, name, email } = req.body;
  
    if (!phone || !address || !cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Phone, address, and cart items are required",
      });
    }
  
    let userId;
  
    try {
      let userResult = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
  
      if (userResult.rows.length === 0) {
        console.log("User not found, creating new user...");
  
        const newUserResult = await pool.query(
          "INSERT INTO users (name, phone, email) VALUES ($1, $2, $3) RETURNING id",
          [name, phone, email]
        );
  
        userId = newUserResult.rows[0].id;
        console.log(`Created new user with ID: ${userId}`);
      } else {
        userId = userResult.rows[0].id;
        console.log(`Found existing user with ID: ${userId}`);
      }
  
      const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
  
      const orderResult = await pool.query(
        "INSERT INTO orders (user_id, total_price, address) VALUES ($1, $2, $3) RETURNING id",
        [userId, totalPrice, address]
      );
  
      const orderId = orderResult.rows[0].id;
      console.log(`Order created with ID: ${orderId}`);
  
      const orderItemsQueries = cartItems.map(item => {
        return pool.query(
          "INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3)",
          [orderId, item.menu_item_id, item.quantity]
        );
      });
  
      await Promise.all(orderItemsQueries);
  
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId,
      });
    } catch (err) {
      console.error("❌ Error creating order:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };
  

exports.getOrdersByPhone = async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = userResult.rows[0].id;

    const ordersResult = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    if (ordersResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const orderItemsResult = await pool.query(
          "SELECT * FROM order_items WHERE order_id = $1",
          [order.id]
        );
        order.items = orderItemsResult.rows;
        return order;
      })
    );

    return res.status(200).json({
      success: true,
      orders: ordersWithItems,
    });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
