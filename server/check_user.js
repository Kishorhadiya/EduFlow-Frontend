const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();
const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'kishor@gmail.com' });
        if (user) {
            console.log(`ROLE:${user.role}`);
            console.log(`CLASSID:${user.classId || 'NONE'}`);
        } else {
            console.log('NOT_FOUND');
        }
        process.exit();
    } catch (err) {
        process.exit(1);
    }
};
checkUser();
