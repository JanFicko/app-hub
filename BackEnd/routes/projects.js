const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const config = require('../config');
const fs = require('fs');
const AdmZip = require('adm-zip');
const rimraf = require("rimraf");
const xmlbuilder = require("xmlbuilder");
const ProjectController = require('../controllers/projectController');
const UserController = require('../controllers/userController');

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
            uri: config.GITLAB_IP + platformType + 'projects',
            qs: {
                per_page: '100'
            },
            headers: {
                'PRIVATE-TOKEN': config.GITLAB_PRIVATE_TOKEN
            },
            json: true
        }).then((bodyResponse) => {
            ProjectController.addProjects(bodyResponse, platform);
        }).catch((err) => {
            console.log(err);
        });

        res.status(200).send(await ProjectController.getUsersProjects(userId, platform));
    }

});

router.route("/allProjects").get(async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token == null) {
        res.status(406).send();
    } else {
        const getUserByTokenResponse = await UserController.getUserByToken(req.headers.authorization.split(" ")[1]);
        if (getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin) {
            res.status(200).send(await ProjectController.getUsersProjects("all", "all"));
        } else {
            res.send({ code: -1, description: 'Access Denied'});
        }
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
    const { packageName, downloadPassword } = req.body;

    const getUserByTokenResponse = await UserController.getUserByToken(req.headers.authorization.split(" ")[1]);
    if (getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin) {
        const createProjectResponse = await ProjectController.updateProject(req.params.projectId, packageName, downloadPassword);
        res.status(200).send(createProjectResponse);
    } else {
        res.send({ code: -1, description: 'Access Denied'});
    }
});

router.route("/job/:jobId").put(async (req, res, next) => {
    const { version, changeLog } = req.body;

    const getUserByTokenResponse = await UserController.getUserByToken(req.headers.authorization.split(" ")[1]);
    if (getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin) {
        const createProjectResponse = await ProjectController.updateJob(req.params.jobId, version, changeLog);
        res.status(200).send(createProjectResponse)
    } else  {
        res.send({ code: -1, description: 'Access Denied'});
    }

});

router.route("/userAccess").post(async (req, res, next) => {
    const { userId, projects } = req.body;

    if (!userId || !projects ) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {
        const getUserByTokenResponse = await UserController.getUserByToken(req.headers.authorization.split(" ")[1]);
        if (getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin) {
            const createProjectResponse = await ProjectController.updateProjectAccess(userId, projects);
            res.status(200).send(createProjectResponse)
        } else {
            res.send(getUserByTokenResponse);
        }
    }
});


router.route("/androidArtifacts").post(async (req, res, next) => {

    const { jobId } = req.body;

    const project = await ProjectController.getAndroidArtifacts(jobId);
    //const projectName = project.path.split(/[/]+/).pop();

    const zipFilePath = './public/' + jobId + '.zip';
    const outputPath = './public/' + jobId;

    if (project.code !== -1) {

        if (!fs.existsSync(zipFilePath)) {
            rp({
                uri: config.GITLAB_IP.replace(config.GITLAB_IP_SUFFIX, "") + project.path + "/-/jobs/" + jobId + '/artifacts/download',
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

                    const zip = new AdmZip(zipFilePath);
                    zip.extractAllTo(/*target path*/'./public/', /*overwrite*/true);
                    fs.rename('./public/app/build/outputs/apk/', './public/' + jobId, function (err) {
                        if (err == null) {

                            rimraf('./public/app/', async (err) => {

                                if (err == null) {

                                    fs.readdir(outputPath, function(err, directories) {
                                        for (let i = 0; i < directories.length; i++) {
                                            directories[i] = directories[i] + "/" + JSON.parse(fs.readFileSync(outputPath + '/' + directories[i] +'/output.json', 'utf8'))[0].apkData.outputFile;
                                        }
                                        res.status(200).send({ code: 0, outputs: directories});
                                    });

                                } else {
                                    res.status(200).send({ code: -1, description: err.message });
                                }
                            });

                        }
                    });
                });

                writeStream.on('error', (err) => {
                    res.status(200).send({ code: -1, description: err.message });
                });

                writeStream.end();
            }).catch(function (err) {
                console.log(err);
                res.status(200).send({ code: -1, description: "Artifact doesn't exist" });
            });
        } else {
            if (fs.existsSync(outputPath)) {

                fs.readdir(outputPath, function(err, directories) {
                    for (let i = 0; i < directories.length; i++) {
                        directories[i] = directories[i] + "/" + JSON.parse(fs.readFileSync(outputPath + '/' + directories[i] +'/output.json', 'utf8'))[0].apkData.outputFile;
                    }
                    res.status(200).send({ code: 0, outputs: directories});
                });
            } else {
                const zip = new AdmZip(zipFilePath);
                zip.extractAllTo(/*target path*/'./public/', /*overwrite*/true);

                fs.rename('./public/app/build/outputs/apk/', './public/' + jobId, function (err) {

                    if (err == null) {

                        rimraf('./public/app/', async (err) => {

                            if (err == null) {
                                fs.readdir(outputPath, function(err, directories) {
                                    for (let i = 0; i < directories.length; i++) {
                                        directories[i] = directories[i] + "/" + JSON.parse(fs.readFileSync(outputPath + '/' + directories[i] +'/output.json', 'utf8'))[0].apkData.outputFile;
                                    }
                                    res.status(200).send({ code: 0, outputs: directories});
                                });
                            } else {
                                res.status(200).send({ code: -1, description: err.message });
                            }
                        });

                    }
                });
            }

        }
    } else {
        res.status(200).send({ code: -1, description: "Something went wrong" });
    }

});

