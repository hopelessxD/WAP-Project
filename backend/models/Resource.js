const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, 
  type: { type: String, enum: ['syllabus', 'past_question', 'materials'], required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);