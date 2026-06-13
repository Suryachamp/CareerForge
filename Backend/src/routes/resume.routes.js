const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const resumeController = require("../controllers/resume.controller");

const resumeRouter = express.Router();

resumeRouter.post(
  "/generate",
  authMiddleware.authUser,
  resumeController.generateResumeController
);

resumeRouter.get(
  "/",
  authMiddleware.authUser,
  resumeController.getAllResumesController
);

resumeRouter.get(
  "/:id",
  authMiddleware.authUser,
  resumeController.getResumeController
);

module.exports = resumeRouter;
