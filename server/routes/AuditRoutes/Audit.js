const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");
const db = require("../../models");

router.get("/schema", async (req, res) => {
  // GET DATABASES
  try{

    const rkyv_db = await db.sequelize.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'rkyv_db%';`,
      {
        type: QueryTypes.SELECT,
      }
      );
      // GET USERS
      const users = await db.sequelize.query(
        `SELECT 'ALL' as FULLNAME FROM dual
        UNION
        SELECT distinct(FULLNAME)
        FROM rkyv_system_db.audits
        JOIN rkyv_system_db.users u ON u.USERNO = rkyv_system_db.audits.USERHANDLE WHERE (u.DELETED is null and u.INACTIVE = false);
        `,
        {
          type: QueryTypes.SELECT,
        }
        );
        // GET FUNCTION LIST
        const functionList = await db.sequelize.query(
          `SELECT 'ALL' as functionname FROM dual
          UNION
          select distinct functionname 
          from (
            SELECT FUNCTIONNAME
            FROM rkyv_system_db.audits
            union 
            select FUNCTIONNAME
            from rkyv_db1_db	.audits 
            ) data;;
            `,
            {
              type: QueryTypes.SELECT,
            }
  );
  res.json({ databases: rkyv_db, users: users, functionList: functionList });
}catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}
});

// GET AUDITS
router.post("/getAudit", async (req, res) => {
  const { startDate, endDate, database, user, functionList } = req.body;
  if (database?.length >= 1) {
    let username = 'AND audit.fullname LIKE "%"';
    if (user.includes('ALL')) {
      username = 'AND audit.fullname LIKE "%"';
    } else if (user.length >= 1) {
      const userValue = user.map((user) => `'${user}'`).join(',');
      username = `AND audit.fullname IN (${userValue})`;
    }
    
    let functionName = 'AND audit.functionname LIKE "%"';
    if (functionList.includes('ALL')) {
      functionName = 'AND audit.functionname LIKE "%"';
    } else if (functionList.length >= 1) {
      const funVal = functionList.map((fun) => `'${fun}'`).join(',');
      functionName = `AND audit.functionname in (${funVal})`;
    }

    try {
      const audits = await db.sequelize.query(
        `
        SELECT 
        ROW_NUMBER() OVER (ORDER BY audit.time DESC) AS 'SrNumber',
          audit.functionname AS 'Function', 
          TIME(audit.time) AS 'FunctionTime',
          DATE(audit.time) as 'FunctionDate',
          CASE WHEN audit.DOCUMENT = '' || null THEN 'NO Document' ELSE audit.DOCUMENT END AS 'Document', 
          CASE WHEN audit.folderpath = '' || null THEN 'NO Folder' ELSE audit.folderpath END AS 'Folder', 
          CASE WHEN audit.DESCRIPTION = '' || null THEN 'NO Description' ELSE audit.DESCRIPTION END AS 'Description', 
          audit.db_name as 'Database', 
          audit.FULLNAME as 'username' 
        FROM
        (
          SELECT FUNCTIONNAME, time, DOCUMENT, FOLDERPATH, FULLNAME, DESCRIPTION, null AS db_name
          FROM rkyv_system_db.audits
          JOIN rkyv_system_db.users ON rkyv_system_db.users.USERNO = rkyv_system_db.audits.USERHANDLE
          UNION 
          ${database
            ?.map(
              (item) =>
                `SELECT FUNCTIONNAME, time, DOCUMENT, FOLDERPATH, FULLNAME, DESCRIPTION, i.DB_NAME
                FROM ${item}.audits a
                INNER JOIN rkyv_system_db.users u ON u.userno = a.USERHANDLE
                LEFT JOIN ${item}.inf i ON i.DB_No = a.db_name`
            )
            .join(" UNION ")}
        ) audit  
        WHERE
        date(audit.time) BETWEEN '${startDate}' AND '${endDate}'
          ${username}
          ${functionName}
        ORDER BY audit.time DESC;
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.send(audits);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
