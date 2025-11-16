const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tutor: { type: String, required: true },
  isFree: { type: Boolean, default: false },

  files: [
    {
      url: { type: String, required: true },
      bucket: { type: String, required: true },
      path: { type: String, required: true },
      fileName: { type: String, required: true }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", CourseSchema);
