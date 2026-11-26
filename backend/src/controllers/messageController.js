import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const getUsersForSidebar = async(req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password")

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error("Error in getUserForSidebar: ", error.message)
    res.status(500).json({error: "Internal server error"});
  }
}

export const getMessages = async (req, res) => {
  try {
    // ID of the selected conversation partner
    const { id: userToChatId } = req.params;

    // ID of the authenticated user
    const myId = req.user._id;

    // Retrieve messages exchanged in both directions
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); 

    return res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessages controller:", error.message);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const sendMessage = async(req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newMessage.save()

    // todo: realtime functionality goes here - socket.io

    res.status(201).json(newMessage)

  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}