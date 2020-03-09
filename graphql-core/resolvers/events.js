const Event = require('../../models/event');
const User = require('../../models/user');

const transformEvent = (event) => {
    return {
        ...event._doc,
        fDate: event.fDate,
        _id: event.id
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!!');
        }

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        try {

            const result = await event.save();
            const createdEvent = transformEvent(result);

            const aUser = await User.findById(req.userId);
            if (!aUser) {
                throw new Error('User does not exist');
            }

            aUser.createdEvents.push(event);
            await aUser.save();
            return createdEvent;

        } catch (err) {
            console.error('An error occurred at saving Event', err);
            throw err;
        }
    },

}