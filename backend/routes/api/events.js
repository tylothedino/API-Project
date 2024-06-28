const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');

const event = express.Router();


event.get('/', async (req, res, next) => {
    const Events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'price', 'description', 'capacity'],
            include: [
                [
                    Sequelize.fn("COUNT", Sequelize.col("Attendances.eventId")), "numAttending",
                ]
            ]
        },
        include: [
            {
                model: Attendance,
                attributes: [],
            },
            {
                model: EventImage,
                as: 'EventImages',
                attributes: [
                    ['url', 'previewImage'],
                    [
                        Sequelize.literal(`CASE WHEN EventImages.preview = true THEN EventImages.url ELSE "No available preview" END`),
                        'previewImage'
                    ]
                ]
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ],
        group: ['Event.id']
    });

    const flatten = Events.map(event => {
        return {
            ...event.toJSON(),
            previewImage: event.toJSON().EventImages[0]?.previewImage

        }
    });

    flatten.map(event => {
        delete event.EventImages;
    });



    return res.json({ Events: flatten });
});



event.get('/:eventId', async (req, res, next) => {

    const eventId = req.params.eventId;
    const findEvent = await Event.findByPk(eventId);


    //If a group couldn't be found
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }

    const Events = await Event.findAll({
        where: {
            id: eventId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'price', 'description', 'capacity'],
            include: [
                [
                    Sequelize.fn("COUNT", Sequelize.col("Attendances.eventId")), "numAttending",
                ]
            ]
        },
        include: [
            {
                model: Attendance,
                attributes: [],
            },
            {
                model: EventImage,
                as: 'EventImages',
                attributes: [
                    ['url', 'previewImage'],
                    [
                        Sequelize.literal(`CASE WHEN EventImages.preview = true THEN EventImages.url ELSE "No available preview" END`),
                        'previewImage'
                    ]
                ]
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ],
        group: ['Event.id']
    });

    const flatten = Events.map(event => {
        return {
            ...event.toJSON(),
            previewImage: event.toJSON().EventImages[0]?.previewImage

        }
    });

    flatten.map(event => {
        delete event.EventImages;
    });



    return res.json({ Events: flatten });
});


//Add an image to an event based on the Event's ID

event.post('/:eventId/images', [requireAuth], async (req, res, next) => {

    //Grab eventID
    const eventId = req.params.eventId;
    //Grab request body
    const { url, preview } = req.body;
    //Grab the current User
    const { user } = req;

    //Find the event
    const findEvent = await Event.findByPk(eventId);


    //Check if event exists and if it doesn't send an error
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }



    //Grab their attendance status
    const attendanceStatus = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId: eventId
        }
    });

    //Find their membership status to the group
    const groupId = findEvent.groupId;
    //Grab the group
    const eventGroup = await Group.findByPk(groupId);
    //Grab the user's membership to the group
    const userGroupMember = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: eventGroup.id
        }
    });



    //Check if the User has the correct permissions
    if (attendanceStatus !== 'attending' && userGroupMember.status !== 'co-host' && eventGroup.organizerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }


    //If the User has the perms create a new Image and set it to the Event
    const newEventImg = await EventImage.create({
        eventId, url, preview
    });

    delete newEventImg.dataValues.createdAt;
    delete newEventImg.dataValues.eventId;
    delete newEventImg.dataValues.updatedAt;


    return res.json(newEventImg);
});


//Edit an event specified by it's id


event.put('/:eventId', [requireAuth], async (req, res, next) => {

    //Grab eventID
    const eventId = req.params.eventId;
    //Grab request body
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    //Grab the current User
    const { user } = req;

    //Find the event
    const findEvent = await Event.findByPk(eventId);


    //Check if event exists and if it doesn't send an error
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Find the venue if they gave a venueId
    if (venueId) {
        //Find the venue
        const findVenue = await Venue.findByPk(venueId);
        //Check if the venue exists and if it doesn't send an error
        if (!findVenue) {
            const err = new Error("Venue couldn't be found");
            err.status = 404;
            return next(err);
        }

    }

    //Find their membership status to the group
    const groupId = findEvent.groupId;
    //Grab the group
    const eventGroup = await Group.findByPk(groupId);
    //Grab the user's membership to the group
    const userGroupMember = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: eventGroup.id
        }
    });


    //Check if the User has the correct permissions
    if (userGroupMember.status !== 'co-host' && eventGroup.organizerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }


    //If the User has the perms edit the event, update event

    await findEvent.update({
        venueId, name, type, capacity, price, description, startDate, endDate
    })

    delete findEvent.dataValues.updatedAt;

    return res.json(findEvent);
});

//Delete an Event


event.delete('/:eventId', [requireAuth], async (req, res, next) => {

    //Grab eventID
    const eventId = req.params.eventId;
    //Grab the current User
    const { user } = req;

    //Find the event
    const findEvent = await Event.findByPk(eventId);


    //Check if event exists and if it doesn't send an error
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }


    //Find their membership status to the group
    const groupId = findEvent.groupId;
    //Grab the group
    const eventGroup = await Group.findByPk(groupId);
    //Grab the user's membership to the group
    const userGroupMember = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: eventGroup.id
        }
    });

    if (!userGroupMember) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }


    //Check if the User has the correct permissions
    if (userGroupMember.status !== 'co-host' && eventGroup.organizerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }


    await findEvent.destroy();

    return res.json({ message: "Successfully deleted" })


});

module.exports = event;
