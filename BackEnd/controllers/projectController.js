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

    /*static async updateJob(jobId, changeLog) {
        return await Project.find({ projectId: projectId })
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
    }*/

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

                project.job = [];

                for (let i = 0; i < jobs.length; i++) {

                    project.job.push({
                        jobId: jobs[i].id,
                        finishTime: jobs[i].finished_at,
                        title: jobs[i].commit.message,
                        filename: jobs[i].artifacts_file.filename
                    });
                }

                await project.save();
            }).catch((err) => {
                console.log(err);
            });
    }

    static downloadArtifact(jobId, userId, downloadPassword) {

        return Project.find({
            'job.jobId': jobId
        })
        .then(async (project) => {
            for (let i = 0; i < project[0].job.length; i++) {
                if (project[0].job[i].jobId === jobId) {
                    if (project.downloadPassword != null) {

                        if (project.downloadPassword !== downloadPassword) {
                            throw "Incorrect password"
                        }
                    }

                    return project[0]
                }
            }
            throw "Job not found"
        })
        .catch((err) => {
            return { success: false, status: err }
        });
    }

}

module.exports = ProjectController;