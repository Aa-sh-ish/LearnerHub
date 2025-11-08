const mongoose = require('mongoose');

const User = require('../../Models/user')

const getAdminRequests = async (req, res) => {
  try {
    // Find users where adminRequest is true
    const users = await User.find({ adminRequest: true });

    res.status(200).json({
      success: true,
      message: 'Admin requests fetched successfully',
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const approveAdminRequest = async (req, res) => {
  try {
    const userId = req.params.id;
    const superAdminId = req.user.id; // assuming JWT middleware sets req.user


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "No user found with the requested ID"
      });
    }

    const superAdmin = await User.findById(superAdminId);
    if (!superAdmin || !superAdmin.isSuperAdmin) {
      return res.status(403).json({ success: false, message: " You are Not Authorized for approving admin requests" });
    }

    const user = await User.findById(userId);
    if (!user || !user.adminRequest) {
      return res.status(404).json({ 
        success: false,
         message: "Admin request not found"
         });
    }

    user.isAdmin = true;
    user.adminApproved = true;
    user.adminRequest = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Admin request approved for ${user.username}`,
      data: user
    });
  } catch (err) {
    res.status(500).json({ 
        success: false,
        message: err.message 
    });
  }
};

module.exports = {
  getAdminRequests,
  approveAdminRequest
};
