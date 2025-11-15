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

const manageAdminRequest = async (req, res) => {
  try {
    const userId = req.params.id;
    const superAdminId = req.user.id;
    const { approve } = req.body;

    if (approve === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide 'approve' boolean value (true or false)"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const superAdmin = await User.findById(superAdminId);
    if (!superAdmin || !superAdmin.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action"
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.adminRequest) {
      return res.status(404).json({
        success: false,
        message: "Admin request not found"
      });
    }

    if (approve) {
      // APPROVE
      user.isAdmin = true;
      user.adminApproved = true;
      user.adminRequest = false;

      await user.save();

      return res.status(200).json({
        success: true,
        message: `Admin request approved for ${user.username}`,
        data: user
      });
    } else {
      // REJECT
      user.isAdmin = false;
      user.adminApproved = false;
      user.adminRequest = false;

      await user.save();

      return res.status(200).json({
        success: true,
        message: `Admin request rejected for ${user.username}`,
        data: user
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


module.exports = {
  getAdminRequests,
  manageAdminRequest
};
