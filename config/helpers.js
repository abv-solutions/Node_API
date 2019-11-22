// Handlebars helper function
const formatDate = date => {
  return date.toLocaleString('en-gb', {
    hour12: false,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

module.exports = formatDate;
