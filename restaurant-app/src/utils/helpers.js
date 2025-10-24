export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Pending': '#FFA500',
    'Cooking': '#FFA500',
    'Served': '#90EE90',
    'Done': '#87CEEB',
    'Processing': '#FFA500',
    'Order Done': '#90EE90',
    'Available': '#90EE90',
    'Reserved': '#87CEEB'
  };
  return colors[status] || '#999';
};

export const getStatusLabel = (status) => {
  const labels = {
    'Pending': 'Pending',
    'Cooking': 'Cooking',
    'Served': 'Served',
    'Done': 'Done'
  };
  return labels[status] || status;
};
