const express = require("express");
const router = express.Router();
const uploadToSupabaseBuffer = require("../controllers/Supabase/supabaseUpload");
const Course = require("../Models/Course");
const supabase  = require("../controllers/Supabase/SupabaseClient");

const createCourse = async (req, res) => {
  try {
    const { title, description, isFree } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (!req.userDetails) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileInfo = await uploadToSupabaseBuffer(
        file.buffer,
        file.originalname
      );
      uploadedFiles.push(fileInfo);
    }

    const course = await Course.create({
      title,
      description,
      tutor: req.userDetails.username,
      isFree: isFree === "true",
      files: uploadedFiles,
    });

    res.status(201).json({
      success: true,
      message: "Course uploaded successfully",
      data: course,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isFree } = req.body;

    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    if (title) course.title = title;
    if (description) course.description = description;
    if (isFree !== undefined) course.isFree = isFree === "true";

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToSupabaseBuffer(file.buffer, file.originalname);
        course.files.push(url);
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    // Delete files from Supabase
    for (const file of course.files) {
      const { bucket, path } = file;
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        console.error("Supabase delete error:", error.message);
      }
    }

    // Delete course from DB
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };
