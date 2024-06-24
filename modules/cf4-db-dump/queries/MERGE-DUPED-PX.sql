-- GET PATIENT IDS USING COMMON VALUES IN THE NAME
DECLARE @FirstName VARCHAR(255) = 'DAN ANDREW'
DECLARE @LastName VARCHAR(255) = 'IBA'

SELECT 
  Id,
  PatientFName,
  PatientLname,
  PatientMname,
  PatientExtname
FROM
  EasyClaimsOffline..Patient
WHERE
  RTRIM(LTRIM(REPLACE(PatientFName, '  ', ' '))) LIKE CONCAT('%', @FirstName, '%')
  AND RTRIM(LTRIM(REPLACE(PatientLName, '  ', ' '))) LIKE CONCAT('%', @LastName, '%')




  
-- FIX DUPLICATE PATIENTS
DECLARE @OrigPatientId INT = 18008
DECLARE @DupedPatientId INT = 20708

UPDATE EasyClaimsOffline..Consultation SET
PatientId = @OrigPatientId
WHERE PatientId = @DupedPatientId

DELETE FROM EasyClaimsOffline..MenstrualHistory
WHERE PatientId = @DupedPatientId

DELETE FROM EasyClaimsOffline..MedicalHistory
WHERE PatientId = @DupedPatientId

DELETE FROM EasyClaimsOffline..Profile
WHERE PatientId = @DupedPatientId

DELETE FROM EasyClaimsOffline..Patient
WHERE Id = @DupedPatientId






-- CHECK DUPLICATED PATIENT
SELECT
  CASE
    WHEN Id = @OrigPatientId THEN 'ORIG'
    WHEN Id = @DupedPatientId THEN 'DUPED'
    ELSE NULL
  END [Status],
  Id,
  HciCaseNo,
  HciTransNo,
  PatientFName,
  PatientLname,
  PatientMname,
  PatientExtname
FROM
  EasyClaimsOffline..Patient
WHERE
  Id IN (@OrigPatientId, @DupedPatientId);

-- CHECK PATIENT
SELECT * FROM EasyClaimsOffline..Patient
WHERE Id = @DupedPatientId

-- CHECK PATIENT PROFILE
SELECT * FROM EasyClaimsOffline..Profile
WHERE PatientId = @DupedPatientId

-- CHECK PATIENT MEDICAL HISTORY
SELECT * FROM EasyClaimsOffline..MedicalHistory
WHERE PatientId = @DupedPatientId

-- CHECK PATIENT MEDICAL HISTORY
SELECT * FROM EasyClaimsOffline..MenstrualHistory
WHERE PatientId = @DupedPatientId

-- CHECK CONSULTATION
SELECT * FROM EasyClaimsOffline..Consultation
WHERE PatientId = @DupedPatientId