router.route("/download/:jobId/:userId/:output").get(async (req, res, next) => {

    const deviceInfo = req.get('DeviceInfo');
    let apkOutput;

    if (req.params.output == null) {
        apkOutput = "debug";
    } else {
        apkOutput = req.params.output;
    }

    if (!req.params.jobId || !req.params.userId) {
        res.status(400).send({ code: -1, description: "Data not received" });
    } else {
        const project = await ProjectController.downloadArtifact(req.ip, req.params.jobId, req.params.userId);

        // Fixme
        const filePath = './public/' + req.params.jobId + '.zip';

        if (project.code !== -1) {

            if (project.platform === 'ios' && project.packageName == null) {
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

                                const zip = new AdmZip(filePath);
                                zip.extractAllTo(/*target path*/"./public/", /*overwrite*/true);

                                if (project.platform === "android") {

                                    fs.rename('./public/app/build/outputs/apk/', './public/' + req.params.jobId, function (err) {
                                        if (err == null) {

                                            rimraf('./public/app/', async (err) => {

                                                const output = JSON.parse(fs.readFileSync('./public/' + req.params.jobId + '/' + apkOutput +'/output.json', 'utf8'));

                                                ProjectController.updateJob(req.params.jobId,'v' + output[0].apkData.versionName, null);

                                                const apkFile = './public/'+ req.params.jobId + '/' + apkOutput + '/' + output[0].apkData.outputFile;

                                                if (fs.existsSync(apkFile)) {
                                                    UserController.log(
                                                        req.params.userId,
                                                        req.params.jobId + '/' + output[0].apkData.outputFile,
                                                        'Download',
                                                        req.ip,
                                                        deviceInfo
                                                    );

                                                    res.download(apkFile);
                                                } else {
                                                    res.status(200).send({ code: -1, description: "APK file not found" });
                                                }
                                            });

                                        }
                                    });
                                } else if (project.platform === "ios") {
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

                                                let array2 = array1.ele('array').ele('dict');
                                                array2.ele('key', 'kind');
                                                array2.ele('string', 'software-package');
                                                array2.ele('key', 'url');
                                                array2.ele('string', 'https://' + config.DOMAIN_NAME + '/' + req.params.jobId + '/' + ipaFile);

                                                array1.ele('key', 'metadata');

                                                let array3 = array1.ele('dict');
                                                array3.ele('key', 'bundle-identifier');
                                                array3.ele('string', project.packageName);
                                                array3.ele('key', 'kind');
                                                array3.ele('string', 'software');
                                                array3.ele('key', 'title');
                                                array3.ele('string', ipaFile.replace(".ipa", ""));

                                                root = root.end({ pretty: true});

                                                const plistFile = './public/'+ req.params.jobId + '/' + ipaFile.replace(".ipa", "") + '.plist';

                                                fs.writeFile(plistFile, root, (err) => {
                                                    if (fs.existsSync(plistFile)) {
                                                        UserController.log(
                                                            req.params.userId,
                                                            req.params.jobId + '/' + ipaFile,
                                                            'Download',
                                                            req.ip,
                                                            deviceInfo
                                                        );

                                                        res.download(plistFile);
                                                    } else {
                                                        res.status(200).send({ code: -1, description: "PLIST file not found" });
                                                    }
                                                });

                                            });

                                        }
                                    });

                                }


                            });

                            writeStream.on('error', (err) => {
                                res.status(200).send({ code: -1, description: err.message });
                            });

                            writeStream.end();

                        })
                        .catch(function (err) {
                            res.status(200).send({ code: -1, description: "Artifact doesn't exist" });
                        });
                } else {

                    if (project.platform === "android") {
                        if (apkOutput.includes('.')) {
                            apkOutput = apkOutput.split('.')[0]
                        }

                        const output = JSON.parse(fs.readFileSync('./public/'+ req.params.jobId + '/' + apkOutput + '/output.json', 'utf8'));
                        const apkFile = './public/'+ req.params.jobId + '/' + apkOutput + '/' + output[0].apkData.outputFile;

                        if (fs.existsSync(apkFile)) {
                            UserController.log(
                                req.params.userId,
                                req.params.jobId + '/' + output[0].apkData.outputFile,
                                'Download',
                                req.ip,
                                deviceInfo
                            );

                            res.download(apkFile);
                        } else {
                            res.status(406).send({ code: -1, description: "APK file not found" });
                        }
                    } else if (project.platform === "ios") {

                        const ipaFile = fs.readdirSync('./public/'  + req.params.jobId)[0];
                        const plistFile = './public/'+ req.params.jobId + '/' + ipaFile.replace(".ipa", "") + '.plist';

                        if (fs.existsSync(plistFile)) {
                            UserController.log(
                                req.params.userId,
                                req.params.jobId + '/' + ipaFile,
                                'Download',
                                req.ip,
                                deviceInfo
                            );

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
