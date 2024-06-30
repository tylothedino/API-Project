const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');
const group = require('./groups');

const eventImage = express.Router();

eventImage.delete('/:imageId', [requireAuth], async (req, res, next) => {
    const { user } = req;

    const imageId = parseInt(req.params.imageId);
    const image = await EventImage.findByPk(imageId);

    if (!image) {
        const err = new Error("Event Image couldn't be found");
        err.status = 404;
        return next(err);

    }

    //Grab the Event
    const imageEvent = await Event.findByPk(image.eventId);

    //Grab the Group of the Event
    const eventGroup = await Group.findByPk(imageEvent.groupId);

    //Grab the membership
    const userMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: eventGroup.id
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
        if (eventGroup.organizerId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

    }

    await image.destroy();

    return res.json({ message: "Successfully deleted" })



});






module.exports = eventImage;
