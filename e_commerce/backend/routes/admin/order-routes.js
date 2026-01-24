import express from "express";

import { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus } from "../../controllers/admin/order-controller";  

const adminOrderRouter = express.Router();

adminOrderRouter.get("/get", getAllOrdersOfAllUsers);
adminOrderRouter.get("/details/:id", getOrderDetailsForAdmin);
adminOrderRouter.put("/update/:id", updateOrderStatus);

module.exports = adminOrderRouter;