const express = require("express");
const { register, login } = require("../controllers/usercontroller");
const router = express.Router()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

router.route('/register').post(register);
router.route('/login').post(login);


module.exports = router;