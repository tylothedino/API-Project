const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');
const group = require('./groups');

const groupImage = express.Router();

groupImage.delete('/:imageId', [requireAuth], async (req, res, next) => {
    const { user } = req;

    const imageId = parseInt(req.params.imageId);
    const image = await GroupImage.findByPk(imageId);

    if (!image) {
        const err = new Error("Group Image couldn't be found");
        err.status = 404;
        return next(err);

    }

    //Grab the group
    const imageGroup = await Group.findByPk(image.groupId);

    //Grab the membership
    const userMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: imageGroup.id
        }
    });

    //Find if User has the proper authorization
    if (userMembership) {
        if (userMembership.status !== 'co-host') {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
    } else {
        if (imageGroup.organizerId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

    }

    await image.destroy();

    return res.json({ message: "Successfully deleted" })


});






module.exports = groupImage;
