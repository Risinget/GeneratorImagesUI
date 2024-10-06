const axios = require("axios");
//  testing
const  getImageUri = async (text) => {
  const url =
    "https://magicloops.dev/api/loop/run/ce21d74d-0ec7-4d9d-a5f5-eec60964aadd";

  try {
    const response = await axios.post(url, {
      input: text,
    });

    console.log("STATUS:", response.status);
    console.log("OUTPUT:", response.data.loopOutput);
    return response.data.loopOutput;
  } catch (error) {
    return false;
  }
};

module.exports = { getImageUri };
