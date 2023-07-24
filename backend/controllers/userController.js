import User from '../models/userModel.js';

const userRegister = async (req, res) => {
  //Avoiding duplicate emails
  const { email } = req.body;
  const userexist = await User.findOne({ email });
  if (userexist) {
    const error = new Error('User already exists');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error) {
    console.log(error);
  }
};

export { userRegister };
