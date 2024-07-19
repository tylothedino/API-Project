const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Organizer, Venue, Attendance, EventImage, Event } = require('../../db/models');

const { Sequelize, Op } = require('sequelize');
const venuesRouter = require('./venues.js');
const { createCheckSchema } = require('express-validator/lib/middlewares/schema.js');
const { format } = require('morgan');

const group = express.Router();


const changeDate = (dateString) => {

    const date = new Date(dateString);

    const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;

    return formattedDate;
}

//Get all groups
group.get("/", async (req, res) => {
    const groups = await Group.findAll({});
    const group = await Promise.all(groups.map(async (group) => {
        const findPreviewImage = await GroupImage.findOne({
            where: {
                groupId: group.id, preview: true
            },
            attributes: ['url']
        });

        let membershipCount = await Membership.count({ where: { groupId: group.id } });

        //FRONTEND CHANGE
        const eventCount = await Event.count({ where: { groupId: group.id } });

        const findOrganizer = group.organizerId;
        const findOrganizerMembership = await Membership.findOne({
            where: {
                userId: findOrganizer,
                groupId: group.id
            }
        });

        if (!findOrganizerMembership) {
            membershipCount++
        }


        return {
            ...group.toJSON(),
            previewImage: findPreviewImage ? findPreviewImage.url : "No preview images available",
            numMembers: membershipCount,
            createdAt: changeDate(group.createdAt),
            updatedAt: changeDate(group.updatedAt),
            //FRONTEND CHANGE
            eventCount: eventCount
        };
    }));

    return res.json({ Groups: group });
});

//Get user's group
group.get("/current", [requireAuth], async (req, res) => {
    const { user } = req;
    const Groups = await user.getGroups();

    const groups = await Promise.all(Groups.map(async (group) => {

        let membershipCount = await Membership.count({ where: { groupId: group.id } });

        const userMember = await Membership.findOne({ where: { userId: user.id, groupId: group.id } })

        if (group.organizerId === user.id && !userMember) {
            membershipCount++;
        }

        const findPreviewImage = await GroupImage.findOne({
            where: {
                groupId: group.id, preview: true
            },
            attributes: ['url']
        });

        return {
            ...group.toJSON(),
            numMembers: membershipCount,
            previewImage: findPreviewImage ? findPreviewImage.url : "No preview images available", // Handle the case where findPreviewImage is null
            createdAt: changeDate(group.createdAt),
            updatedAt: changeDate(group.updatedAt)
        };
    }));



    return res.json({ Groups: groups });
});

//Get group by ID
group.get('/:groupId', async (req, res, next) => {

    //Search for Group by ID
    const group = await Group.findByPk(req.params.groupId);

    //FRONTEND CHANGE
    const eventCount = await Event.count({ where: { groupId: group.id } });

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
            exclude: ['createdAt', 'updatedAt', 'groupId']
        }
    });

    //Get the organizer and set to the obj
    result.Organizer = await User.findOne({
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

    result.createdAt = changeDate(result.createdAt);
    result.updatedAt = changeDate(result.updatedAt);
    //FRONTEND CHANGE
    result.eventCount = eventCount
    return res.json(result);
});


group.post('/', [requireAuth], async (req, res, next) => {

    const { user } = req;

    // const { name, about, type, private, city, state } = req.body;


    // let newGroup;
    // //Try to create a group
    // try {
    //     //An error is thrown here when there is a attribute error
    //     newGroup = await Group.create({
    //         organizerId: user.id, name, about, type, private, city, state,

    //     });

    // }
    // //If the model validation/constraint finds and Error, catch the error and send it to the error handler
    // catch (err) {
    //     err.message = 'Bad Request';
    //     err.errors = err.errors
    //     err.status = 400;

    //     return next(err)

    // }
    // res.status(201);
    // newGroup.dataValues.createdAt = changeDate(newGroup.dataValues.createdAt);
    // newGroup.dataValues.updatedAt = changeDate(newGroup.dataValues.updatedAt);
    // return res.json(newGroup);



    // router.post("/groups", async (req, res) => {
    let { group, image } = req.body


    // return res.json(image.groupImage.slice(-6))
    let newGroup = await Group.create(group)

    let newImage
    if (image !== undefined) {
        newImage = await GroupImage.create({ url: image.groupImage, preview: image.preview, groupId: newGroup.id })
        return res.json({ image: newImage, group: newGroup })
    }



    return res.json({ group: newGroup })


});


//Add an Image to a Group based on the Group's ID ONLY if you are the Organizer of the group
group.post('/:groupId/images', [requireAuth], async (req, res, next) => {

    //Check to see if you have the correct role
    const { user } = req;
    const groupId = parseInt(req.params.groupId);
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
        url, preview, groupId
    });

    const result = {
        id: addImage.id,
        url: addImage.url,
        preview: addImage.preview,

    }

    return res.json(result);

});

