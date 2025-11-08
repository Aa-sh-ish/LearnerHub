const User = require('../Models/user')
const CryptoJS = require('crypto-js')
const jwt  = require('jsonwebtoken')


const  createUser= async (req, res) => {
    const user = req.body;

    try {
      // ✅ Properly check if email already exists
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      // ✅ Encrypt password
      const encryptedPassword = CryptoJS.AES.encrypt(
        user.password,
        process.env.SECRET
      ).toString();

      // ✅ Create new user
      const newUser = new User({
        username: user.username,
        email: user.email,
        password: encryptedPassword,
        parentEmail: user.parentEmail,
        dob: user.dob,
        phone: user.phone,
        isSuperAdmin: user.isSuperAdmin || false,
        isAdmin: user.isAdmin || false,
        adminRequest: user.adminRequest || false,
        adminApproved: user.adminApproved || false
      });

      // ✅ Save user
      const savedUser = await newUser.save();

          const { password, ...others } = savedUser._doc;


      // ✅ Generate JWT token
      const token = jwt.sign({ 
        others
              },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      // ✅ Respond with token
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: others
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

 const LoginUser = async (req, res) => {
    try {
      // ✅ Find user by email
      const user = await User.findOne({ email: req.body.email }, { __v: 0, updatedAt: 0, createdAt: 0 });

      if (!user) {
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
      }

      // ✅ Decrypt password
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
      const decrypted = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (decrypted !== req.body.password) {
        return res.status(401).json({ success: false, message: "Wrong Password" });
      }

      // ✅ Generate JWT
        const token = jwt.sign({ 
            id: user._id,
            email: user.email,
            parentEmail: user.parentEmail,
            phone: user.phone,
            parentEmail: user.parentEmail,
            isAdmin: user.isAdmin || false,
            isSuperAdmin: user.isSuperAdmin || false,
            adminRequest: user.adminRequest || false,
            adminApproved: user.adminApproved || false
              },
        process.env.JWT_SECRET,{ expiresIn: '21d' } // token valid for 21 days
      );

      // ✅ Remove password from response
      const { password, ...others } = user._doc;

      // ✅ Respond with user data + token
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: others,
        token
      });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

module.exports = {
  createUser,
  LoginUser
};