-- SELECT TEST PATIENT WITH PHIC PIN, CF4 AND OTHER CRITERIA
SELECT DISTINCT
  cf4.Code,
  c.CaseNo,
  p.PatientNo,
  cf4d.FieldCode,
  cf4d.Value
FROM
  UERMMMC..PatientInfo p
  LEFT JOIN UERMMMC..Cases c on c.patientNo = p.patientNo
  LEFT JOIN DocumentMgt..CF4Claims cf4 ON cf4.CaseNo = c.caseNo
  LEFT JOIN DocumentMgt..CF4ClaimDetails cf4d ON cf4d.ClaimId = cf4.Code
WHERE
  ISNULL(p.UDF_PHILHEALTHNO, '') <> ''
  AND c.patientType = 'IPD'
  AND ISNULL(c.DateDis, '') <> ''
  AND ISNULL(cf4.id, '') <> ''
  AND cf4.Status = 3
  --AND cf4d.FieldCode = 'symptomsPainRemarks'
  AND cf4d.Value LIKE '%Quantity%'
  AND CONVERT(DATE, c.DateAd) BETWEEN '2024-02-01' AND '2024-03-07';



-- SELECT PATIENTS ADDED BY CF4 DB DUMP
SELECT
  HciCaseNo,
  HciTransNo,
  createdBy,
  created
FROM
  EasyClaimsOffline..patient
WHERE
  hciTransNo LIKE 'C%';




-- SELECT DUMPED CLAIM
SELECT DISTINCT
  c.eClaimId,
  c.Id ConsultationId,
  p.Id PatientId,
  p.PatientLname,
  p.PatientFName,
  p.PatientMName,
  m.*
FROM
  EasyClaimsOffline..medicine m
  LEFT JOIN EasyClaimsOffline..Consultation c on c.id = m.ConsultationId
  LEFT JOIN EasyClaimsOffline..Patient p on p.id = c.PatientId
  LEFT JOIN EasyClaimsOffline..PePert pe on pe.ConsultationId = c.id
  LEFT JOIN EasyClaimsOffline..PhysicalExamination pe2 on pe2.ConsultationId = c.id
WHERE
  c.eClaimId = '0098000';




-- SELECT CLAIM
SELECT
  cd.*
FROM
  DocumentMgt..CF4ClaimDetails cd
  LEFT JOIN DocumentMgt..CF4Claims c ON c.Code = cd.ClaimId
WHERE
  c.caseNo = '0098244'
  AND cd.fieldCode = 'drugsOrMedicinesResult'
  AND cd.status = 1