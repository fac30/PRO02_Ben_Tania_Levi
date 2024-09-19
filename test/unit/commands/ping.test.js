// test/unit/commands/ping.test.js
const pingCommand = require('../../../commands/utility/ping');


describe('Ping Command', () => {
    let mockMessage;
  
    beforeEach(() => {
      // Mock the Discord.js message object
      mockMessage = {
        reply: jest.fn(),  // Mock the reply method
      };
    });
  
    it('should reply with "Pong!" when executed', () => {
      pingCommand.execute(mockMessage);
  
      // Check if message.reply was called with 'Pong!'
      expect(mockMessage.reply).toHaveBeenCalledWith('Pong!');
    });
  });