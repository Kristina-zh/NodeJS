const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./User");
const Joi = require("joi");

async function register(req, res) {
  try {
    const { body } = req;
    const hashedPassword = await bcrypt.hash(body.password, 14);
    const contact = await User.create({
      ...body,
      password: hashedPassword
    });
    res.status(201).json(contact);
  } catch (error) {
    if (error.keyPattern) {
      if (error.keyPattern.email) {
        res.status(409).send("Email in use");
      }
    } else res.status(400).send(error);
  }
}

validateLogin = (req, res, next) => {
  const validationRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send("missing fields");
  }
  next();
};

async function login(req, res) {
  const {
    body: { email, password }
  } = req;

  const user = await User.findOne({
    email
  });

  if (!user) {
    return res.status(401).send("Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send("Email or password is wrong");
  }

  const token = jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_SECRET
  );

  console.log("token :", token);

  await User.findByIdAndUpdate(user._id, { token: token });

  return res.json({ token, user });
}

async function logout(req, res) {
  const { user } = req;

  if (!user) {
    return res.status(401).send("Not authorized");
  }

  await User.findByIdAndUpdate(user._id, {
    token: null
  });

  return res.status(204).send("User logout");
}

async function authorize(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    return res.status(401).send("Not authorized");
  }
  const token = authorizationHeader.replace("Bearer ", "");

  req.token = token;

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    if (!user) {
      return res.status(401).send("Not authorized");
    }

    next();
  } catch (err) {
    return res.status(401).send("Not authorized");
  }
}

async function currentUser(req, res) {
  const user = req.user;
  const { email, subscription } = req.user;

  if (!user) {
    return res.status(401).send("Not authorized");
  }

  return res.json({ email, subscription });
}

module.exports = {
  validateLogin,
  register,
  login,
  logout,
  authorize,
  currentUser
};
