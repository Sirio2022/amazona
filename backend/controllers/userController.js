import User from '../models/userModel.js';
import generateId from '../helpers/generarId.js';
import generateJWT from '../helpers/generarJWT.js';

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
    user.token = generateId();
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error) {
    console.log(error);
  }
};

const userAuthentication = async (req, res) => {
  const { email, password } = req.body;
  // Check if User exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User does not exist');
    return res.status(404).json({ msg: error.message });
  } // If user does not exist, return error

  // Check if user is confirmed
  if (!user.isConfirmed) {
    const error = new Error('User is not confirmed');
    return res.status(403).json({ msg: error.message });
  }

  // Check if password is correct
  if (!(await user.matchPassword(password))) {
    const error = new Error('Invalid password');
    return res.status(401).json({ msg: error.message });
  } // If password is not correct, return error
  else {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateJWT(user),
    });
  }
};

const confirmUser = async (req, res) => {
  const { token } = req.params;

  try {
    const confirmedUser = await User.findOneAndUpdate(
      { token },
      { isConfirmed: true }
    );
    if (!confirmedUser) {
      const error = new Error('Token does not exist');
      return res.status(404).json({ msg: error.message });
    }
    confirmedUser.token = '';
    await confirmedUser.save();
    res.status(200).json({ msg: 'User confirmed' });
  } catch (error) {
    console.log(error);
  }
};

export { userRegister, userAuthentication, confirmUser };
