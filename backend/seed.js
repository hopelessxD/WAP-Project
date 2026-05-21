const mongoose = require('mongoose');
const Subject = require('./models/Subject');
require('dotenv').config(); // Loads environment variables from your .env file

// The full subject data matrix extracted from your App.jsx
const DATA = {
  "First year": [
    {
      key: "firstSem", label: "1st semester", subjects: [
        { code: "ENSH 101", name: "Engineering Mathematics I" },
        { code: "ENCT 101", name: "Computer Programming" },
        { code: "ENME 101", name: "Engineering Drawing" },
        { code: "ENEX 101", name: "Fundamental of Electrical and Electronics Engineering" },
        { code: "ENSH 102", name: "Engineering Physics" },
        { code: "ENME 106", name: "Engineering Workshop" }
      ]
    },
    {
      key: "secondSem", label: "2nd semester", subjects: [
        { code: "ENSH 151", name: "Engineering Mathematics II" },
        { code: "ENCT 151", name: "Object Oriented Programming" },
        { code: "ENEX 152", name: "Digital Logic" },
        { code: "ENEX 151", name: "Electronic Device and Circuits" },
        { code: "ENSH 153", name: "Engineering Chemistry" },
        { code: "ENEE 154", name: "Electrical Circuits and Machines" }
      ]
    }
  ],
  "Second year": [
    {
      key: "thirdSem", label: "3rd semester", subjects: [
        { code: "ENSH 201", name: "Engineering Mathematics III" },
        { code: "ENSH 204", name: "Communication English" },
        { code: "ENCT 201", name: "Computer Graphics and Visualization" },
        { code: "ENCT 202", name: "Foundation of Data Science" },
        { code: "ENCT 203", name: "Theory of Computation" },
        { code: "ENEX 201", name: "Microprocessors" }
      ]
    },
    {
      key: "fourthSem", label: "4th semester", subjects: [
        { code: "ENSH 252", name: "Numerical Methods" },
        { code: "ENEX 252", name: "Instrumentation" },
        { code: "ENEX 254", name: "Electromagnetics" },
        { code: "ENCT 252", name: "Data Structure and Algorithm" },
        { code: "ENCT 253", name: "Data Communication" },
        { code: "ENCT 254", name: "Operating System" }
      ]
    }
  ],
  "Third year": [
    {
      key: "fifthSem", label: "5th semester", subjects: [
        { code: "ENSH 304", name: "Probability and Statistics" },
        { code: "ENCT 301", name: "Database Management System" },
        { code: "ENCT 302", name: "Web Application Programming" },
        { code: "ENCT 303", name: "Computer Organization and Architecture" },
        { code: "ENCT 304", name: "Computer Networks" },
        { code: "ENCT 325-344", name: "Elective I" }
      ]
    },
    {
      key: "sixthSem", label: "6th semester", subjects: [
        { code: "ENCE 356", name: "Engineering Economics" },
        { code: "ENCT 351", name: "Artificial Intelligence" },
        { code: "ENCT 352", name: "Software Engineering" },
        { code: "ENCT 353", name: "Simulation and Modeling" },
        { code: "ENCT 354", name: "Minor Project" },
        { code: "ENCT 385-399", name: "Elective II" }
      ]
    }
  ],
  "Fourth year": [
    {
      key: "seventhSem", label: "7th semester", subjects: [
        { code: "ENEX 416", name: "Digital Signal Analysis and Processing" },
        { code: "ENCT 411", name: "Distributed and Cloud Computing" },
        { code: "ENCT 412", name: "ICT Project Management" },
        { code: "ENEX 417", name: "Energy, Environment and Social Engineering" },
        { code: "ENCT 435-444", name: "Elective III" },
        { code: "ENCT 413", name: "Project I" }
      ]
    },
    {
      key: "eighthSem", label: "8th semester", subjects: [
        { code: "ENCT 463", name: "Network and Cyber Security" },
        { code: "ENCT 465-474", name: "Elective IV" },
        { code: "ENCT 462", name: "Internship" },
        { code: "ENCT 461", name: "Project II" }
      ]
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('Cleared old subject collection rows.');
    await Subject.deleteMany({});

    const subjectsToInsert = [];

    // Flatten the nested structure into individual database records
    Object.entries(DATA).forEach(([year, sems]) => {
      sems.forEach(sem => {
        sem.subjects.forEach(sub => {
          subjectsToInsert.push({
            code: sub.code,
            name: sub.name,
            semester: sem.key,
            year: year
          });
        });
      });
    });

    // Save them all to MongoDB simultaneously
    await Subject.insertMany(subjectsToInsert);
    console.log(`Successfully migrated ${subjectsToInsert.length} subjects into MongoDB!`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Connect explicitly using your cloud MONGO_URI from the .env file
// Connect explicitly using your cloud MONGO_URI
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 20000, // Increase timeout to give it more time
  tlsAllowInvalidCertificates: true // This bypasses the certificate handshake issue
})
  .then(() => {
    console.log('🚀 Connected smoothly to MongoDB Atlas Cloud!');
    seedDatabase();
  })
  .catch(err => {
    console.error('Seed connection error:', err);
    console.log('Troubleshooting Tip: Ensure your password in .env contains no special characters other than alphanumeric!');
  });