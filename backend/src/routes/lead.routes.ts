import { Router } from "express";
import { verifyJWT } from "../middlewarrs/auth.middleware.js";
import { createLead, deleteLead, exportLeadsCSV, getAllLeads, getSingleLead, updateLead } from "../controllers/lead.controller.js";


const router = Router();



router.route("/")
    .post(verifyJWT, createLead)
    .get(verifyJWT, getAllLeads);



router.route("/:id")
  .get(verifyJWT, getSingleLead)
  .patch(verifyJWT, updateLead)
  .delete(verifyJWT, deleteLead);


router.route("/export/csv").get(verifyJWT,exportLeadsCSV);



export default router;