const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

class ProjectController {

    static getProjects() {
        return Project.find().select(['-downloadPassword', '-jobs'])
            .then((projects) => {
                return { code: 0, projects: projects };
            })
            .catch((err) => {
                return { code: -1, description: "Project not found" }
            });
    }

    static getUsersProjects(userId) {
        return Project.find({ "allowedUserAccess.user_uuid" : userId,  "allowedUserAccess.privilegeType" : [ "Full", "Latest" ]})
            .select(['-downloadPassword', '-jobs'])
            .then((projects) => {
                return { code: 0, projects: projects };
            })
            .catch((err) => {
                return { code: -1, description: err }
            });
    }

    static getProjectById(id) {
        return Project.findOne({ _id: id })
            .then((project) => {
                return { code: 0, project: project };
            })
            .catch((err) => {
                return { code: -1, description: "Project not found" }
            });
    }

    static async updateProjectAccess(projectId, userId, privilegeType) {
        return await Project.findOne({ _id: projectId })
            .then( async (project) => {

                let privilegeTypes = Project.schema.path('allowedUserAccess.0.privilegeType').enumValues;

                let privilege = privilegeTypes[0];
                if (privilegeType === privilegeTypes[1]) {
                    privilege = privilegeTypes[1];
                }

                for (let i=0; i < project.allowedUserAccess.length; i++) {
                    if (project.allowedUserAccess[i].user_uuid === userId) {
                        project.allowedUserAccess.splice(i, 1);
                        break;
                    }
                }

                if (privilegeType !== "None") {
                    project.allowedUserAccess.push({
                        user_uuid: userId,
                        privilegeType: privilege
                    });
                }

                await project.save();

                return { code: 0, description: "Data updated" };
            })
            .catch((err) => {
                return { code: -1, description: "Project not found" }
            });
    }

    static async updateProject(projectId, downloadPassword, bundleIdentifier) {
        return await Project.findOne({ projectId: projectId })
            .then( async (project) => {

                let updated = false;

                if (downloadPassword != null) {
                    project.downloadPassword = downloadPassword;
                    updated = true;
                }

                if (bundleIdentifier != null) {
                    updated = true;
                    project.package = bundleIdentifier;
                }

                if (updated) {
                    await project.save();

                    return { code: 0, description: "Data updated" }
                } else {
                    return { code: -1, description: "Data not updated" }
                }

            })
            .catch((err) => {
                return { code: -1, description: "Project not found" }
            });
    }

    static async updateJob(jobId, changeLog, version) {
        return await Project.find()
            .where("jobs.jobId")
            .in([jobId])
            .then( async (project) => {

                for (let i = 0; i < project[0].jobs.length; i++) {

                    if (project[0].jobs[i].jobId == jobId) {

                        if (changeLog != null) {
                            project[0].jobs[i].changeLog = changeLog;
                        }

                        if (version != null) {
                            project[0].jobs[i].title = version;
                        }

                        await project[0].save();

                        return { code: 0, description: "Data updated" }
                    }
                }

                return { code: -1, description: "Data not updated" }

            })
            .catch((err) => {
                return { code: -1, description: "Project not found" }
            });
    }

    static getJobsByProjectId(projectId, userId) {
        return Project.findOne({ projectId: projectId, "allowedUserAccess.user_uuid" : userId })
            .select(['-downloadPassword'])
            .then(async (project) => {

                let privilegeTypes = Project.schema.path('allowedUserAccess.0.privilegeType').enumValues;
                let privilege;
                let jobs = [];

                for (let i = 0; i < project.jobs.length; i++) {
                    for (let j = 0; j < project.allowedUserAccess.length; j++) {
                        if (project.allowedUserAccess[j].user_uuid === userId) {
                            privilege = project.allowedUserAccess[j].privilegeType;
                            break;
                        }
                    }

                    if (privilege === privilegeTypes[0]) {
                        jobs.push({
                            jobId: project.jobs[i].jobId,
                            finishTime: project.jobs[i].finishTime,
                            title: project.jobs[i].title,
                            filename: project.jobs[i].filename,
                            changeLog: project.jobs[i].changeLog,
                        });
                    } else {
                        jobs.push({
                            jobId: project.jobs[i].jobId,
                            finishTime: project.jobs[i].finishTime,
                            title: project.jobs[i].title,
                            filename: project.jobs[i].filename,
                            changeLog: project.jobs[i].changeLog,
                        });
                        break;
                    }
                }

                project.jobs = jobs;

                return { code: 0, project: project }
            })
            .catch((err) => {
                return { code: -1, description: err.message }
            });
    }

