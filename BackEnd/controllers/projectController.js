const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');
const config = require('../config');

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

    static getUsersProjects(userId, platform) {
        let options = { "allowedUserAccess.privilegeType" : [ "Full", "Latest" ] };
        if (userId !== "all") {
            if (platform !== "all") {
                options = { "platform" : platform, "allowedUserAccess.user_uuid" : userId, "allowedUserAccess.privilegeType" : [ "Full", "Latest" ]};
            }
            else {
                options = { "allowedUserAccess.user_uuid" : userId, "allowedUserAccess.privilegeType" : [ "Full", "Latest" ]};
            }
        }
        return Project.find(options)
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

    static async updateProjectAccess(userId, projects) {

        let errors = [];
        for (let j = 0; j < projects.length; j++) {
            await Project.findOne({ projectId: projects[j].projectId })
                .then( async (project) => {

                    let privilegeTypes = Project.schema.path('allowedUserAccess.0.privilegeType').enumValues;

                    let privilege = privilegeTypes[0];
                    if (projects[j].privilegeType === privilegeTypes[1]) {
                        privilege = privilegeTypes[1];
                    }

                    for (let i=0; i < project.allowedUserAccess.length; i++) {
                        if (project.allowedUserAccess[i].user_uuid === userId) {
                            project.allowedUserAccess.splice(i, 1);
                            break;
                        }
                    }

                    if (projects[j].privilegeType !== "None") {
                        project.allowedUserAccess.push({
                            user_uuid: userId,
                            privilegeType: privilege
                        });
                    }

                    await project.save();
                })
                .catch((err) => {
                    errors.push(projects[j].projectId);
                });
        }

        if (errors.length === 0) {
            return { code: 0 };
        } else {
            return { code: 0, description: errors };
        }
    }

    static async updateProject(projectId, packageName, downloadPassword) {

        return await Project.findOne({ projectId: projectId })
            .then( async (project) => {

                let updated = false;

                if (downloadPassword != null) {
                    project.downloadPassword = downloadPassword;
                    updated = true;
                }

                if (packageName != null) {
                    updated = true;
                    project.packageName = packageName;
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

    static async updateJob(jobId, version, changeLog) {
        return await Project.find()
            .where("jobs.jobId")
            .in([jobId])
            .then( async (project) => {

                for (let i = 0; i < project[0].jobs.length; i++) {

                    if (project[0].jobs[i].jobId == jobId) {
                        let updated = false;

                        if (changeLog != null && changeLog !== '') {
                            updated = true;
                            project[0].jobs[i].changeLog = changeLog;
                        }

                        if (version != null && version !== '') {
                            updated = true;
                            project[0].jobs[i].title = version;
                        }

                        if (updated) {
                            await project[0].save();

                            return { code: 0, description: "Data updated" }
                        } else {
                            return { code: -1, description: "Data not updated" }
                        }

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

                jobs.sort((a, b) => parseFloat(b.jobId) - parseFloat(a.jobId));

                project.jobs = jobs;

                return { code: 0, project: project }
            })
            .catch((err) => {
                return { code: -1, description: err.message }
            });
    }

    static async addProjects(projects, platform) {
        for (let i = 0; i < projects.length; i++) {
            if (platform === "android" || platform === "ios" || platform === "all" && (projects[i].namespace.path === "android" || projects[i].namespace.path === "ios")) {

                await Project.findOneAndUpdate(
                    { projectId: projects[i].id },
                    {
                        projectId: projects[i].id,
                        name: projects[i].name,
                        path: projects[i].path,
                        platform: projects[i].namespace.path,
                        icon: projects[i].avatar_url
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

                        if (!title.match(config.VERSION_REGEX)) {
                            title = config.NO_VERSION_TEXT;
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

    static downloadArtifact(ip, jobId, userId) {

        return Project.find({
            'jobs.jobId': jobId
        })
        .then(async (project) => {
            for (let i = 0; i < project[0].jobs.length; i++) {
                if (project[0].jobs[i].jobId == jobId) {

                    // TODO: Temporary disabled
                    /*if (project[0].downloadPassword != null) {

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
                    */
                    return project[0]
                }
            }
            throw "Job not found"
        })
        .catch((err) => {
            console.log(err);
            return { code: -1, description: "Project not found" }
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
