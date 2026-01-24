import express from "express";

import { addAddress, fetchAllAddress, editAddress, deleteAddress } from "../../controllers/shop/address-controller";

const shopAddressRouter = express.Router();

shopAddressRouter.post("/add", addAddress);
shopAddressRouter.get("/get/:userId", fetchAllAddress);
shopAddressRouter.delete("/delete/:userId/:addressId", deleteAddress);
shopAddressRouter.put("/update/:userId/:addressId", editAddress);

module.exports = shopAddressRouter;