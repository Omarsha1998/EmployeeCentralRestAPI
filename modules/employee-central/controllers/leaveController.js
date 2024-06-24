const Leave = require("../models/leaveModel.js");
const sqlHelper = require("../../../helpers/sql.js");
const util = require("../../../helpers/util.js");
const utility = require("../utility/helperMethods.js");

// const createLeaveRequest = async (req, res) => {
//   try {
//     const { LeaveType, Days, TimeFrom, TimeTo, DateFrom, DateTo, Reason } = req.body;
//     const employeeID = req.user.employee_id;
//     const currentDate = new Date().getFullYear();

//     const sqlWhereStrArr3 = ["Code = ?", "l.leaveType = ?"];
//     const args3 = [employeeID, LeaveType];
//     const sqlWhereStrArr2 = ["IDCode = ?", "LeaveType = ?", "status IN (?, ?)"];
//     const args2 = [employeeID, LeaveType, "Pending", "PendingLevel2"];

//     console.log(req.body)

//     let  = await Leave.getSchedule(employeeID)

//     if(getSchedule.length === 0 || getSchedule === null) {
//       getSchedule = [{schedId: 1, timeFrom: '8:00 AM', timeTo: '05:00 PM'}]
//     }

//     const formattedResult = getSchedule.map(item => ({
//       schedId: item.schedId,
//       timeFrom: item.timeFrom.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
//       timeTo: item.timeTo.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
//     }));

//     if(LeaveType === 'SL' || LeaveType === 'VL' || LeaveType === 'BL' ||
//       LeaveType === 'EL' || LeaveType === 'MC' || LeaveType === 'ML' ||
//       LeaveType === 'OL' || LeaveType === 'PARENTL' || LeaveType === 'UL')
//       {
//       const totalValue = await Leave.calculateTotalLeaveValue(
//         sqlWhereStrArr3,
//         args3,
//         sqlWhereStrArr2,
//         args2,

//       );

//       if (Days > totalValue) {
//         return res
//           .status(400)
//           .json({ error: "Insufficient balance for LeaveType" });
//       }
//     }

//     const leaveIdLedger = await sqlHelper.transact(async (txn) => {
//       return await Leave.generateLeaveId(txn);
//     });

//     const success = await sqlHelper.transact(async (txn) => {
//       if(LeaveType === 'LWOP') {
//         return await Leave.createLeaveRequest(
//           {
//             IDCode: employeeID,
//             DateLeavedFrom: DateFrom,
//             DateLeavedTo: DateTo,
//             TIME_FROM: TimeFrom,
//             TIME_TO: TimeTo,
//             Remarks: Reason,
//             reasonForLeave: Reason,
//             LeaveType: LeaveType,
//             daysOfLeave: Days,
//             LeaveWOPay: Days,
//             itemType: `FILED-${LeaveType}-${currentDate}`,
//             status: 'Pending',
//             leaveId: leaveIdLedger,
//             EarnedDays: 0,
//             EarnedHours: 0,
//             Year: currentDate
//           },
//           txn,
//           "TransDate"
//         );
//       }

//       return await Leave.createLeaveRequest(
//         {
//           IDCode: employeeID,
//           DateLeavedFrom: DateFrom,
//           DateLeavedTo: DateTo,
//           TIME_FROM: TimeFrom,
//           TIME_TO: TimeTo,
//           Remarks: Reason,
//           LeaveType: LeaveType,
//           reasonForLeave: Reason,
//           daysOfLeave: Days,
//           itemType: `FILED-${LeaveType}-${currentDate}`,
//           status: 'Pending',
//           leaveId: leaveIdLedger,
//           EarnedDays: 0,
//           EarnedHours: 0,
//           Year: currentDate
//         },
//         txn,
//         "TransDate"
//       );
//     });
//     if (success) {
//       return res
//         .status(201)
//         .json({ body: "Leave request created successfully", success: true });
//     } else {
//       return res.status(500).json({ error: "Failed to insert leave request" });
//     }

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to insert leave request" });
//   }
// };

const createLeaveRequest = async (req, res) => {
  try {
    const { LeaveType, Days, TimeFrom, TimeTo, DateFrom, DateTo, Reason } =
      req.body;
    const employeeID = req.user.employee_id;
    const currentDateYear = new Date().getFullYear();
    const currentDate = new Date();
    const result = [];

    const sqlWhereStrArr3 = ["Code = ?", "l.leaveType = ?"];
    const args3 = [employeeID, LeaveType];
    const sqlWhereStrArr2 = ["IDCode = ?", "LeaveType = ?", "status IN (?, ?)"];
    const args2 = [employeeID, LeaveType, "Pending", "PendingLevel2"];

    const checkDateOfLeaveOverlap = await Leave.checkDateOfLeaveOverlap(
      employeeID,
      DateFrom,
      DateTo,
    );

    if (checkDateOfLeaveOverlap.length !== 0) {
      return res.status(400).json({
        error: "You have a leave with the given from date and to date.",
      });
    }

    const getSchedule = await Leave.getSchedule(employeeID, DateFrom, DateTo);
    let mappedSchedule = [];

    if (getSchedule.length === 0 || getSchedule === null) {
      const timeFrom = "08:00:00.0000000";
      const timeTo = "17:00:00.0000000";
      mappedSchedule = [
        {
          schedId: "DTR",
          timeFrom: new Date(`1970-01-01T${timeFrom}Z`),
          timeTo: new Date(`1970-01-01T${timeTo}Z`),
        },
      ];
    } else {
      mappedSchedule = getSchedule.map((schedule) => {
        let timeFrom = null;
        let timeTo = null;
        if (!schedule.schedFrom && !schedule.schedTo) {
          const timeFrom1 = "08:00:00.0000000";
          const timeTo1 = "17:00:00.0000000";
          timeFrom = new Date(`1970-01-01T${timeFrom1}`);
          timeTo = new Date(`1970-01-01T${timeTo1}`);
        } else {
          timeFrom = new Date(schedule.schedFrom);
          timeTo = new Date(schedule.schedTo);
        }

        timeFrom.setUTCHours(timeFrom.getUTCHours() + 8);
        timeTo.setUTCHours(timeTo.getUTCHours() + 8);
        return {
          schedId: "DTR",
          timeFrom: timeFrom.toISOString(),
          timeTo: timeTo.toISOString(),
        };
      });
    }

    const formattedResult = mappedSchedule.map((item) => ({
      schedId: item.schedId,
      timeFrom: new Date(item.timeFrom).toLocaleString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
      timeTo: new Date(item.timeTo).toLocaleString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
    }));

    if (
      LeaveType === "SL" ||
      LeaveType === "VL" ||
      LeaveType === "BL" ||
      LeaveType === "EL" ||
      LeaveType === "MC" ||
      LeaveType === "ML" ||
      LeaveType === "OL" ||
      LeaveType === "PARENTL" ||
      LeaveType === "UL" ||
      LeaveType === "VWC"
    ) {
      const totalValue = await Leave.calculateTotalLeaveValue(
        sqlWhereStrArr3,
        args3,
        sqlWhereStrArr2,
        args2,
      );

      if (Days > totalValue) {
        return res
          .status(400)
          .json({ error: "Insufficient balance for LeaveType" });
      }
    }

    const integerDays = Math.floor(Days);
    const fractionalDays = Days % 1;
    let verifyLevel1 = false;
    let verifyLevel2 = false;
    let verifyLevel1and2 = false;
    const resultLevel = await Leave.verifyLevelCreateLeave(employeeID);

    resultLevel.map((row) => {
      row.iDCode = employeeID;
    });

    const resultOneAndTwo = filterRequestDetailsCreate(resultLevel);

    if (resultOneAndTwo.length === 0) {
      verifyLevel1 = true;
      verifyLevel2 = true;
    } else {
      for (const row of resultOneAndTwo) {
        if (row.lvl !== null || row.lvl !== undefined || row.lvl.length !== 0) {
          if (row.lvl === 1) {
            verifyLevel1 = true;
          } else if (row.lvl === 2) {
            verifyLevel2 = true;
          }
        }
      }
    }

    if (verifyLevel1 && verifyLevel2) {
      verifyLevel1and2 = true;
      verifyLevel1 = false;
      verifyLevel2 = false;
    }

    if (verifyLevel2 === true) {
      if (integerDays > 0) {
        const success = await sqlHelper.transact(async (txn) => {
          const leaveIdLedger = await Leave.generateLeaveId(txn);
          const adjustedDateFrom = new Date(`${DateFrom} GMT`);
          const adjustedDateTo = new Date(`${DateFrom} GMT`);
          adjustedDateTo.setDate(adjustedDateTo.getDate() + integerDays - 1);

          if (LeaveType === "LWOP") {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: formattedResult[0].timeFrom,
                TIME_TO: formattedResult[0].timeTo,
                Remarks: Reason,
                reasonForLeave: Reason,
                LeaveType: LeaveType,
                daysOfLeave: integerDays,
                LeaveWOPay: integerDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "PendingLevel2",
                leaveId: leaveIdLedger,
                EarnedDays: 0,
                EarnedHours: 0,
                approvedByLevel1: "0000",
                approvedByLevel1DateTime: currentDate,
              },
              txn,
              "TransDate",
            );
          } else {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: formattedResult[0].timeFrom, // Use timeFrom from formattedResult
                TIME_TO: formattedResult[0].timeTo, // Use timeTo from formattedResult
                Remarks: Reason,
                LeaveType: LeaveType,
                reasonForLeave: Reason,
                daysOfLeave: integerDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "PendingLevel2",
                leaveId: leaveIdLedger, // Use the generated leaveIdLedger
                EarnedDays: 0,
                EarnedHours: 0,
                approvedByLevel1: "0000",
                approvedByLevel1DateTime: currentDate,
              },
              txn,
              "TransDate",
            );
          }
        });

        if (!success) {
          return res
            .status(500)
            .json({ error: "Failed to insert leave request" });
        }
      }

      // Create leave request for fractional day if any
      if (fractionalDays > 0) {
        const success = await sqlHelper.transact(async (txn) => {
          const leaveIdLedger = await Leave.generateLeaveId(txn);
          const adjustedDateFrom = new Date(`${DateTo} GMT`);
          const adjustedDateTo = new Date(`${DateTo} GMT`);

          if (LeaveType === "LWOP") {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: TimeFrom,
                TIME_TO: TimeTo,
                Remarks: Reason,
                reasonForLeave: Reason,
                LeaveType: LeaveType,
                daysOfLeave: fractionalDays,
                LeaveWOPay: fractionalDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "PendingLevel2",
                leaveId: leaveIdLedger,
                EarnedDays: 0,
                EarnedHours: 0,
                approvedByLevel1: "0000",
                approvedByLevel1DateTime: currentDate,
              },
              txn,
              "TransDate",
            );
          } else {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: TimeFrom,
                TIME_TO: TimeTo,
                Remarks: Reason,
                LeaveType: LeaveType,
                reasonForLeave: Reason,
                daysOfLeave: fractionalDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "PendingLevel2",
                leaveId: leaveIdLedger,
                EarnedDays: 0,
                EarnedHours: 0,
                approvedByLevel1: "0000",
                approvedByLevel1DateTime: currentDate,
              },
              txn,
              "TransDate",
            );
          }
        });

        if (!success) {
          return res
            .status(500)
            .json({ error: "Failed to insert leave request" });
        }
      }
    }

    // Create leave request for whole days
    else {
      if (integerDays > 0) {
        const success = await sqlHelper.transact(async (txn) => {
          const leaveIdLedger = await Leave.generateLeaveId(txn);
          const adjustedDateFrom = new Date(`${DateFrom} GMT`);
          const adjustedDateTo = new Date(`${DateFrom} GMT`);
          adjustedDateTo.setDate(adjustedDateTo.getDate() + integerDays - 1);

          if (LeaveType === "LWOP") {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: formattedResult[0].timeFrom, // Use timeFrom from formattedResult
                TIME_TO: formattedResult[0].timeTo, // Use timeTo from formattedResult
                Remarks: Reason,
                reasonForLeave: Reason,
                LeaveType: LeaveType,
                daysOfLeave: integerDays,
                LeaveWOPay: integerDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "Pending",
                leaveId: leaveIdLedger,
                EarnedDays: 0,
                EarnedHours: 0,
              },
              txn,
              "TransDate",
            );
          } else {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: formattedResult[0].timeFrom, // Use timeFrom from formattedResult
                TIME_TO: formattedResult[0].timeTo, // Use timeTo from formattedResult
                Remarks: Reason,
                LeaveType: LeaveType,
                reasonForLeave: Reason,
                daysOfLeave: integerDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "Pending",
                leaveId: leaveIdLedger, // Use the generated leaveIdLedger
                EarnedDays: 0,
                EarnedHours: 0,
              },
              txn,
              "TransDate",
            );
          }
        });

        if (!success) {
          return res
            .status(500)
            .json({ error: "Failed to insert leave request" });
        }
      }

      // Create leave request for fractional day if any
      if (fractionalDays > 0) {
        const success = await sqlHelper.transact(async (txn) => {
          const leaveIdLedger = await Leave.generateLeaveId(txn);
          const adjustedDateFrom = new Date(`${DateTo} GMT`);
          const adjustedDateTo = new Date(`${DateTo} GMT`);

          if (LeaveType === "LWOP") {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: TimeFrom,
                TIME_TO: TimeTo,
                Remarks: Reason,
                reasonForLeave: Reason,
                LeaveType: LeaveType,
                daysOfLeave: fractionalDays,
                LeaveWOPay: fractionalDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "Pending",
                leaveId: leaveIdLedger,
                EarnedDays: 0,
                EarnedHours: 0,
              },
              txn,
              "TransDate",
            );
          } else {
            return await Leave.createLeaveRequest(
              {
                IDCode: employeeID,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                TIME_FROM: TimeFrom,
                TIME_TO: TimeTo,
                Remarks: Reason,
                LeaveType: LeaveType,
                reasonForLeave: Reason,
                daysOfLeave: fractionalDays,
                itemType: `FILED-${LeaveType}-${currentDateYear}`,
                status: "Pending",
                leaveId: leaveIdLedger,
                EarnedDays: 0,
                EarnedHours: 0,
              },
              txn,
              "TransDate",
            );
          }
        });

        if (!success) {
          return res
            .status(500)
            .json({ error: "Failed to insert leave request" });
        }
      }
    }

    return res
      .status(201)
      .json({ body: "Leave request(s) created successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to insert leave request" });
  }
};

