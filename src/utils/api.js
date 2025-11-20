const API_BASE_URL = 'https://152.67.15.78';

export const predictRoute = async (source, destination, timeOfDay) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source, destination, timeOfDay }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting route:', error);
    throw error;
  }
};

