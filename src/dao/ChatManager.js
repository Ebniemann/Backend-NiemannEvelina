export class ManagerChat {
  async mensajes() {
    try {
      return await chatModels.find().lean();
    } catch (error) {
      console.error("Error fetching messages:", error);
      return null;
    }
  }

  async saveMessage(messageData) {
    try {
      const result = await chatModels.create(messageData);
      console.log("Message saved successfully:", result);
    } catch (error) {
      console.error("Error saving message to the database:", error);
    }
  }
}
