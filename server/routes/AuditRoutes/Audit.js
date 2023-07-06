const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");
const db = require("../../models");

router.get("/schema", async (req, res) => {
    // GET DATABASES
      const rkyv_db = await db.sequelize.query(`
      SELECT schema_name FROM information_schema.schemata where schema_name like "rkyv_db%";
    `, {
      type: QueryTypes.SELECT,
    });
    // GET USERS
    const users = await db.sequelize.query(`
    SELECT distinct(FULLNAME)
    FROM rkyv_system_db.audits
    JOIN rkyv_system_db.users u ON u.USERNO = rkyv_system_db.audits.USERHANDLE WHERE (u.DELETED is null and u.INACTIVE = false);
    `, {
      type: QueryTypes.SELECT,
    });
    // GET FUNCTION LIST
    const functionList = await db.sequelize.query(`
    select distinct functionname 
    from (
		SELECT FUNCTIONNAME
		FROM rkyv_system_db.audits
		union 
		select FUNCTIONNAME
		from rkyv_db1_db	.audits 
	) data;;
    `, {
      type: QueryTypes.SELECT,
    });
    res.json({databases: rkyv_db, users: users, functionList: functionList})
});



module.exports = router;
