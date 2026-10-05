const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    companyName: {
      type: String,
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    salaryMin: {
      type: Number,
      required: true
    },
    salaryMax: {
      type: Number,
      required: true
    },
    experience: {
      type: String,
      default: 'Fresher'
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Contract'],
      default: 'Full Time'
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    deadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Closed'],
      default: 'Pending' // Admin moderation queue
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', jobSchema);
