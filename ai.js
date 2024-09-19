async function ask(prompt) {
  const fetch = (await import('node-fetch')).default;
  try {
    const response = await fetch('http://localhost:5000/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text(); // Get raw response

    try {
      const data = JSON.parse(text); // Parse JSON safely
      if (data.error) {
        throw new Error(data.error);
      }
      return data.response;
    } catch (jsonError) {
      throw new Error(`Failed to parse JSON: ${jsonError.message}`);
    }
  } catch (error) {
    console.error('Error communicating with Python backend:', error);
    return 'Sorry, something went wrong while processing your request.';
  }
}

module.exports = { ask }
