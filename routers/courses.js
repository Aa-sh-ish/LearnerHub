const courseRouter = require("express").Router();
const upload = require("../Middleware/uploadFiles"); // Multer memory storage
const courseController = require("../controllers/coursesControllers");
const verifyToken = require("../Middleware/verifyToken")

courseRouter.post("/create-course", verifyToken.verifyAdmin,  upload.array("files", 20), courseController.createCourse);

courseRouter.get("/get-courses", verifyToken.verifyToken, courseController.getCourses);

courseRouter.get("/get-course/:id", verifyToken.verifyToken, courseController.getCourseById);

courseRouter.put("/update-course/:id", verifyToken.verifyAdmin, upload.array("files", 20), courseController.updateCourse);

courseRouter.delete("/delete-course/:id", verifyToken.verifyAdmin, courseController.deleteCourse);

module.exports = courseRouter;
