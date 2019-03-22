const mongoose = require('mongoose');
const Project = mongoose.model('Project');

class ProjectController {

    static getProjects() {
        return Project.find();
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

    static getJobsById(projectId) {
        return Project.findOne({ projectId: projectId })
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


                await Project.findOne({ jobId: id })

                /*for (let i = 0; i < jobs.length; i++) {

                    project.job.push({
                        jobId: jobs[i].id,
                        finishTime: jobs[i].finished_at,
                        title: jobs[i].commit.message,
                        filename: jobs[i].artifacts_file.filename
                    });
                }

                await project.save().then(() => {
                    console.log("success");
                }).catch((err) => {
                    console.log(err);
                });*/
            }).catch((err) => {
                console.log(err);
            });
    }

    static async downloadArtifact(id, userId) {

    }

}

module.exports = ProjectController;