const updateLeaveAction = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const leaveIds = req.body.LeaveID; // Assuming leaveIds is an array of leaveId values
    const Status = req.body.Status;
    const reason = req.body.reason;
    const currentDate = new Date();
    const employeeID = req.user.employee_id;

    const arrayOfMessages = [];

    for (const leaveId of leaveIds) {
      const checkLevelStatusQuery = await Leave.checkLevelStatus(leaveId);
      const checkLevelStatus = filterRequestDetailsCreate(
        checkLevelStatusQuery,
      );
      const verifyLevel = await Leave.verifyLevel(employeeId);
      if (checkLevelStatus.length > 0) {
        const checkStatus = checkLevelStatus[0];
        if (
          checkStatus.approvedByLevel1 === null &&
          checkStatus.approvedByLevel2 === null
        ) {
          if (
            !verifyLevel.some(
              (level) =>
                level.lvl === 1 && level.deptCode === checkStatus.deptCode,
            )
          ) {
            return res.status(405).json({
              error:
                "You are not authorized to approve or reject leave requests",
            });
          }

          const rowsAffected = await sqlHelper.transact(async (txn) => {
            if (Status === "Approved") {
              const resultsArray = [];

              if (!checkLevelStatus.some((level) => level.lvl === 2)) {
                const leaveDetails = await Leave.getLeaveIdDetails(
                  leaveId,
                  txn,
                );

                const currentYear = new Date().getFullYear();
                const leaveIdDays = leaveDetails[0].daysOfLeave;
                const leaveIdLeaveType = leaveDetails[0].leaveType;
                const leaveIdCode = leaveDetails[0].iDCode;
                const leaveIdYear = leaveDetails[0].year || currentYear;
                let checkYearAttributed = [
                  { year: `${leaveIdYear}`, daysOfLeave: leaveIdDays },
                ];

                if (leaveIdLeaveType !== "LWOP") {
                  checkYearAttributed = await Leave.getAttributedYear(
                    leaveIdCode,
                    leaveIdLeaveType,
                    leaveIdDays,
                    txn,
                  );
                }

                checkYearAttributed.sort((a, b) => a.year - b.year);

                for (const year of checkYearAttributed) {
                  const yearAttributed = year.year;
                  const daysOfLeave = year.daysOfLeave;

                  const codeReq = leaveDetails[0].iDCode;
                  const leaveTypeReq = leaveDetails[0].leaveType;
                  const itemType = leaveDetails[0].itemType;
                  const yearEffectivity = leaveDetails[0].effectiveYear;
                  const remarks = leaveDetails[0].remarks;
                  const referenceNo = leaveDetails[0].leaveId;

                  const insertLeaveLedger = await Leave.insertLeaveLedger(
                    {
                      Code: codeReq,
                      Remarks: remarks,
                      LeaveType: leaveTypeReq,
                      ITEMTYPE: itemType,
                      ReferenceNo: referenceNo,
                      YearEffectivity: yearEffectivity,
                      yearAttributed: yearAttributed,
                      Credit: daysOfLeave,
                    },
                    txn,
                    "TransDate",
                  );

                  const leaveLedgerId = insertLeaveLedger.recNo;
                  const leaveLedgerLeaveId = insertLeaveLedger.referenceNo;
                  const leaveLedgerUsedLeave = insertLeaveLedger.credit;
                  const leaveLedgerYearAttributed =
                    insertLeaveLedger.yearAttributed;

                  const updateVacationSickLeave = await Leave.updateLegerIdVSL(
                    {
                      status: "Approved",
                      approvedByLevel1: employeeID,
                      approvedByLevel1DateTime: currentDate,
                      UserID: employeeID,
                      "[HEAD APPROVED]": 1,
                      "[HEAD APPROVE BY]": employeeID,
                      "[HEAD APPROVE DATE]": currentDate,
                      approvedByLevel2: employeeID,
                      ledgerId: leaveLedgerId,
                      USED_LEAVE: leaveLedgerUsedLeave,
                      Year: leaveLedgerYearAttributed,
                      hrReceived: 1,
                      hrReceiveDate: currentDate,
                    },
                    { leaveId: leaveLedgerLeaveId },
                    txn,
                    "approvedByLevel2DateTime",
                  );
                  resultsArray.push(updateVacationSickLeave);
                }
                return resultsArray;
              } else {
                return await Leave.updateLeaveAction(
                  {
                    status: "PendingLevel2",
                    approvedByLevel1: employeeID,
                    UserID: employeeID,
                    "[HEAD APPROVED]": 1,
                    "[HEAD APPROVE BY]": employeeID,
                    "[HEAD APPROVE DATE]": currentDate,
                  },
                  { leaveId: leaveId },
                  txn,
                  "approvedByLevel1DateTime",
                );
              }
            }

            return await Leave.updateLeaveAction(
              {
                status: "RejectedByLevel1",
                rejectedByLevel1: employeeID,
                UserID: employeeID,
                reasonForRejection: reason,
                hrReceived: 1,
                hrReceiveDate: currentDate,
              },
              { leaveId: leaveId },
              txn,
              "rejectedByLevel1DateTime",
            );
          });

          if (rowsAffected.error) {
            arrayOfMessages.push(
              `Leave request ${Status} failed for LeaveID: ${leaveId}`,
            );
          } else {
            arrayOfMessages.push(
              `Leave request ${Status}d successfully for LeaveID: ${leaveId}`,
            );
          }
        }

        if (
          checkStatus.approvedByLevel1 !== null &&
          checkStatus.status === "PendingLevel2" &&
          checkStatus.approvedByLevel2 === null
        ) {
          if (
            !verifyLevel.some(
              (level) =>
                level.lvl === 2 && level.deptCode === checkStatus.deptCode,
            )
          ) {
            return res.status(405).json({
              error:
                "You are not authorized to approve or reject leave requests",
            });
          }

          const rowsAffected = await sqlHelper.transact(async (txn) => {
            if (Status === "Approved") {
              const resultsArray = [];
              const leaveDetails = await Leave.getLeaveIdDetails(leaveId, txn);
              const currentYear = new Date().getFullYear();
              const leaveIdDays = leaveDetails[0].daysOfLeave;
              const leaveIdLeaveType = leaveDetails[0].leaveType;
              const leaveIdCode = leaveDetails[0].iDCode;
              const leaveIdYear = leaveDetails[0].year || currentYear;
              let checkYearAttributed = [
                { year: `${leaveIdYear}`, daysOfLeave: leaveIdDays },
              ];

              if (leaveIdLeaveType !== "LWOP") {
                checkYearAttributed = await Leave.getAttributedYear(
                  leaveIdCode,
                  leaveIdLeaveType,
                  leaveIdDays,
                  txn,
                );
              }

              checkYearAttributed.sort((a, b) => a.year - b.year);

              if (
                !checkLevelStatus.some((level) => level.lvl === 1) &&
                checkStatus.approvedByLevel1 === 0
              ) {
                for (const year of checkYearAttributed) {
                  const yearAttributed = year.year;
                  const daysOfLeave = year.daysOfLeave;

                  const codeReq = leaveDetails[0].iDCode;
                  const leaveTypeReq = leaveDetails[0].leaveType;
                  const itemType = leaveDetails[0].itemType;
                  const yearEffectivity = leaveDetails[0].effectiveYear;
                  const remarks = leaveDetails[0].remarks;
                  const referenceNo = leaveDetails[0].leaveId;

                  const insertLeaveLedger = await Leave.insertLeaveLedger(
                    {
                      Code: codeReq,
                      Remarks: remarks,
                      LeaveType: leaveTypeReq,
                      ITEMTYPE: itemType,
                      ReferenceNo: referenceNo,
                      YearEffectivity: yearEffectivity,
                      yearAttributed: yearAttributed,
                      Credit: daysOfLeave,
                    },
                    txn,
                    "TransDate",
                  );

                  const leaveLedgerId = insertLeaveLedger.recNo;
                  const leaveLedgerLeaveId = insertLeaveLedger.referenceNo;
                  const leaveLedgerUsedLeave = insertLeaveLedger.credit;
                  const leaveLedgerYearAttributed =
                    insertLeaveLedger.yearAttributed;

                  const updateVacationSickLeave = await Leave.updateLegerIdVSL(
                    {
                      status: "Approved",
                      approvedByLevel1: employeeID,
                      approvedByLevel1DateTime: currentDate,
                      UserID: employeeID,
                      "[HEAD APPROVED]": 1,
                      "[HEAD APPROVE BY]": employeeID,
                      "[HEAD APPROVE DATE]": currentDate,
                      approvedByLevel2: employeeID,
                      ledgerId: leaveLedgerId,
                      USED_LEAVE: leaveLedgerUsedLeave,
                      Year: leaveLedgerYearAttributed,
                      hrReceived: 1,
                      hrReceiveDate: currentDate,
                    },
                    { leaveId: leaveLedgerLeaveId },
                    txn,
                    "approvedByLevel2DateTime",
                  );

                  resultsArray.push(updateVacationSickLeave);
                }
                return resultsArray;
              } else {
                const resultsArray = [];
                const leaveDetails = await Leave.getLeaveIdDetails(
                  leaveId,
                  txn,
                );
                const currentYear = new Date().getFullYear();
                const leaveIdDays = leaveDetails[0].daysOfLeave;
                const leaveIdLeaveType = leaveDetails[0].leaveType;
                const leaveIdCode = leaveDetails[0].iDCode;
                const leaveIdYear = leaveDetails[0].year || currentYear;

                // let checkYearAttributed = await Leave.getAttributedYear(
                //   leaveIdCode,
                //   leaveIdLeaveType,
                //   leaveIdDays,
                //   txn
                // );
                let checkYearAttributed = [
                  { year: `${leaveIdYear}`, daysOfLeave: leaveIdDays },
                ];

                if (leaveIdLeaveType !== "LWOP") {
                  checkYearAttributed = await Leave.getAttributedYear(
                    leaveIdCode,
                    leaveIdLeaveType,
                    leaveIdDays,
                    txn,
                  );
                }

                checkYearAttributed.sort((a, b) => a.year - b.year);

                for (const year of checkYearAttributed) {
                  const yearAttributed = year.year;
                  const daysOfLeave = year.daysOfLeave;

                  const codeReq = leaveDetails[0].iDCode;
                  const leaveTypeReq = leaveDetails[0].leaveType;
                  const itemType = leaveDetails[0].itemType;
                  const yearEffectivity = leaveDetails[0].effectiveYear;
                  const remarks = leaveDetails[0].remarks;
                  const referenceNo = leaveDetails[0].leaveId;

                  const insertLeaveLedger = await Leave.insertLeaveLedger(
                    {
                      Code: codeReq,
                      Remarks: remarks,
                      LeaveType: leaveTypeReq,
                      ITEMTYPE: itemType,
                      ReferenceNo: referenceNo,
                      YearEffectivity: yearEffectivity,
                      yearAttributed: yearAttributed,
                      Credit: daysOfLeave,
                    },
                    txn,
                    "TransDate",
                  );

                  const leaveLedgerId = insertLeaveLedger.recNo;
                  const leaveLedgerLeaveId = insertLeaveLedger.referenceNo;
                  const leaveLedgerUsedLeave = insertLeaveLedger.credit;
                  const leaveLedgerYearAttributed =
                    insertLeaveLedger.yearAttributed;

                  const updateVacationSickLeave = await Leave.updateLegerIdVSL(
                    {
                      status: "Approved",
                      UserID: employeeID,
                      approvedByLevel2: employeeID,
                      ledgerId: leaveLedgerId,
                      USED_LEAVE: leaveLedgerUsedLeave,
                      Year: leaveLedgerYearAttributed,
                      hrReceived: 1,
                      hrReceiveDate: currentDate,
                    },
                    { leaveId: leaveLedgerLeaveId },
                    txn,
                    "approvedByLevel2DateTime",
                  );
                  resultsArray.push(updateVacationSickLeave);
                }
              }
            } else {
              if (
                !checkLevelStatus.some((level) => level.lvl === 1) &&
                checkStatus.approvedByLevel1 === 0
              ) {
                return await Leave.updateLeaveAction(
                  {
                    status: "RejectedByLevel2",
                    rejectedByLevel1: employeeID,
                    rejectedByLevel1DateTime: currentDate,
                    rejectedByLevel2: employeeID,
                    UserID: employeeID,
                    reasonForRejection: reason,
                  },
                  { leaveId: leaveId },
                  txn,
                  "rejectedByLevel2DateTime",
                );
              } else {
                return await Leave.updateLeaveAction(
                  {
                    status: "RejectedByLevel2",
                    rejectedByLevel2: employeeID,
                    UserID: employeeID,
                    reasonForRejection: reason,
                  },
                  { leaveId: leaveId },
                  txn,
                  "rejectedByLevel2DateTime",
                );
              }
            }
          });

          if (rowsAffected && rowsAffected.error) {
            arrayOfMessages.push(
              `Leave request ${Status} failed for LeaveID: ${leaveId}`,
            );
          } else {
            arrayOfMessages.push(
              `Leave request ${Status}d successfully for LeaveID: ${leaveId}`,
            );
          }
        } else {
          arrayOfMessages.push(`No records found for LeaveID: ${leaveId}`);
        }
      } else {
        arrayOfMessages.push(`No records found for LeaveID: ${leaveId}`);
      }
    }

    // After processing all leaveIds, send the accumulated responses
    return res.status(200).json({ messages: arrayOfMessages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update leave request" });
  }
};

