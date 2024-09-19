// The first test ensures that when the /button command is triggered, two buttons (Ocean and Mountains) are displayed with the correct labels, custom IDs, styles, and emojis.
const buttonsCommand = require('../../../commands/utility/button'); // Adjust the path accordingly
const { ButtonStyle, ActionRowBuilder } = require('discord.js');

describe('Buttons Command', () => {
  let mockInteraction;

  beforeEach(() => {
    mockInteraction = {
      reply: jest.fn().mockResolvedValue({ // Mock the reply function to return a promise
        awaitMessageComponent: jest.fn(), // Mock the collector for button interactions
      }),
    };
  });

  it('should reply with two buttons when the slash command is triggered', async () => {
    await buttonsCommand.execute(mockInteraction);

    // Verify that interaction.reply was called with the correct content and components
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: 'Which is better?',
      components: [expect.any(ActionRowBuilder)],
    });

    // Retrieve the buttons from the first ActionRow
    const actionRow = mockInteraction.reply.mock.calls[0][0].components[0];
    const [oceanButton, mountainsButton] = actionRow.components;

    // Check the "Ocean" button properties
    expect(oceanButton.label).toBe('Ocean');
    expect(oceanButton.customId).toBe('ocean');
    expect(oceanButton.style).toBe(ButtonStyle.Primary);
    expect(oceanButton.emoji.name).toBe('🌊');

    // Check the "Mountains" button properties
    expect(mountainsButton.label).toBe('Mountains');
    expect(mountainsButton.customId).toBe('mountains');
    expect(mountainsButton.style).toBe(ButtonStyle.Success);
    expect(mountainsButton.emoji.name).toBe('⛰️');
  });
});

// Explanation:
// 	•	Mocking interaction.reply: The interaction.reply method is mocked to simulate sending a message in Discord. 
//      We also mock awaitMessageComponent, which is used for handling button interactions later.
// 	•	Checking Buttons: The test inspects the ActionRowBuilder to verify that both buttons have the correct properties, including labels, custom IDs, styles, and emojis.


// This test simulates pressing the buttons and verifies that the correct response is sent when the user clicks on either “Ocean” or “Mountains”.
describe('Button Interaction', () => {
    let mockInteraction, mockConfirmation;
  
    beforeEach(() => {
      mockConfirmation = {
        customId: '',
        update: jest.fn(),
      };
  
      mockInteraction = {
        reply: jest.fn().mockResolvedValue({
          awaitMessageComponent: jest.fn().mockImplementation(({ filter }) => {
            // Simulate interaction response after button click
            if (mockConfirmation.customId === 'ocean' || mockConfirmation.customId === 'mountains') {
              return Promise.resolve(mockConfirmation);
            }
            return Promise.reject(new Error('No interaction received'));
          }),
        }),
        editReply: jest.fn(), // Mock editReply here as well
        user: { id: 'user123' },
      };
    });
  
    it('should reply with "That\'s an amazing choice!" when the "Ocean" button is pressed', async () => {
      mockConfirmation.customId = 'ocean';
  
      await buttonsCommand.execute(mockInteraction);
  
      // Simulate pressing the "Ocean" button
      expect(mockInteraction.reply).toHaveBeenCalled();
  
      // Check the interaction update after pressing the "Ocean" button
      expect(mockConfirmation.update).toHaveBeenCalledWith({
        content: "That's an amazing choice!",
        components: [],
      });
    });
  
    it('should reply with "Fantastic decision!" when the "Mountains" button is pressed', async () => {
      mockConfirmation.customId = 'mountains';
  
      await buttonsCommand.execute(mockInteraction);
  
      // Simulate pressing the "Mountains" button
      expect(mockInteraction.reply).toHaveBeenCalled();
  
      // Check the interaction update after pressing the "Mountains" button
      expect(mockConfirmation.update).toHaveBeenCalledWith({
        content: 'Fantastic decision!',
        components: [],
      });
    });
  
    it('should edit the reply when no interaction is received in time', async () => {
      // Simulate a timeout by rejecting the awaitMessageComponent promise
      mockInteraction.reply.mockResolvedValue({
        awaitMessageComponent: jest.fn().mockRejectedValue(new Error('No interaction received')),
      });
  
      await buttonsCommand.execute(mockInteraction);
  
      // Check that the interaction was edited after the timeout
      expect(mockInteraction.editReply).toHaveBeenCalledWith({
        content: 'Confirmation not received within 1 minute, cancelling',
        components: [],
      });
    });
  });


//   Explanation:
// 	•	Mocking Button Interaction:
// 	•	awaitMessageComponent is mocked to simulate user interactions (button presses). 
//      Depending on the customId, it either resolves (button pressed) or rejects (timeout).
// 	•	We simulate pressing the “Ocean” or “Mountains” button by setting mockConfirmation.customId and checking if the correct message is sent with mockConfirmation.update.
// 	•	Testing Timeout: We also simulate a timeout (no button clicked) by rejecting awaitMessageComponent, and verify that editReply is called with the timeout message.