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

    res.status(200).send(await ProjectController.updateProjectPassword(req.params.projectId, downloadPassword));
});

router.route("/download").post(async (req, res, next) => {

    const { platform, path, jobId, userId, downloadPassword } = req.body;

    const project = await ProjectController.downloadArtifact(jobId, userId, downloadPassword);

    const filePath = './public/' + jobId + '.zip';

    if (project.downloadPassword != null && project.downloadPassword == downloadPassword) {
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
        res.status(406).send({ success: false, err: "Wrong password" });
    }



});

module.exports = router;
