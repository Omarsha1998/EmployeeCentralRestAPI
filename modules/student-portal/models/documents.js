const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");


const selectOldStudents = async function(conditions, txn){
    return await sqlHelper.query(
        `SELECT TOP(50) 
                s.sn,
                s.lastName,
                s.firstName,
                s.middleName,
                s.college,
                s.course,
                s.[foreign],
                s.yearLevel,
                s.semester,
                c.description degree
        FROM [UE database]..student s 
        LEFT JOIN [UE database]..[Courses] c ON c.college = s.college AND c.course = s.course
        WHERE ${conditions} ORDER BY SEMESTER
        `,
        [],
        txn
    );
};

const selectStudentDocument = async function(conditions, txn){
    return await sqlHelper.query(
        `SELECT
            s.sn,
            s.lastname,
            s.firstname,
            sd.id,
            sd.code,
            sd.courseCode,
            sd.requirements,
            sdd.code sddCode,
            sdd.remarks,
            sdd.status,
            sdd.fileName,
            sdd.fileData,
            sdd.updatedBy,
            e.lastName,
			e.firstName,
            FORMAT(sdd.dateTimeUpdated, 'dd-MMMM-yyyy') dateTimeUpdated
        FROM [UE database]..StudentDocuments sd
        LEFT JOIN [UE database]..Student s ON s.college = sd.courseCode
        LEFT JOIN [UE database]..StudentDocumentDetails sdd ON sdd.SN = s.sn AND sd.code = sdd.code AND sdd.Active != '0'
        LEFT JOIN [UE database]..Employee e ON  sdd.updatedBy = e.EmployeeCode
        WHERE ${conditions}
        `,
        [],
        txn
    );
};


const insertDocument = async function(payload, txn){
    try {       
        return await sqlHelper.insert(
            "[UE database]..StudentDocumentDetails",
            payload,
            txn
        );
    } catch (error) {
        return { error: true, message: error };
    }
}


const updateDocument = async function(payload, conditions, txn){
    try {
        return await sqlHelper.update(
            "[UE database]..StudentDocumentDetails",
            payload,
            conditions,
            txn
        );
    } catch (error) {
        return { error: true, message: error };
    }
}

const removeDocument = async function(payload, conditions, txn){
    try {
        return await sqlHelper.update(
            "[UE database]..StudentDocumentDetails",
            payload,
            conditions,
            txn
        );
    } catch (error) {
        return { error: true, message: error };
    }
}

const selectPicture = async function(payload, txn){
    return await sqlHelper.query(
        `SELECT 
            sd.code,
            sd.courseCode,
            sd.requirements,
            s.firstname,
            s.lastname,
            s.yearLevel,
            s.class,
            sdd.code sddCode,
            sdd.fileName,
            sdd.fileData,
            sdd.fileType,
            sdd.status,
            sdd.remarks,
            sdd.datetImeUpdated
        FROM [UE database]..StudentDocuments sd
        LEFT JOIN [UE database]..Student s ON s.college = sd.CourseCode 
        LEFT JOIN [UE database]..StudentDocumentDetails sdd ON sdd.Code = sd.Code
        WHERE s.SN = ? AND sdd.Code = ?`,
        payload,
        txn 
    );
};


const selectCountSubmittedDocuments = async function(conditions, txn){
    return await sqlHelper.query(
        `SELECT
			COUNT(sdd.code) AS submittedDocu
        FROM [UE database]..StudentDocuments sd 
        LEFT JOIN [UE database]..Student s ON s.college = sd.courseCode   
        LEFT JOIN [UE database]..StudentDocumentDetails sdd ON sdd.SN = s.sn AND sd.code = sdd.code AND sdd.Active != '0'
		WHERE  ${conditions}
        `,
        [],
        txn
    )
}

const selectCountRequiredDocuments = async function(conditions, txn){
    return await sqlHelper.query(
        `SELECT
			COUNT(sd.active) AS requiredDocu
        FROM [UE database]..StudentDocuments sd 
        LEFT JOIN [UE database]..Student s ON s.college = sd.courseCode   
        LEFT JOIN [UE database]..StudentDocumentDetails sdd ON sdd.SN = s.sn AND sd.code = sdd.code AND sdd.Active != '0'
		WHERE  ${conditions}
        `,
        [],
        txn
    )
}




module.exports = {
    insertDocument,
    updateDocument,
    removeDocument,
    selectPicture,
    selectOldStudents,
    selectStudentDocument,
    selectCountSubmittedDocuments,
    selectCountRequiredDocuments
}