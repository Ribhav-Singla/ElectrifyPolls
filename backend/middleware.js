const Poll = require("./schema.js");

const ipAddress_inserter = async (roomId, ipAddress) => {
  try {
    const pollData = await Poll.findOne({roomId,ipAddress});
    if(!pollData){
        const poll = new Poll({ roomId, ipAddress });
        await poll.save();
    }
  } catch (error) {
    console.log("error occured while inserting the ipAddress: ", error);
  }
};

const ipAddress_checker = async (roomId, ipAddress) => {
  try {
    const vote_details = await Poll.findOne({ roomId, ipAddress });
    if (!vote_details.vote) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error occured while ipAddress_checking: ", error);
    return false;
  }
};

const ipAddress_updater = async (roomId, ipAddress) => {
  try {
    const vote_details = await Poll.findOneAndUpdate(
      {
        roomId,
        ipAddress,
      },
      {
        $set: {
          vote: true,
        },
      }
    );
    await vote_details.save();
  } catch (error) {
    console.log("error occured while ipAddress_updater: ", error);
  }
};

module.exports = { ipAddress_checker, ipAddress_inserter, ipAddress_updater };
