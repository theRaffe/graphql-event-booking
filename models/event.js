const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const Schema = mongoose.Schema;
const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: { select: ['email'] }
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    });

eventSchema.virtual('fDate').get(function () {
    return new Date(this.date).toISOString();
});


eventSchema.plugin(mongooseLeanVirtuals);
eventSchema.plugin(autopopulate);
module.exports = mongoose.model('Event', eventSchema);