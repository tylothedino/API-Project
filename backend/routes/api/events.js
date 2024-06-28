const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');
const group = require('./groups');

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

event.get('/:eventId/attendees', async (req, res, next) => {
    const { user } = req;

    //Grab the eventId
    const eventId = parseInt(req.params.eventId);
    //Find the event
    const findEvent = await Event.findByPk(eventId);

    //If the event doesn't exist
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Find the User's role
    const eventGroup = await Group.findByPk(findEvent.groupId);
    const groupOrganizerId = eventGroup.dataValues.organizerId;

    //Find the User's membership
    const groupMembership = await Membership.findOne({
        where: {
            groupId: eventGroup.id,
            userId: user.id
        }
    });

    let attendees;


    //Grab from here

    attendees = await Attendance.findAll({
        where: {
            eventId: eventId
        },
        attributes: ['status'],
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }

    });


    //To here



    //If they don't have a membership
    if (!groupMembership) {
        //Check if they are the organizer
        if (groupOrganizerId === user.id) {
            attendees = await Attendance.findAll({
                where: {
                    eventId: eventId
                },
                attributes: ['status'],
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }

            });

        }
        //If they aren't give them all attendees that aren't pending
        else {
            attendees = await Attendance.findAll({
                where: {
                    eventId: eventId,
                    status: ['attending', 'waitlist']
                },
                attributes: ['status'],
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }

            });


        }

    } else {
        //Check if they are the organizer
        if (groupOrganizerId === user.id || groupMembership.status === 'co-host') {
            attendees = await Attendance.findAll({
                where: {
                    eventId: eventId
                },
                attributes: ['status'],
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }

            });

        }
        //If they aren't give them all attendees that aren't pending
        else {
            attendees = await Attendance.findAll({
                where: {
                    eventId: eventId,
                    status: ['attending', 'waitlist']
                },
                attributes: ['status'],
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }

            });



        }


    }

    const flatten = attendees.map(user => {
        return {
            ...user.toJSON().User,
            Attendance: { status: user.toJSON().status }
        }
    })


    return res.json({ Attendees: flatten });

})


//Request to attend an event based on the event's id

event.post('/:eventId/attendance', [requireAuth], async (req, res, next) => {
    const { user } = req;

    //Grab the eventId
    const eventId = parseInt(req.params.eventId);
    //Find the event
    const findEvent = await Event.findByPk(eventId);

    //If the event doesn't exist
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Find the User's role
    const eventGroup = await Group.findByPk(findEvent.groupId);
    const groupOrganizerId = eventGroup.dataValues.organizerId;

    //Find the User's membership
    const groupMembership = await Membership.findOne({
        where: {
            groupId: eventGroup.id,
            userId: user.id
        }
    });


    //Check if they are part of the group
    if (groupOrganizerId !== user.id && !groupMembership) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }


    //Check if they have an already waiting attendance
    const userAttendance = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId: findEvent.id
        }
    });

    if (userAttendance) {
        if (userAttendance.status === 'pending') {
            const err = new Error("Attendance has already been requested");
            err.status = 400;
            return next(err);
        } else if (userAttendance.status === 'attending') {
            const err = new Error("User is already an attendee of the event");
            err.status = 400;
            return next(err);

        } else if (userAttendance.status == 'waitlist') {
            const err = new Error("User is already on the waitlist for the event");
            err.status = 400;
            return next(err);
        }
    }

    const createAttendance = await Attendance.create({
        eventId: findEvent.id,
        userId: user.id
    });

    const usersAttendance = {
        userId: createAttendance.userId,
        status: createAttendance.status
    }

    return res.json(usersAttendance);


});



event.put('/:eventId/attendance', [requireAuth], async (req, res, next) => {
    const { user } = req;

    //Grab the eventId
    const eventId = parseInt(req.params.eventId);
    //Find the event
    const findEvent = await Event.findByPk(eventId);

    //If the event doesn't exist
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Find the User's role
    const eventGroup = await Group.findByPk(findEvent.groupId);
    const groupOrganizerId = eventGroup.dataValues.organizerId;

    //Find the User's membership
    const groupMembership = await Membership.findOne({
        where: {
            groupId: eventGroup.id,
            userId: user.id
        }
    });


    //Check if they are part of the group
    if (groupOrganizerId !== user.id && !groupMembership) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    if (groupMembership) {
        //Check if they have the correct role in the group
        if (groupMembership.status !== 'co-host') {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
    }



    //Grab the req body
    const { userId, status } = req.body;

    //Find the attendee
    const attendeeUser = await User.findByPk(userId);

    //IF the attendee doesn't exist
    if (!attendeeUser) {
        const err = new Error("User couldn't be found");
        err.status = 404;
        return next(err);

    }

    //If the status is pending
    if (status === 'pending') {
        const err = new Error("Bad request");
        err.errors = { status: 'Cannot change a membership status to pending' }
        err.status = 400;
        return next(err);
    }


    //Successful response
    //Grab the attendance
    const userAttendance = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: eventId
        }
    });

    if (!userAttendance) {
        const err = new Error("Attendance between the user and the event does not exist");
        err.status = 404;
        return next(err);

    }

    //Update the attendance
    await userAttendance.update({
        status
    });

    delete userAttendance.dataValues.createdAt;
    delete userAttendance.dataValues.updatedAt;



    return res.json(userAttendance)


});



//Delete attendance to an event specified by ID

event.delete('/:eventId/attendance/:userId', [requireAuth], async (req, res, next) => {
    const { user } = req;

    //Grab the eventId
    const eventId = parseInt(req.params.eventId);
    //Find the event
    const findEvent = await Event.findByPk(eventId);

    //If the event doesn't exist
    if (!findEvent) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Grab the target User
    const targetUserId = parseInt(req.params.userId);
    const targetUser = await User.findByPk(targetUserId);

    //If the User doesn't exist
    if (!targetUser) {
        const err = new Error("User couldn't be found");
        err.status = 404;
        return next(err);
    }

    const targetAttendance = await Attendance.findOne({
        where: {
            userId: targetUserId,
            eventId: eventId
        }
    });

    if (!targetAttendance) {
        const err = new Error("Attendance does not exist for this User");
        err.status = 404;
        return next(err);
    }

    //Grab the group
    const eventGroup = await Group.findByPk(findEvent.groupId);

    //Find if they have the proper authorization
    if (eventGroup.organizerId !== user.id && user.id !== targetUserId) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);

    }

    await targetAttendance.destroy();

    return res.json({ message: "Successfully deleted attendance from event" })


});












module.exports = event;
