require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const Resource = require('./models/Resource');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Use the environment variable for your Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 Connected smoothly to MongoDB Atlas Cloud!'))
  .catch(err => console.error('Database connection error:', err));

// ROUTE 1: Get all subjects grouped by Year for the homepage dashboard
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    
    const dashboardData = {
      "First year": [
        { key: "firstSem", label: "1st semester", subjects: subjects.filter(s => s.semester === 'firstSem') },
        { key: "secondSem", label: "2nd semester", subjects: subjects.filter(s => s.semester === 'secondSem') }
      ],
      "Second year": [
        { key: "thirdSem", label: "3rd semester", subjects: subjects.filter(s => s.semester === 'thirdSem') },
        { key: "fourthSem", label: "4th semester", subjects: subjects.filter(s => s.semester === 'fourthSem') }
      ],
      "Third year": [
        { key: "fifthSem", label: "5th semester", subjects: subjects.filter(s => s.semester === 'fifthSem') },
        { key: "sixthSem", label: "6th semester", subjects: subjects.filter(s => s.semester === 'sixthSem') }
      ],
      "Fourth year": [
        { key: "seventhSem", label: "7th semester", subjects: subjects.filter(s => s.semester === 'seventhSem') },
        { key: "eighthSem", label: "8th semester", subjects: subjects.filter(s => s.semester === 'eighthSem') }
      ]
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: Get all resources for a specific subject code
app.get('/api/subjects/:code/resources', async (req, res) => {
  try {
    const courseCode = req.params.code;
    const subject = await Subject.findOne({ code: courseCode });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const resources = await Resource.find({ subjectId: subject._id });
    res.json({ subject, resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));