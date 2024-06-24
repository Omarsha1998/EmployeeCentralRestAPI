const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const documents = require("../models/documents");

// const destination = `./files/student-documents/`;
// const fs = require("fs");

const uploadDocument = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const currentDate = new Date();
      const formattedDatetime = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}${currentDate.getHours().toString().padStart(2, "0")}${currentDate.getMinutes().toString().padStart(2, "0")}${currentDate.getSeconds().toString().padStart(2, "0")}`;
      const user = req.user.code;
      const studentno = req.body.studentno;
      const docucode = req.body.docucode;
      const coursecode = req.body.coursecode;
      const filename = req.files.file.name;
      const filesize = req.files.file.size;
      const status = "2";
      const filedata = req.files.file.data;
      const filetype = req.files.file.mimetype;

      const sanitizedFilename = filename.replace(/[^\w.]/g, "_");

      const newFilename = `${formattedDatetime}_${sanitizedFilename.toLowerCase()}`;

      const uploadDocument = {
        SN: studentno,
        code: docucode,
        courseCode: coursecode,
        fileName: newFilename,
        fileSize: filesize,
        Status: status,
        fileData: filedata,
        fileType: filetype,
        createdBy: user,
        updatedBy: user,
      };
      const sendDocument = await documents.insertDocument(uploadDocument, txn);

      return sendDocument;
      // if(sendDocument)
      // {
      //     var dir = `${destination}${studentno}`;
      //     if (!fs.existsSync(dir)) {
      //         fs.mkdirSync(dir);
      //     }
      //     if (req.files) {
      //         var file = req.files.file;

      //         file.mv(`${destination}${studentno}/` + newFilename, function (err) {
      //             if (err) {
      //                 console.log(err);
      //             } else {
      //                 console.log("File Uploaded!");
      //             }
      //             });
      //     }
      // }
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });
  return res.json(returnValue);
}; //END OF uploadDocument

const editDocument = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const currentDate = new Date();
      const formattedDatetime = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}${currentDate.getHours().toString().padStart(2, "0")}${currentDate.getMinutes().toString().padStart(2, "0")}${currentDate.getSeconds().toString().padStart(2, "0")}`;
      const user = req.user.code;
      const studentno = req.body.studentno;
      const docucode = req.body.docucode;
      const filename = req.files.file.name;
      const filesize = req.files.file.size;
      const filedata = req.files.file.data;
      const filetype = req.files.file.mimetype;

      // Sanitize the filename by replacing special characters with underscores
      const sanitizedFilename = filename.replace(/[^\w.]/g, "_");

      //ADD DATETIME IN FRONT OF FILE NAME
      const newFilename = `${formattedDatetime}_${sanitizedFilename}`;

      const uploadDocument = {
        fileName: newFilename,
        fileSize: filesize,
        fileData: filedata,
        fileType: filetype,
        updatedBy: user,
      };

      const sqlWhere = {
        SN: studentno,
        code: docucode,
      };
      const editDocument = await documents.updateDocument(
        uploadDocument,
        sqlWhere,
        txn,
      );
      return editDocument;

      // console.log("file",  req.files.file)
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });
  return res.json(returnValue);
}; //END OF editDocument

const deleteDocument = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const docucode = req.body.docucode;
    const studentno = req.body.studentno;
    const user = req.user.code;

    const deleteDocument = {
      active: "0",
      updatedBy: user,
    };
    const sqlWhere = {
      SN: studentno,
      code: docucode,
    };

    const editDocument = await documents.removeDocument(
      deleteDocument,
      sqlWhere,
      txn,
    );
    return editDocument;
  });
  return res.json(returnValue);
}; //END OF deleteDocument

const viewImage = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const docucode = req.query.docucode;
      const studentno = req.query.studentno;

      const args = [studentno, docucode];
      const imageData = await documents.selectPicture(args, txn);
      const storeData = [];
      const letImage = imageData[0].fileData.toString("base64");
      storeData.push(letImage);
      storeData.push(imageData[0].fileType);
      return storeData;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  return res.json(returnValue);
}; //END OF viewImage

const getOldStudents = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const userSearch = `%${req.query.search}%`;
      let sqlWhere = "";
      let sqlSelectWhere = "";
      sqlWhere = `s.semester >= '20211' AND s.Active ='1'`;
      sqlSelectWhere = `s.semester >= '20211' AND  
            (CONCAT(TRIM(s.lastname), ' ', TRIM(s.firstname)) LIKE '${userSearch}' OR 
            CONCAT(TRIM(s.lastname), ', ', TRIM(s.firstname)) LIKE '${userSearch}' OR s.lastname LIKE '${userSearch}'
            OR s.firstname LIKE '${userSearch}' OR s.sn LIKE '${userSearch}'  
            )`;
      if (req.query.search === "") {
        return await documents.selectOldStudents(sqlWhere, txn);
      } else {
        return await documents.selectOldStudents(sqlSelectWhere, txn);
      }
    } catch (error) {
      console.log("error at getDocuments", error);
      return { error: error };
    }
  });
  return res.json(returnValue);
}; //END OF getOldStudents

const getStudentDocuments = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      let sqlWhere = "";
      let sqlWhereForeiner = "";
      sqlWhere = `s.sn = '${req.query.sn}' AND sd.isForeigner != '1'`;
      sqlWhereForeiner = `s.sn = '${req.query.sn}'`;

      //kapag hindi foreigner
      if (req.query.isForeign === "") {
        return await documents.selectStudentDocument(sqlWhere, txn);
      } else {
        return await documents.selectStudentDocument(sqlWhereForeiner, txn);
      }
    } catch (error) {
      console.log("error at getDocuments", error);
      return { error: error };
    }
  });
  return res.json(returnValue);
}; ///END OF getStudentDocuments

const countSubmittedDocuments = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      let sqlWhere = "";
      let sqlWhereForeign = "";
      sqlWhere = `s.sn = '${req.query.sn}' AND sd.isForeigner != '1' AND sdd.code IS NOT NULL AND sd.isOptional != '1'`;
      sqlWhereForeign = `s.sn = '${req.query.sn}' AND sdd.code IS NOT NULL AND sd.isOptional != '1'`;

      if (req.query.isForeign === "") {
        return await documents.selectCountSubmittedDocuments(sqlWhere, txn);
      } else {
        return await documents.selectCountSubmittedDocuments(
          sqlWhereForeign,
          txn,
        );
      }
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });
  return res.json(returnValue);
};

const countRequiredDocuments = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      let sqlWhere = "";
      let sqlWhereForeign = "";
      sqlWhere = `s.sn = '${req.query.sn}' AND sd.isForeigner != '1' AND sd.isOptional != '1'`;
      sqlWhereForeign = `s.sn = '${req.query.sn}' AND sd.isOptional != '1'`;
      if (req.query.isForeign === "") {
        return await documents.selectCountRequiredDocuments(sqlWhere, txn);
      } else {
        return await documents.selectCountRequiredDocuments(
          sqlWhereForeign,
          txn,
        );
      }
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });
  return res.json(returnValue);
};

module.exports = {
  uploadDocument,
  editDocument,
  deleteDocument,
  viewImage,
  getOldStudents,
  getStudentDocuments,
  countSubmittedDocuments,
  countRequiredDocuments,
};
