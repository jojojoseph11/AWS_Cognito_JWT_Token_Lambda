const router = require("express").Router();
const handler = require("../handlers/userHandler");
const bodyParser = require('body-parser').json();

router.post("/uploadImage", handler.uploadImage);
router.post("/createUser", bodyParser, handler.createUser);
router.get("/getImage", bodyParser, handler.getImage);
router.get("/listImages", bodyParser, handler.listImages);

module.exports = router;