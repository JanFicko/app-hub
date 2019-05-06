const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.route("/").get(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token == null) {
    res.status(406).send();
  } else {
    res.status(200).send(await UserController.getUsers(req.headers.authorization.split(" ")[1]));
  }

});

router.route("/:id").get(async (req, res, next) => {
  const getUserByTokenResponse = await UserController.getUserByToken(req.headers.authorization.split(" ")[1]);
  if ((getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin)
      || getUserByTokenResponse.user != null && req.params.id === getUserByTokenResponse.user._id) {
    res.send(await UserController.getUserById(req.params.id));
  } else {
    res.send(getUserByTokenResponse);
  }
});

router.route('/').post(async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password ) {
    res.status(400).send({ code: -1, description: "Data not received" });
  } else {
    const getUserByTokenResponse = await UserController.getUserByToken(req.headers.authorization.split(" ")[1]);
    if (getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin) {
        res.send(await UserController.register(email, password, isAdmin));
    } else {
      res.send(getUserByTokenResponse);
    }
  }
});

router.route('/').put(async (req, res, next) => {
  const { userId, password, isAdmin, isBanned } = req.body;

  if (!userId) {
    res.status(400).send({ code: -1, description: "Data not received" });
  } else {
    res.send(await UserController.update(userId, password, isAdmin, isBanned, req.ip));
  }
});

router.route('/login').post(async (req, res, next) => {
  const { email, password, device } = req.body;

  if (!email || !password ) {
    res.status(400).send({ code: -1, description: "Data not received" });
  } else {
    res.send(await UserController.login(email, password, req.ip, device));
  }
});

module.exports = router;
