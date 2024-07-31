// dateHelpers.js
const { parse } = require('date-fns');

const convertToISO = (dateString) => {
    // Parse the date string
    const date = parse(dateString, 'MMMM do, yyyy', new Date());
    return date
};

module.exports = { convertToISO };