//Edit a group

group.put('/:groupId', [requireAuth], async (req, res, next) => {
    //Check to see if you have the correct role
    const { user } = req;
    const groupId = parseInt(req.params.groupId);
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

    try {
        await findGroup.update({
            name, about, type, private, city, state
        });
    } catch (err) {
        err.message = 'Bad Request';
        err.errors = err.errors
        err.status = 400;

        return next(err)
    }

    findGroup.dataValues.createdAt = changeDate(findGroup.dataValues.createdAt);
    findGroup.dataValues.updatedAt = changeDate(findGroup.dataValues.updatedAt);

    return res.json(
        findGroup
    );

});



//Delete a group by ID
group.delete('/:groupId', [requireAuth], async (req, res, next) => {

    //Check to see if you have the correct role
    const { user } = req;
    const groupId = parseInt(req.params.groupId);
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
    const groupId = parseInt(req.params.groupId);
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

    if (findGroup.organizerId !== user.id && !membershipStatus) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    if (findGroup.organizerId !== user.id && membershipStatus.status !== 'co-host') {
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
    const groupId = parseInt(req.params.groupId);
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
    if (findGroup.organizerId !== user.id && !membershipStatus) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    if (findGroup.organizerId !== user.id && membershipStatus.status !== 'co-host') {
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
        err.status = 400;

        return next(err)
    }

    delete createVenue.dataValues.updatedAt;
    delete createVenue.dataValues.createdAt;

    return res.json(createVenue);

});


group.get('/:groupId/events', async (req, res, next) => {

    const groupId = parseInt(req.params.groupId);
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
            exclude: ['createdAt', 'updatedAt', 'price', 'capacity']
        },
        include: [
            {
                model: Attendance,
                attributes: [],
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

        //Find numattending

        return {
            ...event.toJSON(),
            numAttending: numAttending,
            startDate: changeDate(event.toJSON().startDate),
            endDate: changeDate(event.toJSON().endDate),
            previewImage: findPreviewImage ? findPreviewImage.url : "None",
        }
    }));

    flatten.map(event => {
        delete event.EventImages;
    });



    return res.json({ Events: flatten });
});



group.post('/:groupId/events', [requireAuth], async (req, res, next) => {

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const { user } = req;
    //Search for Group by ID
    const groupId = parseInt(req.params.groupId);
    const findGroup = await Group.findByPk(groupId);


    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================


    //====================================

    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    });

    // console.log(membershipStatus.status);

    if (findGroup.organizerId !== user.id && !membershipStatus) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    if (findGroup.organizerId !== user.id && membershipStatus.status !== 'co-host') {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    //============================================

    let createEvent;

    //If Venue couldn't be found

    try {
        createEvent = await Event.create({
            venueId, name, type, capacity, price, description, startDate, endDate, groupId
        });

    } catch (err) {
        err.message = 'Bad Request';
        err.errors = err.errors
        err.status = 400;
        return next(err)

    }
    const findVenue = await Venue.findByPk(venueId);
    if (!findVenue) {
        const err = new Error("Venue couldn't be found");
        err.status = 404;
        return next(err);
    }



    createEvent.groupId = groupId;

    delete createEvent.dataValues.createdAt;
    delete createEvent.dataValues.updatedAt;

    createEvent.dataValues.startDate = changeDate(createEvent.dataValues.startDate);

    createEvent.dataValues.endDate = changeDate(createEvent.dataValues.endDate);

    return res.json(createEvent);

});



//MEMBERSHIP

group.get('/:groupId/members', async (req, res, next) => {
    const { user } = req;
    //Search for Group by ID
    const groupId = parseInt(req.params.groupId);
    const findGroup = await Group.findByPk(groupId);


    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================
    //Find the membership
    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    });

    let findMembers;

    //If it didn't find a membership
    if (!membershipStatus) {
        //And if the user isn't the organizer
        if (findGroup.organizerId !== user.id) {
            findMembers = await Membership.findAll({
                where: {
                    groupId: groupId,
                    status: ['co-host', 'member']
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ],
                attributes: ['status']
            });
        }
        //If the user is the organizer
        else {
            findMembers = await Membership.findAll({
                where: {
                    groupId: groupId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ],
                attributes: ['status']
            });
        }

        //If it found a membership
    } else {
        //Check if the member is the organizer or the co-host
        if (findGroup.organizerId === user.id || membershipStatus.status === 'co-host') {
            findMembers = await Membership.findAll({
                where: {
                    groupId: groupId,
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ],
                attributes: ['status']
            });
        } else {
            findMembers = await Membership.findAll({
                where: {
                    groupId: groupId,
                    status: ['co-host', 'member']
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ],
                attributes: ['status']
            });
        }


    }



    //============================================

    let grabUser = [];

    //Grab the User contents
    findMembers.forEach(member => {
        grabUser.push(member.User);

    });

    // return res.json(findMembers);
    const grabStatus = findMembers.map(member => {
        return {
            ...member.User.toJSON(),
            Membership: { status: member.status }

        }
    })



    return res.json({ Members: grabStatus });

});


