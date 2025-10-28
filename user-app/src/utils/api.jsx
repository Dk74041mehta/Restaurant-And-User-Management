const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const postOrder = async (orderData) => {
  const resp = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  if (!resp.ok) {
    throw new Error('Failed to place order');
  }
  return resp.json();
};
