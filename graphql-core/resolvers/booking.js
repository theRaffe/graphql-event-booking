const { dateToString } = require('../../helpers/utils-date');
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

module.exports = {

    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!!');
        }

        try {
            const bookings = await Booking.find();
            return bookings.map(
                booking => {
                    return transformBooking(booking);
                }
            );
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated!!');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: '5e5c77dcbfa7ea6e6467efcd',
                event: fetchedEvent
            });

            const result = await booking.save(booking);
            return transformBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async (args, req) => {
        try {
            const booking = await Booking.findById(args.bookingId);
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {

        }
    }
}