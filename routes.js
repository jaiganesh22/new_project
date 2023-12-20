import express from "express";
import { populatedbcontroller, getItemsController, statisticsController, barchartcontroller, piechartcontroller, combinedapicontroller } from "./api_controller.js";

const router = express.Router();

router.get("/init-db", populatedbcontroller);
router.get("/search/:page_num/:month/:search_query/:per_page", getItemsController);
router.get("/statistics/:month", statisticsController);
router.get("/bar-chart-info/:month", barchartcontroller);
router.get("/pie-chart-info/:month", piechartcontroller);
router.get("/all-info/:month", combinedapicontroller);

export default router;