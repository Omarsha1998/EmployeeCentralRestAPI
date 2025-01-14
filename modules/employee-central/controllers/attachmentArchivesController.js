const attachmentArchivesModel = require("../models/attachmentArchivesModel.js");
const helperMethods = require("../utility/helperMethods.js");

// @desc    Get all the departments
// @route   GET /api/attachment-archives/get-all-departments
// @access  Private
const getAllDepartments = async (req, res) => {
  try {
    const result = await attachmentArchivesModel.getAllDepartments();
    const emptyValue = { department_id: 0, department_name: "ANY DEPARTMENT"};
    // push the object and make that in the 1st place
    result.unshift(emptyValue);

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json(
        helperMethods.getErrorMessage(
          "getAllDepartments",
          error.message,
          error.stack,
        ),
      );
  }
};

// @desc    Search an employee
// @route   GET /api/attachment-archives/search-employee
// @access  Private
const searchEmployee = async (req, res) => {
  try {
    const { departmentID, employeeIDOrEmployeeName } = req.query;
    const response = await attachmentArchivesModel.searchEmployee(departmentID,employeeIDOrEmployeeName);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json(
        helperMethods.getErrorMessage(
          "searchEmployee",
          error.message,
          error.stack,
        ),
      );
  }
};

// @desc    Get all the attachment of an employee
// @route   GET /api/attachment-archives/get-employee-attachment
// @access  Private
const getEmployeeAttachments = async (req, res) => {
  try {
    const { employeeID } = req.query;
    const response = await attachmentArchivesModel.getEmployeeAttachments(employeeID);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json(
        helperMethods.getErrorMessage(
          "getEmployeeAttachments",
          error.message,
          error.stack,
        ),
      );
  }
};

module.exports = {
  getAllDepartments,
  searchEmployee,
  getEmployeeAttachments,
};
