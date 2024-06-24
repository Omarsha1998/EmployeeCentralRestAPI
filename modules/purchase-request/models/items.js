const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const selectItems = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `SELECT
        ${util.empty(options.top) ? "" : `TOP(${options.top})`}
        itemCode,
        brandName,
        mg,
        genName,
        dosageForm,
        ucost,
        unitPricePerPc,
        phicCatCode,
        phicGroupCode,
        isGeneral,
        discontinue
      FROM UERMMMC..PHAR_ITEMS
      WHERE 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
      `,
    [],
    txn,
  );
};

const selectAllottedItemsHospital = async function (conditions, txn, options) {
  console.log(`select distinct 
  itl.itemCode,
  genName,
  phi.brandName,
  mg,
  dosageForm,
  ucost,
  unitPricePerPc,
  phicCatCode,
  phicGroupCode,
  isGeneral,
  discontinue
  from UERMINV..DepartmentItems itl
--join UERMMMC..PHAR_ITEMS phi on itl.ITEMCODE = phi.ItemCode
--join UERMMMC..SECTIONS s on itl.departmentCode = s.code
join UERMMMC..PHAR_ITEMS phi on convert(varchar, itl.ITEMCODE) collate SQL_Latin1_General_CP1_CI_AS = phi.ItemCode
join UERMMMC..SECTIONS s on   convert(varchar, itl.departmentCode) collate SQL_Latin1_General_CP1_CI_AS = s.code
where 1=1 
${conditions}
${util.empty(options.order) ? "" : `order by ${options.order}`}
`);
  return await sqlHelper.query(
    `select distinct 
      itl.itemCode,
      genName,
      phi.brandName,
      mg,
      dosageForm,
      ucost,
      unitPricePerPc,
      phicCatCode,
      phicGroupCode,
      isGeneral,
      discontinue
      from UERMINV..DepartmentItems itl
    --join UERMMMC..PHAR_ITEMS phi on itl.ITEMCODE = phi.ItemCode
    --join UERMMMC..SECTIONS s on itl.departmentCode = s.code
    join UERMMMC..PHAR_ITEMS phi on convert(varchar, itl.ITEMCODE) collate SQL_Latin1_General_CP1_CI_AS = phi.ItemCode
    join UERMMMC..SECTIONS s on   convert(varchar, itl.departmentCode) collate SQL_Latin1_General_CP1_CI_AS = s.code
    where 1=1 
    ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    [],
    txn,
  );
};

const selectAllottedItems = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `select distinct 
      itl.itemCode,
      genName,
      phi.brandName,
      mg,
      dosageForm,
      ucost,
      unitPricePerPc,
      phicCatCode,
      phicGroupCode,
      isGeneral,
      discontinue
    from UERMMMC..INV_ITEMS_LOG itl
    join UERMMMC..PHAR_ITEMS phi on itl.ITEMCODE = phi.ItemCode
    join UERMMMC..SECTIONS s on itl.dept = s.code
    where 1=1 
    ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    [],
    txn,
  );
};

const selectDepartmentItems = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `SELECT
        ${util.empty(options.top) ? "" : `TOP(${options.top})`}
        d.id,
        d.itemCode,
        d.departmentCode,
        brandName,
        mg,
        genName,
        dosageForm,
        ucost,
        unitPricePerPc,
        phicCatCode,
        phicGroupCode,
        discontinue
      FROM UERMINV..DepartmentItems d
      join UERMMMC..PHAR_ITEMS p on p.itemCode = d.itemCode
      WHERE 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
      `,
    [],
    txn,
  );
};

const insertDepartmentItems = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..DepartmentItems", payload, txn);
};

const updateItems = async function (payload, condition, txn) {
  return await sqlHelper.update(
    "UERMMMC..PHAR_ITEMS",
    payload,
    condition,
    txn,
    "lastDateTimeUpdated",
  );
};

const updateDepartmentItems = async function (payload, condition, txn) {
  return await sqlHelper.update(
    "UERMMMC..DepartmentItems",
    payload,
    condition,
    txn,
  );
};

module.exports = {
  selectItems,
  selectAllottedItems,
  selectAllottedItemsHospital,
  updateItems,
  selectDepartmentItems,
  insertDepartmentItems,
  updateDepartmentItems,
};