// const updateLeaveAction = async (req, res) => {
//   try {

//     const leaveId = req.body.LeaveID;
//     const Status = req.body.Status;
//     const reason = req.body.reason
//     const currentDate = new Date();

//     const employeeID = req.user.employee_id;

//     const sqlWhereStrArr = ["leaveId = ?"]
//     const args = [leaveId]

//     const checkLevelStatus = await Leave.CheckLevelStatus(sqlWhereStrArr, args);
//     console.log(checkLevelStatus)

//     if (checkLevelStatus[0].approvedByLevel1 === null && checkLevelStatus[0].approvedByLevel2 === null) {
//       const rowsAffected = await sqlHelper.transact(async (txn) => {
//         if (Status === 'Approved') {
//           return await Leave.updateLeaveAction
//           (
//             {
//               status: 'PendingLevel2',
//               approvedByLevel1: employeeID,
//               UserID: employeeID,
//               '[HEAD APPROVED]': 1,
//               '[HEAD APPROVE BY]': employeeID,
//               '[HEAD APPROVE DATE]': currentDate,
//             },
//             { leaveId: leaveId },
//             txn,
//             "approvedByLevel1DateTime",
//           );
//         }
//       if (Status === 'Rejected') {

//         return await Leave.updateLeaveAction
//         (
//           {
//             status: 'RejectedByLevel1',
//             rejectedByLevel1: employeeID,
//             UserID: employeeID,
//             reasonForRejection: reason
//           },
//           { leaveId: leaveId },
//           txn,
//           "rejectedByLevel1DateTime"
//         );
//       }
//       });

//       if (rowsAffected.error) {
//         return res.status(404).json({ error: "Leave request not found" });
//       }

//       return res.status(200).json({ message: `Leave request ${Status}d successfully` });
//     }

//     if (checkLevelStatus[0].approvedByLevel1 !== null && checkLevelStatus[0].status === 'PendingLevel2' && checkLevelStatus[0].approvedByLevel2 === null) {
//       const rowsAffected = await sqlHelper.transact(async (txn) => {
//         if (Status === 'Approved') {
//           const updateVSL = await Leave.updateLeaveAction
//           (
//             {
//               status: 'Approved',
//               approvedByLevel2: employeeID,
//               UserID: employeeID
//             },
//             { leaveId: leaveId },
//             txn,
//             "approvedByLevel2DateTime"
//           );

//           const sqlWhereStrArr = ['leaveId = ?']
//           const args = [leaveId]
//           const getLeaveInfo = await Leave.getInfoAction(sqlWhereStrArr, args, txn)

//           const codeReq = getLeaveInfo[0].iDCode;
//           const leaveTypeReq = getLeaveInfo[0].leaveType;
//           const itemType = getLeaveInfo[0].itemType;
//           const yearEffectivity = getLeaveInfo[0].effectiveYear;
//           const remarks = getLeaveInfo[0].remarks;
//           const referenceNo = getLeaveInfo[0].leaveId;
//           const creditReq = getLeaveInfo[0].uSED_LEAVE
//           const yearAttributed = getLeaveInfo[0].year

//           const insertLeaveLedger = await Leave.insertLeaveLedger(
//             {
//               Code: codeReq,
//               Remarks: remarks,
//               LeaveType: leaveTypeReq,
//               ITEMTYPE: itemType,
//               ReferenceNo: referenceNo,
//               YearEffectivity: yearEffectivity,
//               yearAttributed: yearAttributed,
//               Credit: creditReq,
//             },
//             txn,
//             "TransDate"
//           )

//           return insertLeaveLedger
//         }

//         return await Leave.updateLeaveAction
//         (
//           {
//             status: 'RejectedByLevel2',
//             rejectedByLevel2: employeeID,
//             UserID: employeeID,
//             reasonForRejection: reason
//           },
//           { leaveId: leaveId },
//           txn,
//           "rejectedByLevel2DateTime"
//         );

//       });

//       if (rowsAffected.error) {
//         return res.status(404).json({ error: "Leave request not found" });
//       }

//       return res.status(200).json({ message: `Leave request ${Status}d successfully` });
//     }

//     const rowsAffected = await sqlHelper.transact(async (txn) => {
//       if (Status === "PendingLevel2") {
//         return await Leave.updateLeaveAction(
//           {
//             Status: 'PendingLevel2',
//             approvedByLevel1: employeeID,
//             UserID: employeeID
//           },
//           { LeaveID: LeaveID },
//           txn,
//           "approvedByLevel1DateTime"
//         );
//       }
//     });
//     if (rowsAffected.error) {
//       return res.status(404).json({ error: "Leave request not found" });
//     }
//     return res.status(200).json({ message: `Leave request ${Status}d successfully` });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to update leave request" });
//   }
// };

