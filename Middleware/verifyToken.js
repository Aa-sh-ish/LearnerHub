const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided or invalid" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided or invalid" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.isAdmin && !user.isSuperAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Admin privileges required" });

    req.userDetails = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const verifySuperAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided or invalid" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.isSuperAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Super admin privileges required" });

    req.userDetails = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyToken, verifyAdmin, verifySuperAdmin };
