const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const config = require('../config');
const fs = require('fs');
const ProjectController = require('../controllers/projectController');

router.route("/:platform").get(async (req, res, next) => {

    let platform = "";

    if (req.params.platform === "android") {
        platform = config.ANDROID_GROUP;
    } else if (req.params.platform === "ios") {
        platform = config.IOS_GROUP
    }

    rp({
        uri: config.GITLAB_IP + platform +'/projects',
        qs: {
            per_page: '100'
        },
        headers: {
            'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
        },
        json: true
    })
    .then(async (bodyResponse) => {
      await ProjectController.addProjects(bodyResponse, req.params.platform);

      res.status(200).send(await ProjectController.getProjects());
    })
    .catch( (err) => {
      res.status(406).send({ success: false, err: "Something went wrong" });
    });


});

router.route("/jobs/:projectId").get(async (req, res, next) => {

    rp({
        uri: config.GITLAB_IP + 'projects/' + req.params.projectId + '/jobs',
        qs: {
            scope: 'success'
        },
        headers: {
            'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
        },
        json: true
    })
    .then(async (bodyResponse) => {
        await ProjectController.addJobs(req.params.projectId, bodyResponse);

        res.status(200).send(await ProjectController.getJobsByProjectId(req.params.projectId));
    })
    .catch((err) => {
        res.status(406).send({ success: false, err: "Something went wrong" });
    });
});

router.route("/:projectId").put(async (req, res, next) => {

    const { downloadPassword } = req.body;

    if (!downloadPassword) {
        res.status(400).send({ success: false, status: "Data not received" });
    } else {
        const createProjectResponse = await ProjectController.updateProjectPassword(req.params.projectId, downloadPassword);
        if(!createProjectResponse.success){
            res.status(406);
        } else {
            res.status(200);
        }
        res.send(createProjectResponse)
    }
});

router.route("/job/:jobId").put(async (req, res, next) => {

    const { changeLog } = req.body;

    if (!changeLog) {
        res.status(400).send({ success: false, status: "Data not received" });
    } else {
        const createProjectResponse = await ProjectController.updateJob(req.params.jobId, changeLog);
        if(!createProjectResponse.success){
            res.status(406);
        } else {
            res.status(200);
        }
        res.send(createProjectResponse)
    }

});

router.route("/userAccess").post(async (req, res, next) => {
    const { userId, projectId, privilegeType } = req.body;

    if (!userId || !projectId || !privilegeType) {
        res.status(400).send({ success: false, status: "Data not received" });
    } else {
        const createProjectResponse = await ProjectController.updateProjectAccess(projectId, userId, privilegeType);
        if(!createProjectResponse.success){
            res.status(406);
        } else {
            res.status(200);
        }
        res.send(createProjectResponse)
    }
});


router.route("/download").post(async (req, res, next) => {

    const { ip, platform, path, jobId, userId, downloadPassword } = req.body;

    const project = await ProjectController.downloadArtifact(ip, jobId, userId, downloadPassword);

    console.log(project);

    const filePath = './public/' + jobId + '.zip';

    if (project.success == null) {
        if (!fs.existsSync(filePath)) {
            rp({
                uri: config.GITLAB_IP.replace(config.GITLAB_IP_SUFFIX, "") + platform + "/" + path + "/-/jobs/" + jobId + '/artifacts/download',
                qs: {
                    scope: 'success'
                },
                encoding: 'binary',
                headers: {
                    'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN,
                    'Content-Type': 'application/zip'
                }
            })
                .then(async (bodyResponse) => {

                    let writeStream = fs.createWriteStream(filePath);
                    writeStream.write(bodyResponse, 'binary');
                    writeStream.on('finish', () => {
                        // TODO: Unzip
                        res.download(filePath);
                    });
                    writeStream.on('error', (err) => {
                        res.status(406).send({ success: false, err: "Something went wrong" });
                    });

                    writeStream.end();

                })
                .catch(function (err) {
                    res.status(406).send({ success: false, err: "Something went wrong" });
                });
        } else {
            // TODO: Unzip
            res.download(filePath);
        }
    } else {
        res.status(406).send({ success: false, err: "Something went wrong" });
    }



});

module.exports = router;
