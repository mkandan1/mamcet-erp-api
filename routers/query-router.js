import express from "express";
import {
  getDocuments,
  getQueries,
} from "../controllers/query-controller.js";
const queryRoute = express.Router();

queryRoute.route("/query").get(getQueries);
queryRoute.route("/documents").get(getDocuments);
export { queryRoute };