group.post('/:groupId/membership', [requireAuth], async (req, res, next) => {
    const { user } = req;
    //Search for Group by ID

    const groupId = parseInt(req.params.groupId);
    const findGroup = await Group.findByPk(groupId);

    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    });

    //Check their membership
    if (membershipStatus) {
        if (membershipStatus.status === 'pending') {
            const err = new Error("Membership has already been requested");
            err.status = 400;
            return next(err);
        }
        else {
            const err = new Error("User is already a member of the group");
            err.status = 404;
            return next(err);
        }
    }

    else {
        if (findGroup.organizerId === user.id) {
            const err = new Error("User is already a member of the group");
            err.status = 404;
            return next(err);
        } else {

            const newMembership = await Membership.create({
                userId: user.id,
                groupId: groupId
            });

            // newMembership.toJSON().userId = newMembership.userId;
            return res.json({ memberId: newMembership.userId, status: newMembership.status });
        }
    }

});


group.put('/:groupId/membership', [requireAuth], async (req, res, next) => {

    const { user } = req;
    //Search for Group by ID
    const groupId = parseInt(req.params.groupId);
    const findGroup = await Group.findByPk(groupId);

    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //====================================

    const { memberId, status } = req.body;

    //Grab the member
    const targetUser = await User.findOne({
        where: {
            id: memberId,

        }
    })

    //If there is no member send error
    if (!targetUser) {
        const err = new Error("User couldn't be found");
        err.status = 404;
        return next(err);

    }

    //Grab the target's membership to this group
    const targetMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    });


    if (!targetMember) {
        const err = new Error("Membership between the user and the group does not exist");
        err.status = 404;
        return next(err);
    }


    ///Grab the current User's credentials
    const membershipStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    });

    //If they have credentials



    if (status === 'co-host') {
        if (findGroup.organizerId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);

        } else {
            try {
                await targetMember.update({
                    status
                });
            } catch (err) {
                err.message = 'Bad Request';
                err.errors = err.errors
                err.status = 400;

                return next(err)
            }
        }

    } else if (status === 'member') {
        if (membershipStatus) {
            if (membershipStatus.status === 'co-host') {
                await targetMember.update({
                    status
                });
            } else {
                const err = new Error("Forbidden");
                err.status = 403;
                return next(err);
            }
        }
        else {
            if (findGroup.organizerId === user.id) {
                await targetMember.update({
                    status
                });
            } else {
                const err = new Error("Forbidden");
                err.status = 403;
                return next(err);
            }

        }

    } else {
        if (status === 'pending') {
            const err = new Error("Bad request");
            err.errors = { status: 'Cannot change a membership status to pending' }
            err.status = 400;
            return next(err);
        } else {
            try {
                await targetMember.update({
                    status
                });
            } catch (err) {
                err.message = 'Bad Request';
                err.errors = err.errors
                err.status = 400;

                return next(err)
            }
        }


    }

    targetMember.dataValues.memberId = targetMember.dataValues.userId

    delete targetMember.dataValues.createdAt;
    delete targetMember.dataValues.updatedAt;
    delete targetMember.dataValues.userId



    return res.json(targetMember)


});

group.delete('/:groupId/membership/:memberId', [requireAuth], async (req, res, next) => {
    const { user } = req;
    //Search for Group by ID
    const groupId = parseInt(req.params.groupId);
    const findGroup = await Group.findByPk(groupId);

    //If a group couldn't be found
    if (!findGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Find the User
    const targetUserId = parseInt(req.params.memberId);
    const targetUser = await User.findByPk(targetUserId);

    //Check if the user exists
    if (!targetUser) {
        const err = new Error("User couldn't be found");
        err.status = 404;
        return next(err);
    }

    //Find the membership of the target
    const findTargetMembership = await Membership.findOne({
        where: {
            userId: targetUserId,
            groupId: groupId
        }
    });

    //Check if the target has a membership to said group
    if (!findTargetMembership) {
        const err = new Error("Membership does not exist for this user");
        err.status = 404;
        return next(err);
    }

    if (user.id === findGroup.organizerId && findTargetMembership.userId === targetUserId) {
        await findTargetMembership.destroy();

    } else {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    return res.json({ message: "Successfully deleted membership from group" })

});



module.exports = group;
