import { chatModel } from '../../Models/messages.model.js';

class MessagesDao {
  async getAllMessages() {
    try {
      const messages = await chatModel.find().sort({ timestamp: 1 });
      return messages;
    } catch (error) {
      throw new Error(`Error getting all messages: ${error.message}`);
    }
  }

  async addMessage(user, message) {
    try {
      const newMessage = new chatModel({ user, message });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw new Error(`Error adding a new message: ${error.message}`);
    }
  }

}

export default new MessagesDao();
