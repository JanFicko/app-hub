const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.route("/").get(async (req, res, next) => {
  res.status(200).send(
      await UserController.getUsers()
  );
});

router.route("/:id").get(async (req, res, next) => {
  res.status(200).send(
      await UserController.getUserById(req.params.id)
  );
});

router.route('/').post(async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password ) {
    res.status(400).send({ code: -1, description: "Data not received" });
  } else {
    const createUserResponse = await UserController.register(email, password, isAdmin);
    if(createUserResponse.code === -1){
      res.status(406).send();
    } else {
      res.status(201).send();
    }
  }
});

router.route('/').put(async (req, res, next) => {
  const { id, password, isAdmin, isBanned } = req.body;

  if (!id) {
    res.status(400).send({ code: -1, description: "Data not received" });
  } else {
    res.send(
        await UserController.update(id, password, isAdmin, isBanned, req.ip)
    );
  }
});

router.route('/login').post(async (req, res, next) => {
  const { email, password, device } = req.body;

  if (!email || !password ) {
    res.status(400).send({ code: -1, description: "Data not received" });
  } else {
    res.send(
        await UserController.login(email, password, req.ip, device)
    );
  }
});

module.exports = router;