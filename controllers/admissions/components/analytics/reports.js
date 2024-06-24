const util = require("../../../../helpers/util");
const sqlHelper = require("../../../../helpers/sql");

// MODELS //
const analytics = require("../../../../models/admission/analyticsModel.js");
// MODELS //

const getUndergraduatesMasterlist = async function (payload) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const semester = payload.value;
      const analyticsName = payload.analyticsName;
      const conditions = `and accepted = 1  and currentChoice = 1  and a.college not in ('G', 'M') and sem = ?`;
      const analyticsValue = await analytics[analyticsName](
        conditions,
        [semester],
        {
          order: "course_desc, name, undergradGWA",
          top: "",
        },
        txn,
      );
      return analyticsValue;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });
  if (returnValue.error !== undefined) {
    return returnValue.error;
  }
  return returnValue;
};

module.exports = {
  getUndergraduatesMasterlist,
};
