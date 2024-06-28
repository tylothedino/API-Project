const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Attendance, EventImage, Event } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const venuesRouter = require('./venues.js');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');

const group = express.Router();


//Get all groups
group.get('/', async (req, res, next) => {
    const Groups = await Group.findAll({});
    return res.json({ Groups });

});

//Get user's group
group.get("/current", [requireAuth], async (req, res) => {
    const { user } = req;
    const Groups = await user.getGroups();
    return res.json({ Groups });
});

//Get group by ID
group.get('/:groupId', async (req, res, next) => {

    //Search for Group by ID
    const group = await Group.findByPk(req.params.groupId);

    //If a group couldn't be found
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Spread the group into an Obj
    let result = { ...group.dataValues };

    //Count all members
    const findMembers = await Membership.count({
        where: {
            groupId: result.id
        }
    });

    //Set the number of members into the obj
    result.numMembers = findMembers;

    //Get all the GroupImages and set to the obj
    result.GroupImages = await GroupImage.findAll({
        where: {
            groupId: result.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    //Get the organizer and set to the obj
    result.Organizer = await User.findAll({
        where: {
            id: result.organizerId
        },
        attributes: ['id', 'firstName', 'lastName']
    });

    //Get the venue and set to the obj
    result.Venues = await Venue.findOne({
        where: {
            groupId: result.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })

    return res.json(result);
});


group.post('/', [requireAuth], async (req, res, next) => {

    const { user } = req;

    const { name, about, type, private, city, state } = req.body;

    let newGroup;
    //Try to create a user
    try {
        //An error is thrown here when there is a attribute error
        newGroup = await Group.create({
            organizerId: user.id, name, about, type, private, city, state,

        });

    }
    //If the model validation/constraint finds and Error, catch the error and send it to the error handler
    catch (err) {
        err.message = 'Bad Request';
        err.errors = err.errors
        err.status = 500;

        return next(err)

    }
    res.status(201);
    return res.json(newGroup);

});


//Add an Image to a Group based on the Group's ID ONLY if you are the Organizer of the group
group.post('/:groupId/images', [requireAuth], async (req, res, next) => {

    //Check to see if you have the correct role
    const { user } = req;
    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);


    //Check to see if the group exists


    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================


    // console.log(membershipStatus.status);

    if (findGroup.organizerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    //============================================



    const { url, preview } = req.body;

    const addImage = await GroupImage.create({
        url, preview
    });

    const result = {
        id: addImage.id,
        url: addImage.url,
        preview: addImage.preview
    }

    return res.json(result);

});

//Edit a group

group.put('/:groupId', [requireAuth], async (req, res, next) => {
    //Check to see if you have the correct role
    const { user } = req;
    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);



    //Check to see if the group exists


    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }
    //============================================

    if (findGroup.organizerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    //============================================


    const { name, about, type, private, city, state } = { ...req.body };

    await findGroup.update({
        name, about, type, private, city, state
    })

    return res.json(
        findGroup
    );

});



//Delete a group by ID
group.delete('/:groupId', [requireAuth], async (req, res, next) => {

    //Check to see if you have the correct role
    const { user } = req;
    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);


    //Check to see if the group exists


    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }
    //============================================

    if (findGroup.organizerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    //============================================

    const destroyGroup = await Group.findByPk(groupId);

    await destroyGroup.destroy();

    return res.json({ message: "Successfully deleted" });


});



//VENUES

group.get('/:groupId/venues', [requireAuth], async (req, res, next) => {

    const { user } = req;
    //Search for Group by ID
    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);


    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================

    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    });

    // console.log(membershipStatus.status);

    if (findGroup.organizerId !== user.id || membershipStatus.status !== 'co-host') {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    //============================================

    const Venues = await Venue.findAll({
        where: {
            groupId
        }
    });

    return res.json({ Venues });

});


group.post('/:groupId/venues', [requireAuth], async (req, res, next) => {

    const { user } = req;
    //Search for Group by ID
    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);


    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================

    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });

    // console.log(membershipStatus.status);

    if (findGroup.organizerId !== user.id || membershipStatus.status !== 'co-host') {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    //============================================
    const { address, city, state, lat, lng } = req.body;

    let createVenue;

    try {
        createVenue = await Venue.create({
            groupId, address, city, state, lat, lng
        });

        const result = {
            id: createVenue.id,
            groupId: createVenue.groupId,
            address: createVenue.address,
            city: createVenue.city,
            state: createVenue.state,
            lat: createVenue.lat,
            lng: createVenue.lng
        }

    } catch (err) {
        err.message = 'Bad Request';
        err.errors = err.errors
        err.status = 500;

        return next(err)
    }

    return res.json(createVenue);

});


group.get('/:groupId/events', async (req, res, next) => {

    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);


    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    const Events = await Event.findAll({
        where: {
            groupId
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



group.post('/:groupId/events', [requireAuth], async (req, res, next) => {

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const { user } = req;
    //Search for Group by ID
    const groupId = req.params.groupId;
    const findGroup = await Group.findByPk(groupId);


    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================

    //If Venue couldn't be found

    const findVenue = await Venue.findByPk(venueId);
    if (!findVenue) {
        const err = new Error("Venue couldn't be found");
        err.status = 404;
        return next(err);
    }


    //====================================

    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });

    // console.log(membershipStatus.status);

    if (findGroup.organizerId !== user.id || membershipStatus.status !== 'co-host') {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    //============================================

    let createEvent;

    try {
        createEvent = await Event.create({
            venueId, name, type, capacity, price, description, startDate, endDate
        });

    } catch (err) {
        err.message = 'Bad Request';
        err.errors = err.errors
        err.status = 500;

        return next(err)
    }

    createEvent.groupId = groupId;

    delete createEvent.dataValues.createdAt;
    delete createEvent.dataValues.updatedAt;


    return res.json(createEvent);

});








module.exports = group;
