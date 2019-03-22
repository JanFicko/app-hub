const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const ProjectController = require('../controllers/projectController');
const config = require('../config');

router.route("/:platform").get(async (req, res, next) => {

    let platform = "";

    if (req.params.platform === "android") {
        platform = config.ANDROID_GROUP;
    } else if (req.params.platform === "ios") {
        platform = config.IOS_GROUP
    }

    let projects = {
        uri: config.GITLAB_IP + platform +'/projects',
        qs: {
            per_page: '100'
        },
        headers: {
          'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
        },
        json: true
    };

    rp(projects)
        .then(async (bodyResponse) => {
          await ProjectController.addProjects(bodyResponse, req.params.platform);

          res.status(200).send(await ProjectController.getProjects());
        })
        .catch(function (err) {
          res.status(406).send({ success: false, err: "Something went wrong" });
        });


});

router.route("/jobs/:projectId").get(async (req, res, next) => {
    let jobs = {
        uri: config.GITLAB_IP + 'projects/' + req.params.projectId + '/jobs',
        qs: {
            scope: 'success'
        },
        headers: {
            'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
        },
        json: true
    };

    rp(jobs)
        .then(async (bodyResponse) => {
            await ProjectController.addJobs(req.params.projectId, bodyResponse);

            res.status(200).send(await ProjectController.getJobsById(req.params.projectId));
        })
        .catch(function (err) {
            console.log(err);
            res.status(406).send({ success: false, err: "Something went wrong" });
        });
});

module.exports = router;
