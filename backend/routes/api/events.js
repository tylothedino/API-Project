const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');
const group = require('./groups');

const event = express.Router();

const goodQuery = [
    check("page")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage(
            "Page must be greater than or equal to 1 and less than or equal to 10"
        ),
    check("size")
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage(
            "Size must be greater than or equal to 1 and less than or equal to 20"
        ),
    check("name").optional().isString().withMessage("Name must be a string"),
    check("type")
        .optional()
        .isIn(["Online", "In person"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check("startDate")
        .optional()
        .custom((value, { req }) => {
            if (!value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
                throw new Error("Date and time must be in the format: YYYY-MM-DD HH:MM:SS");
            }
            return true;
        })
        .withMessage("Start date must be a valid datetime"),
    handleValidationErrors,
];

const changeDate = (dateString) => {

    const date = new Date(dateString);

    const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;

    return formattedDate;
}


event.get('/', goodQuery, async (req, res, next) => {

    // let { page = 1, size = 20, name, type, startDate } = req.query;
    // page = parseInt(page);
    // size = parseInt(size);

    // const options = { where: {} };
    // options.limit = size;
    // options.offset = size * (page - 1);

    // if (name) {
    //     options.where.name = { [Sequelize.Op.like]: "%" + name + "%" };
    // }
    // if (type) {
    //     options.where.type = type;
    // }
    // if (startDate) {
    //     const dateStringUTC = startDate + 'Z';
    //     const start = new Date(dateStringUTC);
    //     const formattedDate = start.toISOString();

    //     options.where.startDate = {
    //         [Sequelize.Op.gte]: formattedDate,
    //     };
    // }

    const Events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'price', 'capacity'],
            // include: [
            //     [
            //         Sequelize.fn("COUNT", Sequelize.col("Attendances.eventId")), "numAttending",
            //     ]
            // ]
        },
        include: [
            {
                model: Attendance,
                attributes: [],
            },
            {
                model: EventImage,
                attributes: [
                    ['url', 'previewImage'],
                    'id'
                ]
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },

        ],
        // ...options,
        group: ['Event.id', 'EventImages.id', 'Group.id'],
    });

    const countPromises = Events.map(async event => {
        const currentEventCount = await Attendance.count({
            where: {
                eventId: event.id,
                status: 'attending'
            }
        });
        return currentEventCount;
    });

    const counts = await Promise.all(countPromises);

    const flatten = await Promise.all(Events.map(async (event, index) => {
        const findPreviewImage = await EventImage.findOne({
            where: {
                eventId: event.id, preview: true
            },
            attributes: ['url']
        });

        return {
            ...event.toJSON(),
            numAttending: counts[index],
            startDate: changeDate(event.dataValues.startDate),
            endDate: changeDate(event.dataValues.endDate),
            previewImage: findPreviewImage ? findPreviewImage.url : "None",

        };
    }));

    flatten.map(event => {
        delete event.EventImages;
    });


    return res.json({ Events: flatten });
});

///=========================================================

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
            exclude: ['createdAt', 'updatedAt'],

        },
        include: [
            {
                model: Attendance,
                attributes: [],
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state', 'private']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },

        ],
        // group: ['Event.id']
    });

    const flatten = await Promise.all(Events.map(async (event) => {
        const findPreviewImage = await EventImage.findOne({
            where: {
                eventId: event.id, preview: true
            },
            attributes: ['url']
        });


        const numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: ['attending']
            }
        })

        return {
            ...event.toJSON(),
            numAttending: numAttending,
            startDate: changeDate(event.dataValues.startDate),
            endDate: changeDate(event.dataValues.endDate),
            previewImage: findPreviewImage ? findPreviewImage.url : "None",


        }
    }));

    flatten.map(event => {
        delete event.EventImages;
    });



    return res.json(flatten[0]);
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



    // if (userGroupMember) {
    //     if (userGroupMember.status !== 'co-host') {
    //         const err = new Error("Forbidden");
    //         err.status = 403;
    //         return next(err);
    //     }
    // }
    // else {
    //     if (eventGroup.organizerId !== user.id) {
    //         const err = new Error("Forbidden");
    //         err.status = 403;
    //         return next(err);
    //     }

    // }

    // return res.json({ eventGroup, userGroupMember, attendanceStatus })



    //Current User must be an attendee, host, or co-host of the event
    if (eventGroup.organizerId !== user.id) {
        if (userGroupMember) {
            if (userGroupMember.status !== 'co-host') {
                if (attendanceStatus) {
                    if (attendanceStatus.status !== 'attending') {
                        const err = new Error("Forbidden");
                        err.status = 403;
                        return next(err);
                    }
                } else {
                    const err = new Error("Forbidden");
                    err.status = 403;
                    return next(err);
                }

            }

        } else {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }

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


    if (userGroupMember) {
        if (userGroupMember.status !== 'co-host') {
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

    //If the User has the perms edit the event, update event

    try {
        await findEvent.update({
            venueId, name, type, capacity, price, description, startDate, endDate
        });

    } catch (err) {
        err.message = 'Bad Request';
        err.errors = err.errors
        err.status = 400;
        return next(err)

    }



    delete findEvent.dataValues.updatedAt;
    findEvent.dataValues.startDate = changeDate(findEvent.dataValues.startDate);
    findEvent.dataValues.endDate = changeDate(findEvent.dataValues.endDate);



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

    if (userGroupMember) {
        if (userGroupMember.status !== 'co-host') {
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

    if (groupMembership.status === 'pending') {
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
        err.errors = { status: 'Cannot change an attendance status to pending' }
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
