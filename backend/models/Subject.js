const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: String, required: true }
});

module.exports = mongoose.model('Subject', SubjectSchema);