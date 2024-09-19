async function ask(prompt) {
  const fetch = (await import('node-fetch')).default;
  try {
    const response = await fetch('http://localhost:5000/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),  
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error); 
    }

    return data.response;  
  } catch (error) {
    console.error('Error communicating with Python backend:', error);
    return 'Sorry, something went wrong while processing your request.';
  }
}

module.exports = { ask };
