const Poll = require("./schema.js");

const ipAddress_inserter = async (roomId, ipAddress) => {
  try {
    const pollData = await Poll.findOne({roomId,ipAddress});
    if(!pollData){
        const poll = new Poll({ roomId, ipAddress , vote:false});
        await poll.save();        
        console.log('poll: ',poll)
    }
  } catch (error) {
    console.log("error occured while inserting the ipAddress: ", error);
  }
};

const ipAddress_checker = async (roomId, ipAddress) => {
  console.log('roomId: ',roomId,"   - ip : ",ipAddress)
  try {
    const vote_details = await Poll.findOne({ roomId, ipAddress });    
    console.log('vote_details: ',vote_details);
    
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
    console.log('upadated_vote_details: ',vote_details);
    
  } catch (error) {
    console.log("error occured while ipAddress_updater: ", error);
  }
};

module.exports = { ipAddress_checker, ipAddress_inserter, ipAddress_updater };
