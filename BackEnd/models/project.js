const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const ProjectSchema = new Schema({
    projectId: { type: Number, unique: true, required: true  },
    name: { type: String, required: true  },
    packageName: { type: String, default: null },
    path: { type: String, required: true  },
    platform: { type: String, required: true  },
    icon: String,
    downloadPassword: { type: String, default: null },
    jobs: [{
        jobId: { type: Number, required: true  },
        finishTime: Date,
        title: { type: String, default: config.NO_VERSION_TEXT },
        filename: { type: String, required: true  },
        changeLog: String
    }],
    allowedUserAccess: [{
        user_uuid: { type: String, required : true },
        privilegeType: { type: String, enum: ['Full', 'Latest'], default: 'Latest'}
    }]
});

const Project = mongoose.model('Project', ProjectSchema );

module.exports = { Project, ProjectSchema };
