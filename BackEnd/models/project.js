const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    projectId: { type: Number, unique: true, required: true  },
    name: { type: String, required: true  },
    path: { type: String, required: true  },
    platform: { type: String, required: true  },
    icon: String,
    job: [{
        time: { type: Date, default: Date.now },
        jobId: { type: Number, required: true  },
        finishTime: Date,
        title: { type: String, default: "No version" },
        filename: { type: String, required: true  },
        downloadActivity: [{
            user_uuid: { type: String, required: true  },
            downloadTime: { type: Date, default: Date.now }
        }],
        downloadLimit: [{
            downloadPassword: { type: String, default: null },
            downloadLimit: { type: Number, default: -1 }
        }]
    }],
    allowedUserAccess: [{
        user_uuid: { type: String, required : true },
        privilegeType: { type: String, enum: ['Full, Latest']}
    }]
});

const Project = mongoose.model('Project', ProjectSchema );

module.exports = { Project, ProjectSchema };