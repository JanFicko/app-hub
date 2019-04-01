const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const config = require('../config');
const fs = require('fs');
const unzipper = require('unzipper');
const rimraf = require("rimraf");
const xmlbuilder = require("xmlbuilder");
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

    const { downloadPassword, bundleIdentifier } = req.body;

    const createProjectResponse = await ProjectController.updateProject(req.params.projectId, downloadPassword, bundleIdentifier);
    if(!createProjectResponse.success){
        res.status(406);
    } else {
        res.status(200);
    }
    res.send(createProjectResponse);

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

    const filePath = './public/' + jobId + '.zip';

    if (project.success == null) {

        if (platform === 'ios' && project.bundleIdentifier == null) {
            res.status(417).send({ success: false, err: "Bundle identifier is empty" });
        } else {
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

                            let unzip = fs.createReadStream(filePath).pipe(unzipper.Extract({ path: 'public/' }));

                            if (platform === "android") {

                                unzip.on('finish', () => {
                                    fs.rename('./public/app/build/outputs/apk/debug/', './public/' + jobId, function (err) {
                                        if (err == null) {

                                            rimraf('./public/app/', async (err) => {

                                                const output = JSON.parse(fs.readFileSync('./public/66/output.json', 'utf8'));

                                                ProjectController.updateJob(jobId, null, 'v' + output[0].apkInfo.versionName);

                                                const apkFile = output[0].apkInfo.outputFile;

                                                if (fs.existsSync(plistFile)) {
                                                    res.download('./public/'+ jobId + '/' + apkFile);
                                                } else {
                                                    res.status(406).send({ success: false, err: "APK file not found" });
                                                }
                                            });

                                        }
                                    });
                                });
                            } else if (platform === "ios") {
                                unzip.on('finish', () => {

                                    const ipaFile = fs.readdirSync('./public/build/')[0];

                                    fs.rename('./public/build/' + ipaFile + '/', './public/' + jobId, function (err) {
                                        if (err == null) {

                                            rimraf('./public/build/', async (err) => {

                                                fs.unlink('./public/'+jobId+'/Packaging.log', (err) => {
                                                    if(err) console.log(err);

                                                });
                                                fs.unlink('./public/'+jobId+'/ExportOptions.plist', (err) => {
                                                    if(err) console.log(err);
                                                });
                                                fs.unlink('./public/'+jobId+'/DistributionSummary.plist', (err) => {
                                                    if(err) console.log(err);
                                                });


                                                let root = xmlbuilder.create(
                                                    'plist',
                                                    { version: '1.0', encoding: 'UTF-8' },
                                                    { pubID: '-//Apple//DTD PLIST 1.0//EN', sysID: 'http://www.apple.com/DTDs/PropertyList-1.0.dtd' })
                                                    .att('version', '1.0')
                                                    .ele('dict');

                                                root.ele('key', 'items');
                                                let array1 = root.ele('array')
                                                    .ele('dict');

                                                array1.ele('key', 'assets');

                                                let array2 = array1.ele('array')
                                                    .ele('dict');
                                                array2.ele('key', 'kind');
                                                array2.ele('string', 'software-package');
                                                array2.ele('key', 'url');
                                                array2.ele('string', 'https://' + config.DOMAIN_NAME + '/' + jobId + '/' + ipaFile);

                                                array1.ele('key', 'metadata');

                                                let array3 = array1.ele('dict');
                                                array3.ele('key', 'bundle-identifier');
                                                array3.ele('string', project.bundleIdentifier);
                                                array3.ele('key', 'kind');
                                                array3.ele('string', 'software');
                                                array3.ele('key', 'title');
                                                array3.ele('string', ipaFile.replace(".ipa", ""));

                                                root = root.end({ pretty: true});

                                                const plistFile = './public/'+ jobId + '/' + ipaFile.replace(".ipa", "") + '.plist';

                                                fs.writeFile(plistFile, root, (err) => {
                                                    if (fs.existsSync(plistFile)) {
                                                        res.download(plistFile);
                                                    } else {
                                                        res.status(406).send({ success: false, err: "PLIST file not found" });
                                                    }
                                                });

                                            });

                                        }
                                    });
                                });

                            }

                            unzip.on('error', (err) => {
                                console.log(err);
                                res.status(406).send({ success: false, err: "Something went wrong" });
                            });

                        });


                        writeStream.on('error', (err) => {
                            res.status(406).send({ success: false, err: "Something went wrong" });
                        });

                        writeStream.end();

                    })
                    .catch(function (err) {
                        console.log(err);
                        res.status(406).send({ success: false, err: "Something went wrong" });
                    });
            } else {

                if (platform === "android") {
                    const output = JSON.parse(fs.readFileSync('./public/66/output.json', 'utf8'));

                    const apkFile = output[0].apkInfo.outputFile

                    if (fs.existsSync(apkFile)) {
                        res.download('./public/'+ jobId + '/' + apkFile);
                    } else {
                        res.status(406).send({ success: false, err: "APK file not found" });
                    }
                } else if (platform === "ios") {

                    const ipaFile = fs.readdirSync('./public/'  + jobId)[0];
                    const plistFile = './public/'+ jobId + '/' + ipaFile.replace(".ipa", "") + '.plist';

                    if (fs.existsSync(plistFile)) {
                        res.download(plistFile);
                    } else {
                        res.status(406).send({ success: false, err: "PLIST file not found" });
                    }

                }

            }

        }
    } else {
        res.status(406).send({ success: false, err: "Something went wrong" });
    }



});

module.exports = router;
