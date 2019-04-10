const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const config = require('../config');
const fs = require('fs');
const unzipper = require('unzipper');
const rimraf = require("rimraf");
const xmlbuilder = require("xmlbuilder");
const ProjectController = require('../controllers/projectController');

router.route("/").post(async (req, res, next) => {

    const { platform, userId } = req.body;

    if (!platform || !userId) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {
        let platformType = "";

        if (platform === "android") {
            platformType = config.ANDROID_GROUP;
        } else if (platform === "ios") {
            platformType = config.IOS_GROUP
        }

        rp({
            uri: config.GITLAB_IP + platformType + '/projects',
            qs: {
                per_page: '100'
            },
            headers: {
                'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
            },
            json: true
        })
            .then(async (bodyResponse) => {
                await ProjectController.addProjects(bodyResponse, platform);

                res.status(200).send(await ProjectController.getUsersProjects(userId));
            })
            .catch((err) => {
                res.status(406).send({code: -1, description: err.errmsg});
            });
    }

});

router.route("/jobs").post(async (req, res, next) => {

    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {
        rp({
            uri: config.GITLAB_IP + 'projects/' + projectId + '/jobs',
            qs: {
                scope: 'success'
            },
            headers: {
                'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
            },
            json: true
        })
            .then(async (bodyResponse) => {

                await ProjectController.addJobs(projectId, bodyResponse);

                res.status(200).send(await ProjectController.getJobsByProjectId(projectId, userId));
            })
            .catch((err) => {
                res.status(406).send({ code: -1, description: err.message });
            });
    }
});

router.route("/:projectId").put(async (req, res, next) => {

    const { downloadPassword, bundleIdentifier } = req.body;

    const createProjectResponse = await ProjectController.updateProject(req.params.projectId, downloadPassword, bundleIdentifier);
    res.status(200).send(createProjectResponse);

});

router.route("/job/:jobId").put(async (req, res, next) => {

    const { changeLog } = req.body;

    if (!changeLog) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {
        const createProjectResponse = await ProjectController.updateJob(req.params.jobId, changeLog);
        res.status(200).send(createProjectResponse)
    }

});

router.route("/userAccess").post(async (req, res, next) => {
    const { userId, projectId, privilegeType } = req.body;

    if (!userId || !projectId || !privilegeType) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {
        const createProjectResponse = await ProjectController.updateProjectAccess(projectId, userId, privilegeType);
        res.status(200).send(createProjectResponse)
    }
});


router.route("/androidArtifacts").post(async (req, res, next) => {

    const { jobId } = req.body;

    const project = await ProjectController.getAndroidArtifacts(jobId);

    const zipFilePath = './public/' + jobId + '.zip';
    const outputPath = './public/' + jobId;

    if (project.code !== -1) {
        if (!fs.existsSync(zipFilePath)) {
            rp({
                uri: config.GITLAB_IP.replace(config.GITLAB_IP_SUFFIX, "") + project.platform + "/" + project.path + "/-/jobs/" + jobId + '/artifacts/download',
                qs: {
                    scope: 'success'
                },
                encoding: 'binary',
                headers: {
                    'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN,
                    'Content-Type': 'application/zip'
                }
            }).then(async (bodyResponse) => {

                let writeStream = fs.createWriteStream(zipFilePath);
                writeStream.write(bodyResponse, 'binary');
                writeStream.on('finish', () => {

                    let unzip = fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: 'public/' }));

                    unzip.on('finish', () => {
                        fs.rename('./public/app/build/outputs/apk/', './public/' + jobId, function (err) {
                            if (err == null) {

                                rimraf('./public/app/', async (err) => {

                                    if (err == null) {

                                        fs.readdir(outputPath, function(err, directories) {
                                            for (let i = 0; i < directories.length; i++) {
                                                directories[i] = directories[i] + "/" + JSON.parse(fs.readFileSync(outputPath + '/' + directories[i] +'/output.json', 'utf8'))[0].apkInfo.outputFile;
                                            }
                                            res.status(200).send({ code: '0', outputs: directories});
                                        });

                                    } else {
                                        res.status(200).send({ code: -1, description: err.message });
                                    }
                                });

                            }
                        });
                    });
                });

                writeStream.on('error', (err) => {
                    res.status(406).send({ code: -1, description: err.message });
                });

                writeStream.end();
            }).catch(function (err) {
                res.status(200).send({ code: -1, description: "Artifact doesn't exist" });
            });
        } else {

            if (fs.existsSync(outputPath)) {

                fs.readdir(outputPath, function(err, directories) {
                    for (let i = 0; i < directories.length; i++) {
                        directories[i] = directories[i] + "/" + JSON.parse(fs.readFileSync(outputPath + '/' + directories[i] +'/output.json', 'utf8'))[0].apkInfo.outputFile;
                    }
                    res.status(200).send({ code: '0', outputs: directories});
                });

            } else {
                let unzip = fs.createReadStream(filePath).pipe(unzipper.Extract({ path: 'public/' }));

                unzip.on('finish', () => {
                    fs.rename('./public/app/build/outputs/apk/', './public/' + jobId, function (err) {
                        if (err == null) {

                            rimraf('./public/app/', async (err) => {

                                if (err == null) {
                                    fs.readdir(outputPath, function(err, directories) {
                                        for (let i = 0; i < directories.length; i++) {
                                            directories[i] = directories[i] + "/" + JSON.parse(fs.readFileSync(outputPath + '/' + directories[i] +'/output.json', 'utf8'))[0].apkInfo.outputFile;
                                        }
                                        res.status(200).send({ code: '0', outputs: directories});
                                    });
                                } else {
                                    res.status(200).send({ code: -1, description: err.message });
                                }
                            });

                        }
                    });
                });


                unzip.on('error', (err) => {
                    res.status(200).send({ code: -1, description: err.message });
                });
            }

        }
    } else {
        res.status(200).send({ code: -1, description: "Something went wrong" });
    }

});

