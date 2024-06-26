const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');

const venue = express.Router();



















module.exports = venue;
