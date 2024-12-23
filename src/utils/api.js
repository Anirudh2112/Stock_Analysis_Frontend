const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const analyzeStock = async (params) => {
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }

    return response;
  } catch (error) {
    throw error;
  }
};