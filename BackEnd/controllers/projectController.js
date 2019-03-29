const mongoose = require('mongoose');
const Project = mongoose.model('Project');

class ProjectController {

    static async getProjects() {
        return Project.find().select(['-downloadPassword', '-job']);
    }

    static getProjectById(id) {
        return Project.findOne({ _id: id })
            .then((project) => {
                return project;
            })
            .catch((err) => {
                return { success: false, status: "Project not found" }
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

                project.allowedUserAccess.push({
                    user_uuid: userId,
                    privilegeType: privilege
                });

                await project.save();

                return { success: true, status: "Data updated" };
            })
            .catch((err) => {
                console.log(err);
                return { success: false, status: "Project not found" }
            });
    }

    static async updateProjectPassword(projectId, downloadPassword) {
        return await Project.findOne({ projectId: projectId })
            .then( async (project) => {

                if (downloadPassword != null) {
                    project.downloadPassword = downloadPassword;

                    await project.save();

                    return { success: true, status: "Data updated" }
                } else {
                    return { success: false, status: "Data not updated" }
                }

            })
            .catch((err) => {
                return { success: false, status: "Project not found" }
            });
    }

    static async updateJob(jobId, changeLog, version) {
        return await Project.find()
            .where("job.jobId")
            .in([jobId])
            .then( async (project) => {

                for (let i = 0; i < project[0].job.length; i++) {

                    if (project[0].job[i].jobId == jobId) {

                        if (changeLog != null) {
                            project[0].job[i].changeLog = changeLog;
                        }

                        if (version != null) {
                            project[0].job[i].title = version;
                        }

                        await project[0].save();

                        return { success: true, status: "Data updated" }
                    }
                }

                return { success: false, status: "Data not updated" }

            })
            .catch((err) => {
                return { success: false, status: "Project not found" }
            });
    }

    static getJobsByProjectId(projectId) {
        return Project.findOne({ projectId: projectId })
            .select(['-downloadPassword'])
            .then((project) => {
                return project
            })
            .catch((err) => {
                return { success: false, status: "Project not found" }
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
                    for (let j = 0; j < project.job.length; j++) {
                        if (project.job[j].jobId === jobs[i].id) {
                            doesExist = true;
                        }
                    }

                    if(!doesExist && jobs[i].artifacts_file != null) {
                        project.job.push({
                            jobId: jobs[i].id,
                            finishTime: jobs[i].finished_at,
                            title: jobs[i].commit.message,
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
            'job.jobId': jobId
        })
        .then(async (project) => {
            for (let i = 0; i < project[0].job.length; i++) {
                if (project[0].job[i].jobId === jobId) {

                    if (project[0].downloadPassword != null) {

                        if (project[0].downloadPassword != downloadPassword) {
                            throw "Incorrect password"
                        } else {
                            project[0].job[i].downloadActivity.push({
                                ip: ip,
                                user_uuid: userId
                            });

                            await project[0].save();

                            return project[0]
                        }
                    } else {
                        project[0].job[i].downloadActivity.push({
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
            console.log(err);
            return { success: false, status: err }
        });
    }

}

module.exports = ProjectController;