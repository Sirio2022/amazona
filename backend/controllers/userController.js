import User from '../models/userModel.js';
import generateId from '../helpers/generarId.js';
import generateJWT from '../helpers/generarJWT.js';
import { registerEmail, forgotPasswordEmail } from '../helpers/email.js';

const topSellers = async (req, res) => {
  const topSellers = await User.find({ isSeller: true })
    .sort({ 'seller.rating': -1 })
    .limit(3);
  res.status(200).json(topSellers);
};

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
    await user.save();

    // Send email
    registerEmail({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res
      .status(200)
      .json({ msg: 'User created. Check your Email to confirm your account.' });
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
      isSeller: user.isSeller,
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User does not exist');
    return res.status(404).json({ msg: error.message });
  } // If user does not exist, return error

  try {
    user.token = generateId();
    await user.save();
    forgotPasswordEmail({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res
      .status(200)
      .json({ msg: 'We have send to you an Email with instructions' });
  } catch (error) {
    console.log(error);
  }
};

const confirmToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });

  if (validToken) {
    res.status(200).json({ msg: 'Token is valid' });
  } else {
    const error = new Error('Token is not valid');
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = '';
    try {
      await user.save();
      res.status(200).json({ msg: 'Password changed' });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error('Token is not valid');
    return res.status(404).json({ msg: error.message });
  }
};

const userDetails = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    if (user.isSeller) {
      user.seller.name = req.body.sellerName || user.seller.name;
      user.seller.logo = req.body.sellerLogo || user.seller.logo;
      user.seller.description =
        req.body.sellerDescription || user.seller.description;
    }
  }
  try {
    await user.save();
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      token: generateJWT(user),
    });
  } catch (error) {
    console.log(error);
  }
};

const userList = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

const userDelete = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        const error = new Error('Admin cannot be deleted');
        return res.status(403).json({ msg: error.message });
      }
      await user.deleteOne();
      res.status(200).json({ msg: 'User deleted', user });
    } else {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }
};

const userUpdate = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.emai || user.email;
    user.isSeller = req.body.isSeller;
    user.isAdmin = req.body.isAdmin;
    try {
      const updatedUser = await user.save();
      res.status(200).json({ msg: 'User updated', updatedUser });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }
};

export {
  userRegister,
  userAuthentication,
  confirmUser,
  forgotPassword,
  confirmToken,
  newPassword,
  userDetails,
  updateUserProfile,
  userList,
  userDelete,
  userUpdate,
  topSellers,
};
