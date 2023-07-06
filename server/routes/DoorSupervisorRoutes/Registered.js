const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");
const db = require("../../models");

router.post("/all", async (req, res) => {
  const { course, salesAgent, startDate, endDate, batch } = req.body;
  try {
    // FOR SALES AGENT
    let salesAgentQuery = '';
    if (salesAgent.includes('ALL')) {
      salesAgentQuery = 'AND upper(substr(F65, 4)) LIKE "%"';
    }else if (salesAgent.includes('NO Agent')) {
      if (salesAgent.length != 1) {
        const salesAgentValues = salesAgent.map((agent) => `'${agent}'`).join(',');
        salesAgentQuery = `AND upper(substr(F65, 4)) IN ("", ${salesAgentValues})`;
      }else{

        salesAgentQuery = `AND upper(substr(F65, 4)) LIKE ""`;
      }
    } else  {
      const salesAgentValues = salesAgent.map((agent) => `'${agent}'`).join(',');
      salesAgentQuery = `AND upper(substr(F65, 4)) IN (${salesAgentValues})`;
    }
    // FOR COURSE
    let courseQuery = '';
    if (course.includes('ALL')) {
      courseQuery = 'AND upper(substr(F58, 4)) LIKE "%"';
    }else if (course.includes('NO Course')) {
      if (salesAgent.length != 1) {
        const courseValues = course.map((courseVal) => `'${courseVal}'`).join(',');
        courseQuery = `AND upper(substr(F58, 4)) IN ("", ${courseValues})`;
      }else{

        courseQuery = `AND upper(substr(F58, 4)) LIKE ""`;
      }
    } else  {
      const newCourseValues = course.map((val) => `'${val}'`).join(',');
      courseQuery = `AND upper(substr(F58, 4)) IN (${newCourseValues})`;
    }
    // FOR BATCH
    let batchQuery = '';
    if (batch.includes('ALL')) {
      batchQuery = 'AND upper(substr(F92, 4)) LIKE "%"';
    }else  {
        const batchValues = batch.map((batch) => `'${batch}'`).join(',');
        batchQuery = `AND upper(substr(F92, 4)) IN ("", ${batchValues})`;;
    }
    const int = await db.sequelize.query(`
    select substr(F54, 4) AS 'Name', 
    substr(F56, 4) AS 'Contact', 
    CASE WHEN substr(F58, 4) = '' THEN 'NO Course' ELSE substr(F58, 4) END AS 'Course',
    substr(F75, 4) AS 'Email', 
    substr(F92, 4) AS 'Batch',
    CASE WHEN substr(F65, 4) = '' THEN 'NO Agent' ELSE substr(F65, 4) END AS 'Sales Agent',
    substr(F83, 4) AS 'Follow Up', 
    DATE(substr(F52,4)) AS 'Date of Entry' 
    from doc_fields f, doc d
    WHERE d.DOCUMENT_NO = f.DOCUMENT_NO and (d.DELETED != 'y' or d.DELETED is null) AND F54 IS NOT NULL 
    AND F92 IS NOT NULL
      AND DATE(substr(F52,4)) BETWEEN "${startDate}" AND "${endDate}"
      ${courseQuery}
      ${salesAgentQuery}
      ${batchQuery};
    `, {
      type: QueryTypes.SELECT,
    });

    res.send(int);
  } catch (error) {
    res.json(error);
  }
});


router.get("/salesagent", async (req, res) => {
  try {
    const int = await db.sequelize.query(`
      SELECT DISTINCT
        CASE WHEN substr(F65, 4) = '' THEN 'NO Agent' ELSE substr(F65, 4) END AS value,
        CASE WHEN substr(F65, 4) = '' THEN 'NO Agent' ELSE substr(F65, 4) END AS label,
        CASE WHEN substr(F58, 4) = '' THEN 'NO Course' ELSE substr(F58, 4) END AS course,
        substr(F92, 4) AS Batch
      FROM doc_fields f, doc d
      WHERE d.DOCUMENT_NO = f.DOCUMENT_NO AND (d.DELETED != 'y' OR d.DELETED IS NULL) AND F54 IS NOT NULL AND F92 IS NOT NULL;
    `, {
      type: QueryTypes.SELECT,
    });

    const options = [
      { value: 'ALL', label: 'ALL', course: 'ALL' },
      ...int.map(({ value, label, course }) => ({ value, label, course })),
    ];

    res.send(options);
  } catch (error) {
    res.json(error);
  }
});


router.get("/courses", async (req, res) => {
  try {
    const int = await db.sequelize.query(`
      SELECT DISTINCT
        CASE WHEN substr(F58, 4) = '' THEN 'NO Agent' ELSE substr(F58, 4) END AS value,
        CASE WHEN substr(F58, 4) = '' THEN 'NO Agent' ELSE substr(F58, 4) END AS label
      FROM doc_fields f, doc d
      WHERE d.DOCUMENT_NO = f.DOCUMENT_NO AND (d.DELETED != 'y' OR d.DELETED IS NULL) AND F54 IS NOT NULL AND F92 IS NOT NULL;
    `, {
      type: QueryTypes.SELECT,
    });

    const options = [
      { value: 'ALL', label: 'ALL' },
      ...int.map(({ value, label }) => ({ value, label })),
    ];

    res.send(options);
  } catch (error) {
    res.json(error);
  }
});

router.get("/batch", async (req, res) => {
    try {
      const int = await db.sequelize.query(`
        SELECT DISTINCT
        substr(F92, 4) AS value,
        substr(F92, 4)  AS label
        FROM doc_fields f, doc d
        WHERE d.DOCUMENT_NO = f.DOCUMENT_NO AND (d.DELETED != 'y' OR d.DELETED IS NULL) AND F54 IS NOT NULL AND F92 IS NOT NULL;
      `, {
        type: QueryTypes.SELECT,
      });
  
      const options = [
        { value: 'ALL', label: 'ALL' },
        ...int.map(({ value, label }) => ({ value, label })),
      ];
  
      res.send(options);
    } catch (error) {
      res.json(error);
    }
  });

module.exports = router;
