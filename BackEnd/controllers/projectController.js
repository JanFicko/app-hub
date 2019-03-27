const mongoose = require('mongoose');
const Project = mongoose.model('Project');

class ProjectController {

    static async getProjects() {
        return Project.find().select(['-job.downloadLimit.downloadPassword']);
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

    static getJobByJobId(jobId) {
        return Project.find()
            .where('job.jobId')
            .in([jobId])
            .then( (job) => {
                console.log(job)
            })
    }

    static getJobsByProjectId(projectId) {
        return Project.findOne({ projectId: projectId })
            .select(['-job.downloadLimit.downloadPassword'])
            .then((project) => {
                return project.job
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

    static downloadArtifact(jobId, userId, password) {

        return Project.find({
            'job.jobId': jobId
        })
        .then(async (project) => {
            for (let i = 0; i < project[0].job.length; i++) {
                if (project[0].job[i].jobId === jobId) {
                    if (project[0].job[i].downloadLimit.downloadPassword != null) {

                        if (project[0].job[i].downloadLimit.downloadPassword !== password) {
                            throw "Incorrect password"
                        }
                    }

                    if (project[0].job[i].downloadLimit.downloadNumberLimit !== -1) {

                        if (project[0].job[i].downloadLimit.downloadNumberLimit === 0) {
                            throw "Number of downloads exceeded"
                        } else {

                            project[0].job[i].downloadLimit.downloadNumberLimit--;
                            await project[0].save();
                        }
                    }

                    project[0] = project[0].toObject();
                    delete project[0].job[i].downloadLimit["downloadPassword"];

                    return project[0].job[i]
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