    static async addProjects(projects, platform) {
        let allowedUsers = [];
        let users = await User.find();

        let privilegeTypes = Project.schema.path('allowedUserAccess.0.privilegeType').enumValues;

        for (let i = 0; i < users.length; i++) {
            if (users[i].isAdmin === true) {
                allowedUsers.push({
                    user_uuid: users[i]._id,
                    privilegeType: privilegeTypes[0]
                })
            }
        }

        for (let i = 0; i < projects.length; i++) {
            if (platform === "android" || platform === "ios" || platform === "all" && (projects[i].namespace.path === "android" || projects[i].namespace.path === "ios")) {

                await Project.findOneAndUpdate(
                    { projectId: projects[i].id },
                    {
                        projectId: projects[i].id,
                        name: projects[i].name,
                        path: projects[i].path,
                        platform: projects[i].namespace.path,
                        icon: projects[i].avatar_url,
                        allowedUserAccess: allowedUsers
                    },
                    { upsert: true },
                    null

                )
            }
        }
    }

    static async addJobs(projectId, jobs) {
        await Project.findOne({ projectId: projectId})
            .then(async (project) => {

                let saveProject = false;
                let doesExist = false;

                for (let i = 0; i < jobs.length; i++) {
                    for (let j = 0; j < project.jobs.length; j++) {
                        if (project.jobs[j].jobId === jobs[i].id) {
                            doesExist = true;
                        }
                    }

                    if(!doesExist && jobs[i].artifacts_file != null) {
                        let title = jobs[i].commit.message;

                        if (title.includes("v")) {

                        }

                        project.jobs.push({
                            jobId: jobs[i].id,
                            finishTime: jobs[i].finished_at,
                            title: title,
                            filename: jobs[i].artifacts_file.filename
                        });

                        saveProject = true;
                    }
                    doesExist = false;
                }

                if (saveProject) {
                    await project.save();
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    static downloadArtifact(ip, jobId, userId, downloadPassword) {

        return Project.find({
            'jobs.jobId': jobId
        })
        .then(async (project) => {
            for (let i = 0; i < project[0].jobs.length; i++) {
                if (project[0].jobs[i].jobId === jobId) {

                    if (project[0].downloadPassword != null) {

                        if (project[0].downloadPassword != downloadPassword) {
                            throw "Incorrect password"
                        } else {
                            project[0].jobs[i].downloadActivity.push({
                                ip: ip,
                                user_uuid: userId
                            });

                            await project[0].save();

                            return project[0]
                        }
                    } else {
                        project[0].jobs[i].downloadActivity.push({
                            ip: ip,
                            user_uuid: userId
                        });

                        await project[0].save();

                        return project[0]
                    }

                }
            }
            throw "Job not found"
        })
        .catch((err) => {
            return { code: -1, description: err.message }
        });
    }

    static getAndroidArtifacts(jobId) {

        return Project.find({
            'jobs.jobId': jobId,
            'platform': 'android'
        })
        .then(async (project) => {
            for (let i = 0; i < project[0].jobs.length; i++) {
                if (project[0].jobs[i].jobId === jobId) {

                    return project[0];
                }
            }
            throw "Job not found"
        })
        .catch((err) => {
            return { code: -1, description: err.message }
        });
    }

}

module.exports = ProjectController;