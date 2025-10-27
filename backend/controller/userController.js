import uploadImage from '../config/cloudinary.js'
import upload from '../middleware/multer.js'
import User from '../models/userModel.js'

export const getCurrentUser = async (req, res) => {
      try {
            const user = await User.findById(req.userId).select("-password")

            if (!user) {
                  return res.status(404).json({ message: 'User Not Found !! ' })
            }
            return res.status(200).send(user)
      }
      catch (error) {
            console.error("getCurrent User Error:", error);
            return res.status(500).json({ message: "Server Error", error: error.message });
      }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User Not Found !!' });

    // 🟢 Update basic fields
    if (name) user.name = name;
    if (description !== undefined) user.description = description;

    // 🟢 Handle photo cases carefully
    if (req.file) {
      // ✅ New photo uploaded
      const uploadedUrl = await uploadImage(req.file.path);
      user.photoUrl = uploadedUrl;
    } else if (req.body.photoUrl === '') {
      // ✅ User requested to remove photo
      user.photoUrl = '';
    } else {
      // ✅ Keep previous photo as is (no change)
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error("update profile Error:", error);
    return res.status(500).json({ message: "update profile Error", error: error.message });
  }
};


export const removePhoto = async (req, res) => {
      try {

            let userId = req.userId

            const user = await User.findById(userId)
            if (!user) {
                  return res.status(404).json({ message: 'User Not Found' })
            }

            user.photoUrl = ''
            console.log('Photo removed', user)
            return res.status(200).json({ message: 'Photo removed', user })

      }
      catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Error removing photo', error: error.message })
      }
}