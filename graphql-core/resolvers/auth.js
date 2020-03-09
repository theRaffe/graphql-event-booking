const User = require('../../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }

            const hashedPassword = await bcryptjs.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const resultUser = await user.save();
            return { ...resultUser._doc, _id: resultUser.id, password: null }

        } catch (err) {
            console.error('An error occurred at saving new user', err);
            throw err;
        };
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User doesnt exist');
        }

        const isEqual = await bcryptjs.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Invalid credentials!');
        }

        console.log('validate pass:', isEqual);

        const token = jwt.sign({ userId: user.id, email: user.email }, 'supersecretpassword', {
            expiresIn: '1h'
        });
        console.log('return user:', user);
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}