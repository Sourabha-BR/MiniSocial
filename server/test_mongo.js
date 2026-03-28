const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./routes/../models/User'); // require valid path
const dotenv = require('dotenv');
dotenv.config();

(async () => {
  try {
    console.log('Connecting to', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');
    
    console.log('Finding user...');
    let user = await User.findOne({ email: 'testdiag@test.com' });
    console.log('Found:', user);

    user = new User({
      username: 'testdiag',
      email: 'testdiag@test.com',
      password: 'test'
    });

    console.log('Hashing...');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('test', salt);
    console.log('Hashed.');

    console.log('Saving...');
    await user.save();
    console.log('Saved successfully!');

    process.exit(0);
  } catch (err) {
    console.error('DIAGNOSTIC ERROR:', err);
    process.exit(1);
  }
})();
