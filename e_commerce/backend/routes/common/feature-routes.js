import express from "express";

import { addFeatureImage, getFeatureImages } from "../../controllers/common/feature-controller";

const commonFeatureRouter = express.Router();

commonFeatureRouter.post("/add", addFeatureImage);
commonFeatureRouter.get("/get", getFeatureImages);

module.exports = commonFeatureRouter;