const getLeaveDetails = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const sqlWhereStrArr = [
      "vsl.IDCode = ?",
      "vsl.TIME_FROM IS NOT NULL",
      "vsl.TIME_TO IS NOT NULL",
      "vsl.DateLeavedFrom IS NOT NULL",
      "vsl.DateLeavedTo IS NOT NULL",
      "vsl.status IS NOT NULL",
      "vsl.DELETED = 0",
    ];
    const args = [employeeId];
    const success = await Leave.getLeaveDetails(employeeId);

    if (success) {
      success.map((row) => {
        // const dateFromStr = row.dateLeavedFrom.toISOString().substring(0, 10);
        // const dateToStr = row.dateLeavedTo.toISOString().substring(0, 10);
        // row.tIME_FROM = `${dateFromStr}T${row.tIME_FROM.toISOString().substring(11, 23)}Z`;
        // row.tIME_TO = `${dateToStr}T${row.tIME_TO.toISOString().substring(11, 23)}Z`;
        row.timeFrom = util.formatDate({ date: row.tIME_FROM, timeOnly: true });
        row.timeTo = util.formatDate({ date: row.tIME_TO, timeOnly: true });
      });

      return res.status(200).json(success);
    } else {
      return res.status(400).json({ error: "No Leave Details" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server" });
  }
};

const getLeaveBalance = async (req, res) => {
  try {
    const employeeID = req.user.employee_id;
    const sqlWhereStrArr = ["code = ?"];
    const args = [employeeID];

    const success = await Leave.getLeaveBalance(
      sqlWhereStrArr,
      args,
      employeeID,
    );

    if (success) {
      return res.status(200).json(success);
    } else {
      return res.status(400).json({
        error:
          "Failed to get Leave Balance / No Leave Balance found for this User",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserLeaveBalanceDetails = async (req, res) => {
  try {
    const employeeID = req.params.employeeID;
    const sqlWhereStrArr = ["e.EmployeeCode = ?"];
    const args = [employeeID];

    const success = await Leave.getUserLeaveBalanceDetails(
      sqlWhereStrArr,
      args,
    );

    if (success) {
      return res.status(200).json(success);
    } else {
      return res.status(400).json({ error: "Failed to get all Leave Balance" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getForfeitedLeave = async (req, res) => {
  try {
    const employeeID = req.user.employee_id;
    const sqlWhereStrArr = ["code = ?"];
    const args = [employeeID];

    const success = await Leave.getForfeitedLeave(sqlWhereStrArr, args);
    if (success) {
      return res.status(200).json(success);
    } else {
      return res
        .status(400)
        .json({ error: "Failed to get the Forfeited Leaves for this User" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPendingLeaves = async (req, res) => {
  const employeeId = req.user.employee_id;
  const checkEmployeeToApprove = await Leave.checkEmployeeToApprove(
    ["code = ?", "deleted = ?"],
    [employeeId, 0],
  );

  const lvl1DeptCodes = [];
  const lvl2DeptCodes = [];
  const userHasLevel1 = checkEmployeeToApprove.some((entry) => entry.lvl === 1);
  const userHasLevel2 = checkEmployeeToApprove.some((entry) => entry.lvl === 2);
  const employeeCodesLevel1 = [];
  const employeeCodesLevel2 = [];

  for (const toApprove of checkEmployeeToApprove) {
    if (toApprove.employeeCodes && Number(toApprove.lvl) === 1) {
      employeeCodesLevel1.push(...toApprove.employeeCodes.split(","));
      continue;
    }

    if (toApprove.employeeCodes && Number(toApprove.lvl) === 2) {
      employeeCodesLevel2.push(...toApprove.employeeCodes.split(","));
      continue;
    }

    if (Number(toApprove.lvl) === 1) {
      if (!lvl1DeptCodes.includes(toApprove.deptCode))
        lvl1DeptCodes.push(toApprove.deptCode);
    }

    if (Number(toApprove.lvl) === 2) {
      if (!lvl2DeptCodes.includes(toApprove.deptCode))
        lvl2DeptCodes.push(toApprove.deptCode);
    }
  }

  const result = await Leave.getPendingLeavesByEmployee(
    employeeCodesLevel1,
    employeeCodesLevel2,
    lvl1DeptCodes,
    lvl2DeptCodes,
    userHasLevel1,
    userHasLevel2,
  );

  if (result) {
    result.map((row) => {
      // const dateFromStr = row.dateLeavedFrom.toISOString().substring(0, 10);
      // const dateToStr = row.dateLeavedTo.toISOString().substring(0, 10);
      // row.tIME_FROM = `${dateFromStr}T${row.tIME_FROM.toISOString().substring(11, 23)}Z`;
      // row.tIME_TO = `${dateToStr}T${row.tIME_TO.toISOString().substring(11, 23)}Z`;
      row.timeFrom = util.formatDate({ date: row.tIME_FROM, timeOnly: true });
      row.timeTo = util.formatDate({ date: row.tIME_TO, timeOnly: true });
    });

    return res.status(200).json(result);
  } else {
    return res.status(400).json({ error: "No Leave Details" });
  }
};

const getRejectedLeaves = async (req, res) => {
  try {
    const employeeID = req.user.employee_id;

    const sqlWhereStrArr = ["code = ?"];
    const args = [employeeID];
    const sqlWhereStrArr2 = [
      "LI.status IN (?, ?)",
      "TIME_FROM IS NOT NULL",
      "TIME_TO IS NOT NULL",
      "DateLeavedFrom IS NOT NULL",
      "DateLeavedTo IS NOT NULL",
      "(rejectedByLevel1 IS NOT NULL OR rejectedByLevel2 IS NOT NULL)",
    ];
    const args2 = ["RejectedByLevel1", "RejectedByLevel2"];

    const rejectedLeaves = await Leave.getRejectedLeaves(
      sqlWhereStrArr,
      args,
      sqlWhereStrArr2,
      args2,
    );
    res.status(200).json(rejectedLeaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve rejected leave" });
  }
};

const getApprovedLeaves = async (req, res) => {
  try {
    const employeeID = req.user.employee_id;
    const sqlWhereStrArr = ["code = ?", "deleted = ?"];
    const args = [employeeID, 0];
    const sqlWhereStrArr2 = [
      "LI.status = ?",
      "TIME_FROM IS NOT NULL",
      "TIME_TO IS NOT NULL",
      "DateLeavedFrom IS NOT NULL",
      "DateLeavedTo IS NOT NULL",
      "approvedByLevel1 IS NOT NULL",
      "approvedByLevel2 IS NOT NULL",
    ];
    const args2 = ["Approved"];

    const approvedLeave = await Leave.getApprovedLeaves(
      sqlWhereStrArr,
      args,
      sqlWhereStrArr2,
      args2,
    );

    res.status(200).json(approvedLeave);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve approved leave" });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.LeaveID;
    const result = await sqlHelper.transact(async (txn) => {
      return await Leave.deleteLeave(
        {
          DELETED: 1,
          status: "DELETED",
        },
        { leaveId: leaveId },
        txn,
        "deletedDate",
      );

      // return await Leave.deleteLeave(sqlWhereStrArr, args, txn);
    });

    if (result.length === 0) {
      return res.status(400).json({ body: "Leave request not found" });
    }
    // else if (result.rowsAffected[0] === 0) {
    //   return res.status(404).json({ body: "Failed to delete leave request" });
    // } else if (result.rowsAffected[0] > 0) {
    //   return res.status(200).json({ body: "Success Deleting Leave" });
    // }
    return res.status(200).json({ body: "Success Deleting Leave" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete leave request" });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const leaveId = req.params.LeaveID;
    const { LeaveType, Days, TimeFrom, TimeTo, DateFrom, DateTo, Reason } =
      req.body;
    const employeeID = req.user.employee_id;
    const edited = "1";
    const dateTimeEditedd = new Date();

    const sqlWhereStrArr = ["IDCode = ?", "leaveId = ?", "status IN (?, ?)"];

    const args = [employeeID, leaveId, "Pending", "PendingLevel2"];
    const sqlWhereStrArr2 = ["IDCode = ?", "LeaveType = ?", "status IN (?, ?)"];
    const args2 = [employeeID, LeaveType, "Pending", "PendingLevel2"];
    const sqlWhereStrArr3 = ["code = ?", "l.leaveType = ?"];
    const args3 = [employeeID, LeaveType];

    const checkDateOfLeaveOverlap = await Leave.checkDateOfLeaveOverlap(
      employeeID,
      DateFrom,
      DateTo,
    );

    if (checkDateOfLeaveOverlap.length !== 0) {
      return res.status(400).json({
        error: "You have a leave with the given from date and to date.",
      });
    }

    // const getSchedule = await Leave.getSchedule(employeeID);
    // let mappedSchedule = [];

    // if (getSchedule.length === 0 || getSchedule === null) {
    //   const timeFrom = "08:00:00.0000000";
    //   const timeTo = "17:00:00.0000000";
    //   mappedSchedule = [
    //     {
    //       schedId: 1,
    //       timeFrom: new Date(`1970-01-01T${timeFrom}`),
    //       timeTo: new Date(`1970-01-01T${timeTo}`),
    //     },
    //   ];
    // } else {
    //   mappedSchedule = getSchedule.map((schedule) => {
    //     const timeFrom = new Date(schedule.timeFrom);
    //     const timeTo = new Date(schedule.timeTo);
    //     timeFrom.setUTCHours(timeFrom.getUTCHours() + 8);
    //     timeTo.setUTCHours(timeTo.getUTCHours() + 8);
    //     return {
    //       schedId: schedule.schedId,
    //       timeFrom: timeFrom.toISOString(),
    //       timeTo: timeTo.toISOString(),
    //     };
    //   });
    // }

    // const formattedResult = mappedSchedule.map((item) => ({
    //   schedId: item.schedId,
    //   timeFrom: new Date(item.timeFrom).toLocaleString("en-US", {
    //     hour12: true,
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     timeZone: "UTC",
    //   }),
    //   timeTo: new Date(item.timeTo).toLocaleString("en-US", {
    //     hour12: true,
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     timeZone: "UTC",
    //   }),
    // }));

    const getSchedule = await Leave.getSchedule(employeeID, DateFrom, DateTo);
    let mappedSchedule = [];

    if (getSchedule.length === 0 || getSchedule === null) {
      const timeFrom = "08:00:00.0000000";
      const timeTo = "17:00:00.0000000";
      mappedSchedule = [
        {
          schedId: "DTR",
          timeFrom: new Date(`1970-01-01T${timeFrom}`),
          timeTo: new Date(`1970-01-01T${timeTo}`),
        },
      ];
    } else {
      mappedSchedule = getSchedule.map((schedule) => {
        let timeFrom = null;
        let timeTo = null;
        if (!schedule.schedFrom && !schedule.schedTo) {
          const timeFrom1 = "08:00:00.0000000";
          const timeTo1 = "17:00:00.0000000";
          timeFrom = new Date(`1970-01-01T${timeFrom1}`);
          timeTo = new Date(`1970-01-01T${timeTo1}`);
        } else {
          timeFrom = new Date(schedule.schedFrom);
          timeTo = new Date(schedule.schedTo);
        }

        timeFrom.setUTCHours(timeFrom.getUTCHours() + 8);
        timeTo.setUTCHours(timeTo.getUTCHours() + 8);
        return {
          schedId: "DTR",
          timeFrom: timeFrom.toISOString(),
          timeTo: timeTo.toISOString(),
        };
      });
    }

    const formattedResult = mappedSchedule.map((item) => ({
      schedId: item.schedId,
      timeFrom: new Date(item.timeFrom).toLocaleString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
      timeTo: new Date(item.timeTo).toLocaleString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
    }));

    let success = false;

    if (
      LeaveType === "SL" ||
      LeaveType === "VL" ||
      LeaveType === "BL" ||
      LeaveType === "EL" ||
      LeaveType === "MC" ||
      LeaveType === "ML" ||
      LeaveType === "OL" ||
      LeaveType === "PARENTL" ||
      LeaveType === "UL" ||
      LeaveType === "VWC"
    ) {
      const totalValue = await Leave.calculateTotalLeaveValueInEdit(
        sqlWhereStrArr,
        args,
        sqlWhereStrArr2,
        args2,
        sqlWhereStrArr3,
        args3,
      );

      if (Days > totalValue) {
        return res
          .status(400)
          .json({ error: "Insufficient balance for LeaveType" }); // Condition: Insufficient balance for LeaveType
      }
    }

    const integerDays = Math.floor(Days);
    const fractionalDays = Days % 1;
    const TimeFromFormatted = formattedResult[0].timeFrom;
    const TimeToFormatted = formattedResult[0].timeTo;

    const getDaysDetails = await sqlHelper.transact(async (txn) => {
      return await Leave.getLeaveIdDetails(leaveId, txn);
    });
    const originalDays = getDaysDetails[0].daysOfLeave;

    if (Days === "0.5") {
      success = await sqlHelper.transact(async (txn) => {
        // return await Leave.updateAndValidateLeave(
        //   leaveId,
        //   employeeID,
        //   LeaveType,
        //   Days,
        //   TimeFrom,
        //   TimeTo,
        //   DateFrom,
        //   DateTo,
        //   Reason,
        //   edited,
        //   dateTimeEditedd,
        //   txn,
        // );
        if (LeaveType === "LWOP") {
          return await Leave.updateAndValidateLeave(
            {
              daysOfLeave: Days,
              TIME_FROM: TimeFromFormatted,
              TIME_TO: TimeToFormatted,
              DateLeavedFrom: DateFrom,
              DateLeavedTo: DateTo,
              reasonForLeave: Reason,
              LeaveType: LeaveType,
              Remarks: Reason,
              edited: edited,
              LeaveWOPay: Days,
            },
            { leaveId: leaveId, IDCode: employeeID },
            txn,
            "dateTimeEdited",
          );
        } else {
          return await Leave.updateAndValidateLeave(
            {
              daysOfLeave: Days,
              TIME_FROM: TimeFromFormatted,
              TIME_TO: TimeToFormatted,
              DateLeavedFrom: DateFrom,
              DateLeavedTo: DateTo,
              reasonForLeave: Reason,
              LeaveType: LeaveType,
              Remarks: Reason,
              edited: edited,
            },
            { leaveId: leaveId, IDCode: employeeID },
            txn,
            "dateTimeEdited",
          );
        }
      });
    } else if (Days != originalDays) {
      if (integerDays > 0) {
        success = await sqlHelper.transact(async (txn) => {
          const adjustedDateFrom = new Date(`${DateFrom} GMT`);
          const adjustedDateTo = new Date(`${DateFrom} GMT`);
          adjustedDateTo.setDate(adjustedDateTo.getDate() + integerDays - 1);

          // return await Leave.updateAndValidateLeave(
          //   leaveId,
          //   employeeID,
          //   LeaveType,
          //   integerDays,
          //   TimeFromFormatted,
          //   TimeToFormatted,
          //   adjustedDateFrom,
          //   adjustedDateTo,
          //   Reason,
          //   edited,
          //   dateTimeEditedd,
          //   txn,
          // );
          if (LeaveType === "LWOP") {
            return await Leave.updateAndValidateLeave(
              {
                daysOfLeave: Days,
                TIME_FROM: TimeFromFormatted,
                TIME_TO: TimeToFormatted,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                reasonForLeave: Reason,
                LeaveType: LeaveType,
                Remarks: Reason,
                edited: edited,
                LeaveWOPay: Days,
              },
              { leaveId: leaveId, IDCode: employeeID },
              txn,
              "dateTimeEdited",
            );
          } else {
            return await Leave.updateAndValidateLeave(
              {
                daysOfLeave: Days,
                TIME_FROM: TimeFromFormatted,
                TIME_TO: TimeToFormatted,
                DateLeavedFrom: adjustedDateFrom,
                DateLeavedTo: adjustedDateTo,
                reasonForLeave: Reason,
                LeaveType: LeaveType,
                Remarks: Reason,
                edited: edited,
              },
              { leaveId: leaveId, IDCode: employeeID },
              txn,
              "dateTimeEdited",
            );
          }
        });
      }
      if (fractionalDays > 0) {
        success = await sqlHelper.transact(async (txn) => {
          const currentDate = new Date().getFullYear();
          const leaveIdLedger = await Leave.generateLeaveId(txn);
          const adjustedDateFrom = new Date(`${DateTo} GMT`);
          const adjustedDateTo = new Date(`${DateTo} GMT`);
          return await Leave.createLeaveRequest(
            {
              IDCode: employeeID,
              DateLeavedFrom: adjustedDateFrom,
              DateLeavedTo: adjustedDateTo,
              TIME_FROM: TimeFrom,
              TIME_TO: TimeTo,
              Remarks: Reason,
              LeaveType: LeaveType,
              reasonForLeave: Reason,
              LeaveWOPay: fractionalDays,
              daysOfLeave: fractionalDays,
              itemType: `FILED-${LeaveType}-${currentDate}`,
              status: "Pending",
              leaveId: leaveIdLedger,
              EarnedDays: 0,
              EarnedHours: 0,
            },
            txn,
            "TransDate",
          );
        });
      }
    } else {
      success = await sqlHelper.transact(async (txn) => {
        if (LeaveType === "LWOP") {
          return await Leave.updateAndValidateLeave(
            {
              daysOfLeave: Days,
              TIME_FROM: TimeFromFormatted,
              TIME_TO: TimeToFormatted,
              DateLeavedFrom: DateFrom,
              DateLeavedTo: DateTo,
              reasonForLeave: Reason,
              LeaveType: LeaveType,
              Remarks: Reason,
              edited: edited,
              LeaveWOPay: Days,
            },
            { leaveId: leaveId, IDCode: employeeID },
            txn,
            "dateTimeEdited",
          );
        } else {
          return await Leave.updateAndValidateLeave(
            {
              daysOfLeave: Days,
              TIME_FROM: TimeFromFormatted,
              TIME_TO: TimeToFormatted,
              DateLeavedFrom: DateFrom,
              DateLeavedTo: DateTo,
              reasonForLeave: Reason,
              LeaveType: LeaveType,
              Remarks: Reason,
              edited: edited,
            },
            { leaveId: leaveId, IDCode: employeeID },
            txn,
            "dateTimeEdited",
          );
        }
        // return await Leave.updateAndValidateLeave(
        //   leaveId,
        //   employeeID,
        //   LeaveType,
        //   Days,
        //   TimeFromFormatted,
        //   TimeToFormatted,
        //   DateFrom,
        //   DateTo,
        //   Reason,
        //   edited,
        //   dateTimeEditedd,
        //   txn,
        // );
      });
    }

    if (!success) {
      return res.status(500).json({ error: "Failed to update leave request" });
    }

    return res
      .status(201)
      .json({ body: "Leave request(s) created successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" }); // Condition: Internal server error
  }
};

// const updateLeaveRequest = async (req, res) => {
//   try {
//     const leaveId = req.params.LeaveID;
//     const { LeaveType, Days, TimeFrom, TimeTo, DateFrom, DateTo, Reason } = req.body;
//     const employeeID = req.user.employee_id;

//     const sqlWhereStrArr = [
//       "IDCode = ?",
//       "leaveId = ?",
//       "status IN (?, ?)",
//     ];

//     const args = [employeeID, leaveId, "Pending", "PendingLevel2"];
//     const sqlWhereStrArr2 = ["IDCode = ?", "LeaveType = ?", "status IN (?, ?)"];
//     const args2 = [employeeID, LeaveType, "Pending", "PendingLevel2"];
//     const sqlWhereStrArr3 = ["code = ?", "l.leaveType = ?"];
//     const args3 = [employeeID, LeaveType];

//     let getSchedule = await Leave.getSchedule(employeeID)
//     if (getSchedule.length === 0 || getSchedule === null) {
//       const timeFrom = '08:00:00.0000000'
//       const timeTo = '17:00:00:0000000'
//       getSchedule = [{ schedId: 1, timeFrom: new Date(`1970-01-01T${timeFrom}`), timeTo: new Date(`1970-01-01T${timeTo}`) }];
//     }

//     const formattedResult = getSchedule.map(item => ({
//       schedId: item.schedId,
//       timeFrom: item.timeFrom.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit'}),
//       timeTo: item.timeTo.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit'})
//     }));

//     if(LeaveType === 'SL' || LeaveType === 'VL' || LeaveType === 'BL' ||
//       LeaveType === 'EL' || LeaveType === 'MC' || LeaveType === 'ML' ||
//       LeaveType === 'OL' || LeaveType === 'PARENTL' || LeaveType === 'UL')
//       {
//       const totalValue = await Leave.calculateTotalLeaveValueInEdit(
//         sqlWhereStrArr,
//         args,
//         sqlWhereStrArr2,
//         args2,
//         sqlWhereStrArr3,
//         args3,
//       );

//       if (Days > totalValue) {
//         return res
//           .status(400)
//           .json({ error: "Insufficient balance for LeaveType" });
//       }
//     }

//     const integerDays = Math.floor(Days);
//     const fractionalDays = Days % 1;
//     const TimeFromFormatted = formattedResult[0].timeFrom
//     const TimeToFormatted = formattedResult[0].timeTo

//     const getDaysDetails = await sqlHelper.transact(async (txn) => {
//       return await Leave.getLeaveIdDetails(leaveId, txn)
//     })
//     const originalDays = getDaysDetails[0].daysOfLeave

//     if (Days === '0.5') {
//       const success = await sqlHelper.transact(async (txn) => {
//         return await Leave.updateAndValidateLeave(
//           leaveId,
//           employeeID,
//           LeaveType,
//           Days,
//           TimeFrom,
//           TimeTo,
//           DateFrom,
//           DateTo,
//           Reason,
//           txn
//         )
//       })
//       if(!success) {
//         return res.status(500).json({ error: "Failed to insert leave request" });
//       }
//     }
//     else if (Days != originalDays) {
//       if (integerDays > 0) {
//         const success = await sqlHelper.transact(async (txn) => {
//           const adjustedDateFrom = new Date(`${DateFrom} GMT`);
//           const adjustedDateTo = new Date(`${DateFrom} GMT`);
//           adjustedDateTo.setDate(adjustedDateTo.getDate() + integerDays - 1);

//           return await Leave.updateAndValidateLeave(
//             leaveId,
//             employeeID,
//             LeaveType,
//             integerDays,
//             TimeFromFormatted,
//             TimeToFormatted,
//             adjustedDateFrom,
//             adjustedDateTo,
//             Reason,
//             txn
//           )
//         })
//         if(!success) {
//           return res.status(500).json({ error: "Failed to insert leave request" });
//         }

//       }

//       if (fractionalDays > 0) {
//         const success = await sqlHelper.transact(async (txn) => {
//           const currentDate = new Date().getFullYear()
//           const leaveIdLedger = await Leave.generateLeaveId(txn)
//           const adjustedDateFrom = new Date(`${DateTo} GMT`);
//           const adjustedDateTo = new Date(`${DateTo} GMT`);

//           return await Leave.createLeaveRequest(
//             {
//               IDCode: employeeID,
//               DateLeavedFrom: adjustedDateFrom,
//               DateLeavedTo: adjustedDateTo,
//               TIME_FROM: TimeFrom,
//               TIME_TO: TimeTo,
//               Remarks: Reason,
//               LeaveType: LeaveType,
//               reasonForLeave: Reason,
//               daysOfLeave: fractionalDays,
//               itemType: `FILED-${LeaveType}-${currentDate}`,
//               status: 'Pending',
//               leaveId: leaveIdLedger,
//               EarnedDays: 0,
//               EarnedHours: 0,
//             },
//             txn,
//             "TransDate"
//           );
//         })

//         if (!success) {
//           return res.status(500).json({ error: "Failed to insert leave request" });
//         }

//       }

//       return resultArray
//     }
//     else {
//       const success = await sqlHelper.transact(async (txn) => {
//         return await Leave.updateAndValidateLeave(
//           leaveId,
//           employeeID,
//           LeaveType,
//           Days,
//           TimeFromFormatted,
//           TimeToFormatted,
//           DateFrom,
//           DateTo,
//           Reason,
//           txn
//         )
//       })

//       if(!success) {
//         return res.status(500).json({ error: "Failed to insert leave request" });
//       }
//     }

//     return res
//       .status(201)
//       .json({ body: "Leave request(s) created successfully", success: true });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const cancelLeave = async (req, res) => {
  try {
    const leaveId = req.body.LeaveID.toString();
    const reason = req.body.reason;
    const employeeId = req.user.employee_id;
    const currentDate = new Date();

    const verify = await Leave.verifyLevelCreate(employeeId);
    const getDetails = await Leave.getLeaveIdDetails(leaveId);
    const condition1 = getDetails[0].approvedByLevel1;
    const condition2 = getDetails[0].approvedByLevel2;

    let result = null; // Initialize result variable

    if (
      (condition1 === null && condition2 === null) ||
      (condition1 !== null && condition2 === null)
    ) {
      result = await sqlHelper.transact(async (txn) => {
        // Assign result directly
        return await Leave.cancelLeave(
          {
            status: "CANCELLED",
            cancelled: 1,
            reasonForCancel: reason,
            UserID: employeeId,
            cancelledStatusOrig: "Approved",
            cancelledByLevel1: employeeId,
            cancelledByLevel1DateTime: currentDate,
            cancelledByLevel2: employeeId,
            cancelledByLevel2DateTime: currentDate,
          },
          { leaveId: leaveId },
          txn,
          "cancelledDate",
        );
      });
    } else {
      let verifyLevel1 = false;
      let verifyLevel2 = false;
      let verifyLevel1and2 = false;

      const resultOneAndTwo = await Leave.verifyLevelCreateLeave(employeeId);

      if (resultOneAndTwo.length === 0) {
        verifyLevel1 = true;
        verifyLevel2 = true;
      } else {
        for (const row of resultOneAndTwo) {
          if (
            row.lvl !== null ||
            row.lvl !== undefined ||
            row.lvl.length !== 0
          ) {
            if (row.lvl === 1) {
              verifyLevel1 = true;
            } else if (row.lvl === 2) {
              verifyLevel2 = true;
            }
          }
        }
      }

      if (verifyLevel1 && verifyLevel2) {
        verifyLevel1and2 = true;
        verifyLevel1 = false;
        verifyLevel2 = false;
      }

      if (
        verifyLevel2 === true ||
        (verify.some((level) => level.lvl === 2) &&
          !verify.some((level) => level.lvl === 1))
      ) {
        result = await sqlHelper.transact(async (txn) => {
          return await Leave.cancelLeave(
            {
              status: "CANCELLED",
              cancelled: 1,
              reasonForCancel: reason,
              UserID: employeeId,
              cancelledStatusOrig: "PendingLevel2",
              cancelledByLevel1: "0000",
              cancelledByLevel1DateTime: currentDate,
            },
            { leaveId: leaveId },
            txn,
            "cancelledDate",
          );
        });
      } else {
        result = await sqlHelper.transact(async (txn) => {
          return await Leave.cancelLeave(
            {
              status: "CANCELLED",
              cancelled: 1,
              reasonForCancel: reason,
              UserID: employeeId,
              cancelledStatusOrig: "Pending",
            },
            { leaveId: leaveId },
            txn,
            "cancelledDate",
          );
        });
      }
    }

    if (!result) {
      // Check if result is null
      return res.status(400).json({ error: "Leave request not found" });
    } else {
      return res.status(200).json({ body: "Success Cancel of Leave" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to cancel leave request" });
  }
};

const cancelPending = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    // const sqlWhereStrArr = ["code = ?"];
    // const args = [employeeId];

    const checkEmployeeToApprove = await Leave.checkEmployeeToApprove(
      ["code = ?", "deleted = ?"],
      [employeeId, 0],
    );

    const lvl1DeptCodes = [];
    const lvl2DeptCodes = [];
    const userHasLevel1 = checkEmployeeToApprove.some(
      (entry) => entry.lvl === 1,
    );
    const userHasLevel2 = checkEmployeeToApprove.some(
      (entry) => entry.lvl === 2,
    );
    const employeeCodesLevel1 = [];
    const employeeCodesLevel2 = [];

    for (const toApprove of checkEmployeeToApprove) {
      if (toApprove.employeeCodes && Number(toApprove.lvl) === 1) {
        employeeCodesLevel1.push(...toApprove.employeeCodes.split(","));
        continue;
      }

      if (toApprove.employeeCodes && Number(toApprove.lvl) === 2) {
        employeeCodesLevel2.push(...toApprove.employeeCodes.split(","));
        continue;
      }

      if (Number(toApprove.lvl) === 1) {
        if (!lvl1DeptCodes.includes(toApprove.deptCode))
          lvl1DeptCodes.push(toApprove.deptCode);
      }

      if (Number(toApprove.lvl) === 2) {
        if (!lvl2DeptCodes.includes(toApprove.deptCode))
          lvl2DeptCodes.push(toApprove.deptCode);
      }
    }

    const success = await Leave.getCancelPending(
      employeeCodesLevel1,
      employeeCodesLevel2,
      lvl1DeptCodes,
      lvl2DeptCodes,
      userHasLevel1,
      userHasLevel2,
    );

    if (success) {
      success.map((row) => {
        // const dateFromStr = row.dateLeavedFrom.toISOString().substring(0, 10);
        // const dateToStr = row.dateLeavedTo.toISOString().substring(0, 10);
        // row.tIME_FROM = `${dateFromStr}T${row.tIME_FROM.toISOString().substring(11, 23)}Z`;
        // row.tIME_TO = `${dateToStr}T${row.tIME_TO.toISOString().substring(11, 23)}Z`;
        row.timeFrom = util.formatDate({ date: row.tIME_FROM, timeOnly: true });
        row.timeTo = util.formatDate({ date: row.tIME_TO, timeOnly: true });
      });
      res.status(200).json(success);
    } else {
      return res.status(400).json({ error: "No Leave Details" });
    }
  } catch (error) {
    console.error("Failed to fetch pending cancel leave");
  }
};

const adminCancelAction = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const leaveIds = req.body.LeaveID;
    const Status = req.body.Status;
    const reason = req.body.reason;
    const currentDate = new Date();
    const result = [];

    for (const leaveId of leaveIds) {
      const checkLevelStatusQuery = await Leave.checkLevelStatusCancel(leaveId);
      const checkLevelStatus = filterRequestDetailsCreate(
        checkLevelStatusQuery,
      );

      const checkStatus = checkLevelStatus[0];
      if (
        checkStatus.approvedByLevel1 !== null &&
        checkStatus.approvedByLevel2 !== null &&
        checkStatus.ledgerId !== null
      ) {
        if (
          checkStatus.cancelledByLevel1 === null &&
          checkStatus.cancelledByLevel2 === null
        ) {
          const rowsAffected = await sqlHelper.transact(async (txn) => {
            if (Status === "Approved") {
              const resultArray = [];
              if (!checkLevelStatus.some((level) => level.lvl === 2)) {
                const checkYearAttributed =
                  await Leave.checkYearAttributedCancel(checkStatus.leaveId);
                checkYearAttributed.sort((a, b) => a.year - b.year);
                for (const year of checkYearAttributed) {
                  const yearAttributed = year.year;
                  const daysOfLeave = year.daysOfLeave;
                  const codeReq = checkStatus.iDCode;
                  const leaveTypeReq = checkStatus.leaveType;
                  const daysOfLeaveReq = daysOfLeave;
                  const referenceNoReq = checkStatus.leaveId;
                  const remarksReq = "REVERSAL:CANCELLED APPROVED LEAVED";
                  const itemTypeReq = "CANCELLED";
                  const yearEffectivityReq = checkStatus.effectiveYear;
                  const yearAttributedReq = yearAttributed;
                  const insertLeaveLedger = await Leave.insertLeaveLedger(
                    {
                      Code: codeReq,
                      Remarks: remarksReq,
                      LeaveType: leaveTypeReq,
                      ITEMTYPE: itemTypeReq,
                      ReferenceNo: referenceNoReq,
                      YearEffectivity: yearEffectivityReq,
                      yearAttributed: yearAttributedReq,
                      Debit: daysOfLeaveReq,
                    },
                    txn,
                    "TransDate",
                  );
                  const update = await Leave.updateLegerIdVSL(
                    {
                      status: insertLeaveLedger.iTEMTYPE,
                      cancelledByLevel1: employeeId,
                      cancelledByLevel1DateTime: currentDate,
                      cancelledByLevel2: employeeId,
                      cancelledByLevel2DateTime: currentDate,
                      cancelledStatusOrig: "Approved",
                      UserID: employeeId,
                      "[HEAD APPROVED]": 1,
                      "[HEAD APPROVE BY]": employeeId,
                      "[HEAD APPROVE DATE]": currentDate,
                      hrReceived: 1,
                      hrReceiveDate: currentDate,
                    },
                    { leaveId: leaveId },
                    txn,
                    "cancelledDate",
                  );
                  resultArray.push(update);
                }
                return resultArray;
              } else {
                return await Leave.updateLeaveAction(
                  {
                    status: "CANCELLED",
                    cancelledStatusOrig: "PendingLevel2",
                    cancelledByLevel1: employeeId,
                    UserID: employeeId,
                    "[HEAD APPROVED]": 1,
                    "[HEAD APPROVE BY]": employeeId,
                    "[HEAD APPROVE DATE]": currentDate,
                    hrReceived: 1,
                    hrReceiveDate: currentDate,
                  },
                  { leaveId: leaveId },
                  txn,
                  "cancelledByLevel1DateTime",
                );
              }
            } else {
              return await Leave.updateLeaveAction(
                {
                  status: "CANCELLED",
                  cancelRejectedByLevel1: employeeId,
                  UserID: employeeId,
                  reasonForRejection: reason,
                  cancelledStatusOrig: "RejectedByLevel1",
                  "[HEAD APPROVED]": 1,
                  "[HEAD APPROVE BY]": employeeId,
                  "[HEAD APPROVE DATE]": currentDate,
                  hrReceived: 1,
                  hrReceiveDate: currentDate,
                },
                { leaveId: leaveId },
                txn,
                "cancelRejectedByLevel1DateTime",
              );
            }
          });
          if (rowsAffected.error) {
            return res.status(405).json({
              body: "Error in approving or rejecting the cancelation leave",
            });
          } else {
            result.push(rowsAffected);
          }
        } else if (
          checkStatus.cancelledByLevel1 !== null &&
          checkStatus.cancelledStatusOrig === "PendingLevel2" &&
          checkStatus.cancelledByLevel2 === null
        ) {
          const rowsAffected = await sqlHelper.transact(async (txn) => {
            if (Status === "Approved") {
              const resultArray = [];
              const checkYearAttributed = await Leave.checkYearAttributedCancel(
                checkStatus.leaveId,
              );
              checkYearAttributed.sort((a, b) => a.year - b.year);
              for (const year of checkYearAttributed) {
                const yearAttributed = year.year;
                const daysOfLeave = year.daysOfLeave;
                const codeReq = checkStatus.iDCode;
                const leaveTypeReq = checkStatus.leaveType;
                const daysOfLeaveReq = daysOfLeave;
                const referenceNoReq = checkStatus.leaveId;
                const remarksReq = "REVERSAL:CANCELLED APPROVED LEAVED";
                const itemTypeReq = "CANCELLED";
                const yearEffectivityReq = checkStatus.effectiveYear;
                const yearAttributedReq = yearAttributed;
                const insertLeaveLedger = await Leave.insertLeaveLedger(
                  {
                    Code: codeReq,
                    Remarks: remarksReq,
                    LeaveType: leaveTypeReq,
                    ITEMTYPE: itemTypeReq,
                    ReferenceNo: referenceNoReq,
                    YearEffectivity: yearEffectivityReq,
                    yearAttributed: yearAttributedReq,
                    Debit: daysOfLeaveReq,
                  },
                  txn,
                  "TransDate",
                );
                const update = await Leave.updateLegerIdVSL(
                  {
                    status: insertLeaveLedger.iTEMTYPE,
                    cancelledByLevel2: employeeId,
                    cancelledByLevel2DateTime: currentDate,
                    cancelledStatusOrig: "Approved",
                    UserID: employeeId,
                    "[HEAD APPROVED]": 1,
                    "[HEAD APPROVE BY]": employeeId,
                    "[HEAD APPROVE DATE]": currentDate,
                    hrReceived: 1,
                    hrReceiveDate: currentDate,
                  },
                  { leaveId: leaveId },
                  txn,
                  "cancelledDate",
                );
                resultArray.push(update);
              }
              return resultArray;
            } else {
              return await Leave.updateLeaveAction(
                {
                  status: "CANCELLED",
                  cancelRejectedByLevel2: employeeId,
                  UserID: employeeId,
                  reasonForRejection: reason,
                  cancelledStatusOrig: "RejectedByLevel2",
                  "[HEAD APPROVED]": 1,
                  "[HEAD APPROVE BY]": employeeId,
                  "[HEAD APPROVE DATE]": currentDate,
                  hrReceived: 1,
                  hrReceiveDate: currentDate,
                },
                { leaveId: leaveId },
                txn,
                "cancelRejectedByLevel2DateTime",
              );
            }
          });
          if (rowsAffected.error) {
            return res.status(405).json({
              body: "Error in approving or rejecting the cancelation leave",
            });
          } else {
            result.push(rowsAffected);
          }
        } else {
          return res.status(405).json({ body: "No Records found" });
        }
      } else {
        return res.status(405).json({ body: "No Records found" });
      }
    }

    return res
      .status(200)
      .json({ body: "Success approving the cancelation of leave request" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update leave request" });
  }
};

const getRejectedCancelLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;

    const sqlWhereStrArr = ["code = ?"];
    const args = [employeeId];
    const sqlWhereStrArr2 = [
      "LI.cancelledStatusOrig IN (?, ?)",
      "TIME_FROM IS NOT NULL",
      "TIME_TO IS NOT NULL",
      "DateLeavedFrom IS NOT NULL",
      "DateLeavedTo IS NOT NULL",
      "(cancelRejectedByLevel1 IS NOT NULL OR cancelRejectedByLevel2 IS NOT NULL)",
    ];
    const args2 = ["RejectedByLevel1", "RejectedByLevel2"];

    const rejectedLeaves = await Leave.getRejectedCancelLeaves(
      sqlWhereStrArr,
      args,
      sqlWhereStrArr2,
      args2,
    );
    res.status(200).json(rejectedLeaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve rejected leave" });
  }
};

const getApprovedCancelLeaves = async (req, res) => {
  try {
    const employeeID = req.user.employee_id;
    const sqlWhereStrArr = ["code = ?"];
    const args = [employeeID];
    const sqlWhereStrArr2 = [
      "LI.cancelledStatusOrig = ?",
      "TIME_FROM IS NOT NULL",
      "TIME_TO IS NOT NULL",
      "DateLeavedFrom IS NOT NULL",
      "DateLeavedTo IS NOT NULL",
      "cancelledByLevel1 IS NOT NULL",
      "cancelledByLevel2 IS NOT NULL",
    ];
    const args2 = ["Approved"];

    const approvedLeave = await Leave.getApprovedCancelLeaves(
      sqlWhereStrArr,
      args,
      sqlWhereStrArr2,
      args2,
    );
    res.status(200).json(approvedLeave);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve approved leave" });
  }
};

// const updateLeaveRequest = async (req, res) => {
//   try {
//     const leaveId = req.params.LeaveID;
//     const { LeaveType, Days, TimeFrom, TimeTo, DateFrom, DateTo, Reason } = req.body;
//     const employeeID = req.user.employee_id;

//     const sqlWhereStrArr = [
//       "IDCode = ?",
//       "leaveId = ?",
//       "status IN (?, ?)",
//     ];

//     const args = [employeeID, leaveId, "Pending", "PendingLevel2"];
//     const sqlWhereStrArr2 = ["IDCode = ?", "LeaveType = ?", "status IN (?, ?)"];
//     const args2 = [employeeID, LeaveType, "Pending", "PendingLevel2"];
//     const sqlWhereStrArr3 = ["code = ?", "l.leaveType = ?"];
//     const args3 = [employeeID, LeaveType];

//     let getSchedule = await Leave.getSchedule(employeeID)
//     if (getSchedule.length === 0 || getSchedule === null) {
//       const timeFrom = '08:00:00.0000000'
//       const timeTo = '17:00:00:0000000'
//       getSchedule = [{ schedId: 1, timeFrom: new Date(`1970-01-01T${timeFrom}`), timeTo: new Date(`1970-01-01T${timeTo}`) }];
//     }

//     const formattedResult = getSchedule.map(item => ({
//       schedId: item.schedId,
//       timeFrom: item.timeFrom.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit'}),
//       timeTo: item.timeTo.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit'})
//     }));

//     console.log(formattedResult)

//     if(LeaveType === 'SL' || LeaveType === 'VL' || LeaveType === 'BL' ||
//       LeaveType === 'EL' || LeaveType === 'MC' || LeaveType === 'ML' ||
//       LeaveType === 'OL' || LeaveType === 'PARENTL' || LeaveType === 'UL')
//       {
//       const totalValue = await Leave.calculateTotalLeaveValueInEdit(
//         sqlWhereStrArr,
//         args,
//         sqlWhereStrArr2,
//         args2,
//         sqlWhereStrArr3,
//         args3,
//       );

//       if (Days > totalValue) {
//         return res
//           .status(400)
//           .json({ error: "Insufficient balance for LeaveType" });
//       }
//     }

//     const integerDays = Math.floor(Days);
//     const fractionalDays = Days % 1;

//     const result = await sqlHelper.transact(async (txn) => {
//       return await Leave.updateAndValidateLeave(
//         leaveId,
//         employeeID,
//         LeaveType,
//         Days,
//         TimeFrom,
//         TimeTo,
//         DateFrom,
//         DateTo,
//         Reason,
//         txn
//       );
//     });

//     if (result.rowsAffected[0] > 0) {
//       return res.status(200).json({ body: "Leave Request Updated Success" });
//     } else if (result.rowsAffected[0] == 0) {
//       return res.status(401).json({ error: "Failed to update leave request" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getUserApprovedLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const sqlWhereStrArr = ["v.approvedByLevel1 = ? OR v.approvedByLevel2 = ?"];
    const args = [employeeId, employeeId];

    const userApproved = await Leave.getUserApprovedLeaves(
      sqlWhereStrArr,
      args,
    );
    return res.status(200).json(userApproved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserRejectedLeaves = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const sqlWhereStrArr = ["v.rejectedByLevel1 = ? OR v.rejectedByLevel2 = ?"];
    const args = [employeeId, employeeId];

    const userRejected = await Leave.getUserRejectedLeaves(
      sqlWhereStrArr,
      args,
    );
    return res.status(200).json(userRejected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCancelApprovedLeave = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const sqlWhereStrArr = [
      "v.cancelledByLevel1 = ? OR v.cancelledByLevel2 = ?",
    ];
    const args = [employeeId, employeeId];

    const userCancelApproved = await Leave.getUserCancelApprovedLeaves(
      sqlWhereStrArr,
      args,
    );

    return res.status(200).json(userCancelApproved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCancelRejectedLeave = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;
    const sqlWhereStrArr = [
      "v.cancelRejectedByLevel1 = ? OR v.cancelRejectedByLevel2 = ?",
    ];
    const args = [employeeId, employeeId];
    const userCancelRejected = await Leave.getUserCancelRejectedLeaves(
      sqlWhereStrArr,
      args,
    );

    return res.status(200).json(userCancelRejected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getApproversDetails = async (req, res) => {
  try {
    const employeeId = req.user.employee_id;

    const result = await Leave.getApproversDetails(employeeId);
    const hasMatch = result.some(
      (item) => item.employeeCode === item.approversCode,
    );
    let filteredResult;
    if (hasMatch) {
      filteredResult = result.filter((item) => item.lvl === 2);
    } else {
      filteredResult = result;
    }
    return res.status(200).json(filteredResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLeaveTypes = async (req, res) => {
  try {
    const result = await Leave.getLeaveTypes();
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmployeeDetails = async (req, res) => {
  try {
    const { activeStatus, employeeId, lastName, firstName } = req.query;
    const searchDetails = employeeId
      ? employeeId
      : lastName
        ? lastName
        : firstName;

    const result = await Leave.getEmployeeDetails(searchDetails, activeStatus);
    if (result) {
      result.leaveDetails.map((row) => {
        // const dateFromStr = row.dateLeavedFrom.toISOString().substring(0, 10);
        // const dateToStr = row.dateLeavedTo.toISOString().substring(0, 10);
        // row.tIME_FROM = `${dateFromStr}T${row.tIME_FROM.toISOString().substring(11, 23)}Z`;
        // row.tIME_TO = `${dateToStr}T${row.tIME_TO.toISOString().substring(11, 23)}Z`;
        row.timeFrom = util.formatDate({ date: row.tIME_FROM, timeOnly: true });
        row.timeTo = util.formatDate({ date: row.tIME_TO, timeOnly: true });
      });
      res.status(200).json(result);
    } else {
      return res.status(400).json({ error: "No Leave Details" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function filterRequestDetails(data) {
  return data.filter((item) => {
    // If employeeCodes is null, include the row
    if (!item.employeeCodes) {
      return true;
    }

    // Split employeeCodes into an array and check if IDCode exists in it
    const employeeCodesArray = item.employeeCodes
      .split(",")
      .map((code) => code.trim());
    return employeeCodesArray.includes(item.iDCode.toString());
  });
}

function filterRequestDetailsCreate(data) {
  return data.filter((item) => {
    if (!item.employeeCodes) {
      return true;
    }

    const employeeCodesArray = item.employeeCodes
      .split(",")
      .map((code) => code.trim());
    return employeeCodesArray.includes(item.iDCode.toString());
  });
}

// const sendEmailDaily = async (req, res) => {
//   const statusPending = 'Pending';
//   const statusPending2 = 'PendingLevel2';
//   const level2 = 2;
//   const pendingDetails = await Leave.getPendingDetailsApproversEmail(statusPending, statusPending2, level2);

//   const counts = pendingDetails.reduce((acc, { code, lvl, approverEmail }) => {
//     const key = `${code}_${lvl}_${approverEmail}`;
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});

//   const filteredDetails = Object.entries(counts).map(([key, pendingCounts]) => {
//     const [code, lvl, approverEmail] = key.split('_');
//     return { code: parseInt(code), lvl: parseInt(lvl), pendingCounts, approverEmail };
//   });

//   // for (const item of filteredDetails) {
//   //   const pendingCountsWords = await util.numberToWords(item.pendingCounts);
//   //   const pendingCounts = item.pendingCounts
//   //   const approverEmail = item.approverEmail

//   //   const portalLink = 'https://apps.uerm.edu.ph/app/login';
//   //   const emailContent = {
//   //     header: `LEAVE MANAGEMENT <br/>`,
//   //     subject: "LEAVE APPROVAL",
//   //     content: `Good day! <br /> <br/>
//   //     You have ${pendingCountsWords}(${pendingCounts}) pending leave(s) for approval. <br/> <br/>
//   //     Please <a href="${portalLink}"> click here to log on to your UERM EMPLOYEE PORTAL</a> for details.`,
//   //     email: 'ohshaid@uerm.edu.ph',
//   //     name: `Recipient's Name`,
//   //   };
//   //   await util.sendEmail(emailContent);
//   // }

// };

const sendEmailDaily = async () => {
  const statusPending = "Pending";
  const statusPendingLevel2 = "PendingLevel2";

  const pendingRequestDetails = await Leave.getPendingDetailsApproversEmail(
    statusPending,
    statusPendingLevel2,
  );

  const {
    requestDetailsLevel1,
    requestDetailsLevel2,
    canceledDetailsLevel1,
    canceledDetailsLevel2,
  } = pendingRequestDetails;

  const filteredRequestData1 = await filterRequestDetails(requestDetailsLevel1);
  const filteredRequestData2 = await filterRequestDetails(requestDetailsLevel2);
  const filteredCancelData1 = await filterRequestDetails(canceledDetailsLevel1);
  const filteredCancelData2 = await filterRequestDetails(canceledDetailsLevel2);

  const generateCounts = (details) => {
    return details.reduce((acc, { code, lvl, approverEmail, fULLNAME }) => {
      const key = Object.values({ code, lvl, approverEmail, fULLNAME }).join(
        "/",
      );
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  const generateDetails = (countsObject) => {
    return Object.entries(countsObject).map(([key, pendingCounts]) => {
      const [code, lvl, approverEmail, fULLNAME] = key.split("/");
      return {
        code: parseInt(code),
        lvl: parseInt(lvl),
        pendingCounts,
        approverEmail,
        fULLNAME,
      };
    });
  };

  const requestCountsLevel1 = await generateCounts(filteredRequestData1);
  const requestCountsLevel2 = await generateCounts(filteredRequestData2);
  const canceledCountsLevel1 = await generateCounts(filteredCancelData1);
  const canceledCountsLevel2 = await generateCounts(filteredCancelData2);

  const filteredDetailsLevel = await generateDetails(requestCountsLevel1);
  const filteredDetailsCanceledLevel1 =
    await generateDetails(canceledCountsLevel1);
  const filteredDetailsLevel2 = await generateDetails(requestCountsLevel2);
  const filteredDetailsCanceledLevel2 =
    await generateDetails(canceledCountsLevel2);

  const generateMergedDetails = (requestDetails, canceledDetails) => {
    return requestDetails.map((detail) => {
      const canceledDetail = canceledDetails.find(
        (cancelDetail) => cancelDetail.code === detail.code,
      );
      return {
        code: detail.code,
        lvl: detail.lvl,
        pendingApprove: detail.pendingCounts,
        pendingCancel: canceledDetail ? canceledDetail.pendingCounts : null,
        approverEmail: detail.approverEmail,
        fullName: detail.fULLNAME,
      };
    });
  };

  const mergedDetailsLevel1 = await generateMergedDetails(
    filteredDetailsLevel,
    filteredDetailsCanceledLevel1,
  );
  const mergedDetailsLevel2 = await generateMergedDetails(
    filteredDetailsLevel2,
    filteredDetailsCanceledLevel2,
  );

  const currentDate = new Date();
  const daysArr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = daysArr[currentDate.getDay()];
  const currentDateFormatted = currentDate.toISOString().slice(0, 10);
  const schedule = await Leave.checkSchedule(currentDateFormatted);
  schedule.forEach((item) => {
    item.dATE = new Date(`${item.dATE}Z`);
  });

  if (schedule.length === 0 || dayName !== "Saturday" || dayName !== "Sunday") {
    if (mergedDetailsLevel1 && mergedDetailsLevel1.length > 0) {
      await processSendingEmail(mergedDetailsLevel1);
    }

    if (mergedDetailsLevel2 && mergedDetailsLevel2.length > 0) {
      await processSendingEmail(mergedDetailsLevel2);
    }
  }
};

const processSendingEmail = async (detailsArray) => {
  for (const item of detailsArray) {
    const pendingApprove = item.pendingApprove;
    const pendingCancel = item.pendingCancel;
    const approverEmail = item.approverEmail;
    const levelToApprove = item.lvl;
    const fullName = item.fullName;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    let pendingCountsApproveWord = "";
    let pendingCountsCanceledWord = "";
    let pendingLevelWord = "";
    if (pendingApprove !== null) {
      pendingCountsApproveWord = await utility.numberToWords(pendingApprove);
    }
    if (pendingApprove !== null) {
      pendingCountsCanceledWord = await utility.numberToWords(pendingCancel);
    }
    if (levelToApprove !== null) {
      pendingLevelWord = await utility.numberToWords(levelToApprove);
    }
    const portalLink =
      "https://local.uerm.edu.ph/employee-central/#/account/login";
    const emailContent = {
      header: `PENDING LEAVES FOR APPROVAL <br/>`,
      subject: `PENDING LEAVES FOR APPROVAL: ${formattedDate}`,
      content: `Good day! <br /> <br/> `,
      email: approverEmail,
      name: fullName,
    };
    if (pendingApprove !== null && pendingCancel !== null) {
      emailContent.content += `You have level ${pendingCountsApproveWord}(${pendingApprove}) pending request leave(s) and ${pendingCountsCanceledWord}(${pendingCancel}) canceled requests awaiting your Level: ${pendingLevelWord}(${levelToApprove}) approval. <br/> <br/>`;
    }
    if (pendingApprove !== null && pendingCancel === null) {
      emailContent.content += `You have ${pendingCountsApproveWord}(${pendingApprove}) pending request leave(s) awaiting your Level: ${pendingLevelWord}(${levelToApprove}) approval. <br/> <br/>`;
    }
    if (pendingCancel !== null && pendingApprove === null) {
      emailContent.content += `You have ${pendingCountsCanceledWord}(${pendingCancel}) pending canceled request leave(s) awaiting your Level: ${pendingLevelWord}(${levelToApprove}) approval. <br/> <br/>`;
    }
    emailContent.content += `Please <a href="${portalLink}">  click here</a> to log on to your <strong>UERM EMPLOYEE PORTAL</strong>, Then go to <strong>Leave Management</strong> and click the Leave Authorization / Canceled Leave Authorization for details.`;
    await util.sendEmail(emailContent);
  }
};

module.exports = {
  createLeaveRequest,
  updateLeaveAction,
  getLeaveDetails,
  getLeaveBalance,
  getUserLeaveBalanceDetails,
  getForfeitedLeave,
  getPendingLeaves,
  getRejectedLeaves,
  getApprovedLeaves,
  deleteLeave,
  updateLeaveRequest,
  getUserApprovedLeaves,
  getUserRejectedLeaves,
  cancelLeave,
  cancelPending,
  getApproversDetails,
  adminCancelAction,
  getCancelApprovedLeave,
  getCancelRejectedLeave,
  getRejectedCancelLeaves,
  getApprovedCancelLeaves,
  getLeaveTypes,
  getEmployeeDetails,
  sendEmailDaily,
  processSendingEmail,
};
