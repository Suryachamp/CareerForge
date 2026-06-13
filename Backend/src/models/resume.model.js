const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [{ type: String }]
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  dateRange: { type: String, required: true },
  highlights: [{ type: String }]
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  technologies: { type: String, required: true },
  date: { type: String, required: true },
  link: { type: String },
  highlights: [{ type: String }]
}, { _id: false });

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  location: { type: String, required: true },
  dateRange: { type: String, required: true },
  gpa: { type: String }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  atsScoreEstimate: {
    type: Number,
    required: true
  },
  atsFeedback: [{ type: String }],
  suggestedKeywords: [{ type: String }],
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    links: [linkSchema]
  },
  summary: { type: String, required: true },
  skills: [skillSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  education: [educationSchema],
  certifications: [certificationSchema],
  latexCode: { type: String, required: true },
  uuid: {
    type: String,
    unique: true,
    default: () => require("crypto").randomUUID()
  }
}, {
  timestamps: true
});

const ResumeModel = mongoose.model("Resume", resumeSchema);
module.exports = ResumeModel;
