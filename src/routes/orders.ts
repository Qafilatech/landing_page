import express from 'express'

const router = express.Router();

//Mock data
const orders =[
    { "customer_id": "1", "business_id": "101", "cargo_type": "Electronics", "status": "completed", "rating": 5, "pickup_time": "2025-05-05 10:00:00", "delivery_time": "2025-05-05 14:30:00", "request_time": "2025-05-05 09:30:00" }, 
    { "customer_id": "2", "business_id": "102", "cargo_type": "Furniture", "status": "in_progress", "rating": null, "pickup_time": "2025-05-06 11:00:00", "delivery_time": "2025-05-06 16:00:00", "request_time": "2025-05-06 10:15:00" }, 
    { "customer_id": "3", "business_id": null, "cargo_type": "Documents", "status": "pending", "rating": null, "pickup_time": "2025-05-07 09:00:00", "delivery_time": "2025-05-07 09:30:00", "request_time": "2025-05-07 08:45:00" },
    { "customer_id": "1", "business_id": "103", "cargo_type": "Groceries", "status": "completed", "rating": 4, "pickup_time": "2025-05-07 15:00:00", "delivery_time": "2025-05-07 15:45:00", "request_time": "2025-05-07 14:40:00" },
    { "customer_id": "4", "business_id": "101", "cargo_type": "Appliances", "status": "canceled", "rating": null, "pickup_time": "2025-05-08 12:00:00", "delivery_time": null, "request_time": "2025-05-08 11:30:00" },
    { "customer_id": "2", "business_id": null, "cargo_type": "Clothing", "status": "pending", "rating": null, "pickup_time": "2025-05-09 13:30:00", "delivery_time": "2025-05-09 14:00:00", "request_time": "2025-05-09 13:00:00" },
    { "customer_id": "5", "business_id": "102", "cargo_type": "Books", "status": "completed", "rating": 5, "pickup_time": "2025-05-09 16:00:00", "delivery_time": "2025-05-09 17:15:00", "request_time": "2025-05-09 15:30:00" },
    { "customer_id": "3", "business_id": "103", "cargo_type": "Tools", "status": "in_progress", "rating": null, "pickup_time": "2025-05-10 10:30:00", "delivery_time": "2025-05-10 17:00:00", "request_time": "2025-05-10 10:00:00" },
    { "customer_id": "4", "business_id": null, "cargo_type": "Gifts", "status": "pending", "rating": null, "pickup_time": "2025-05-11 14:00:00", "delivery_time": "2025-05-11 14:45:00", "request_time": "2025-05-11 13:45:00" },
    { "customer_id": "5", "business_id": "101", "cargo_type": "Sporting Goods", "status": "completed", "rating": 3, "pickup_time": "2025-05-11 17:30:00", "delivery_time": "2025-05-11 18:45:00", "request_time": "2025-05-11 17:00:00" }
  ];
  
router.get('/orders', (req,res) =>{
    // 'orders' is the name of the filed route
    // We are sending back the 'orders' array as the response data
    res.json({orders:orders})
});

export default router