router.route("/download/:jobId/:userId/:output").get(async (req, res, next) => {

    const { downloadPassword } = req.body;

    let apkOutput;

    if (req.params.output == null) {
        apkOutput = "debug";
    } else {
        apkOutput = req.params.output;
    }

    if (!req.params.jobId || !req.params.userId) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {

        const project = await ProjectController.downloadArtifact(req.ip, req.params.jobId, req.params.userId, downloadPassword);

        const filePath = './public/' + req.params.jobId + '.zip';

        if (project.code !== -1) {

            if (project.platform === 'ios' && project.bundleIdentifier == null) {
                res.status(417).send({ code: -1, description: "Bundle identifier is empty" });
            } else {
                if (!fs.existsSync(filePath)) {
                    rp({
                        uri: config.GITLAB_IP.replace(config.GITLAB_IP_SUFFIX, "") + project.platform + "/" + project.path + "/-/jobs/" + req.params.jobId + '/artifacts/download',
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

                                if (project.platform === "android") {

                                    unzip.on('finish', () => {
                                        fs.rename('./public/app/build/outputs/apk/', './public/' + req.params.jobId, function (err) {
                                            if (err == null) {

                                                rimraf('./public/app/', async (err) => {

                                                    const output = JSON.parse(fs.readFileSync('./public/' + req.params.jobId + '/' + apkOutput +'/output.json', 'utf8'));

                                                    ProjectController.updateJob(req.params.jobId, null, 'v' + output[0].apkInfo.versionName);

                                                    const apkFile = './public/'+ req.params.jobId + '/' + apkOutput + '/' + output[0].apkInfo.outputFile;

                                                    if (fs.existsSync(apkFile)) {
                                                        res.download(apkFile);
                                                    } else {
                                                        res.status(200).send({ code: -1, description: "APK file not found" });
                                                    }
                                                });

                                            }
                                        });
                                    });
                                } else if (project.platform === "ios") {
                                    unzip.on('finish', () => {

                                        const ipaFile = fs.readdirSync('./public/build/')[0];

                                        fs.rename('./public/build/' + ipaFile + '/', './public/' + req.params.jobId, function (err) {
                                            if (err == null) {

                                                rimraf('./public/build/', async (err) => {

                                                    fs.unlink('./public/' + req.params.jobId + '/Packaging.log', (err) => {
                                                        if(err) console.log(err);

                                                    });
                                                    fs.unlink('./public/' + req.params.jobId + '/ExportOptions.plist', (err) => {
                                                        if(err) console.log(err);
                                                    });
                                                    fs.unlink('./public/' + req.params.jobId + '/DistributionSummary.plist', (err) => {
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
                                                    array2.ele('string', 'https://' + config.DOMAIN_NAME + '/' + req.params.jobId + '/' + ipaFile);

                                                    array1.ele('key', 'metadata');

                                                    let array3 = array1.ele('dict');
                                                    array3.ele('key', 'bundle-identifier');
                                                    array3.ele('string', project.bundleIdentifier);
                                                    array3.ele('key', 'kind');
                                                    array3.ele('string', 'software');
                                                    array3.ele('key', 'title');
                                                    array3.ele('string', ipaFile.replace(".ipa", ""));

                                                    root = root.end({ pretty: true});

                                                    const plistFile = './public/'+ req.params.jobId + '/' + ipaFile.replace(".ipa", "") + '.plist';

                                                    fs.writeFile(plistFile, root, (err) => {
                                                        if (fs.existsSync(plistFile)) {
                                                            res.download(plistFile);
                                                        } else {
                                                            res.status(200).send({ code: -1, description: "PLIST file not found" });
                                                        }
                                                    });

                                                });

                                            }
                                        });
                                    });

                                }

                                unzip.on('error', (err) => {
                                    res.status(200).send({ code: -1, description: err.message });
                                });

                            });

                            writeStream.on('error', (err) => {
                                res.status(200).send({ code: -1, description: err.message });
                            });

                            writeStream.end();

                        })
                        .catch(function (err) {
                            console.log(err);
                            res.status(200).send({ code: -1, description: "Artifact doesn't exist" });
                        });
                } else {

                    if (project.platform === "android") {
                        const output = JSON.parse(fs.readFileSync('./public/'+ req.params.jobId + '/' + apkOutput + '/output.json', 'utf8'));

                        const apkFile = './public/'+ req.params.jobId + '/' + apkOutput + '/' + output[0].apkInfo.outputFile;

                        if (fs.existsSync(apkFile)) {
                            res.download(apkFile);
                        } else {
                            res.status(406).send({ code: -1, description: "APK file not found" });
                        }
                    } else if (project.platform === "ios") {

                        const ipaFile = fs.readdirSync('./public/'  + req.params.jobId)[0];
                        const plistFile = './public/'+ req.params.jobId + '/' + ipaFile.replace(".ipa", "") + '.plist';

                        if (fs.existsSync(plistFile)) {
                            res.download(plistFile);
                        } else {
                            res.status(406).send({ code: -1, description: "PLIST file not found" });
                        }

                    }

                }

            }
        } else {
            res.status(406).send({ code: -1, description: project.description });
        }

    }

});

module.exports = router;
