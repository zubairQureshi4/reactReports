const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers

const Prospect = require("./routes/DoorSupervisorRoutes/Prospect");
app.use("/Prospect", Prospect);

const Registered = require("./routes/DoorSupervisorRoutes/Registered");
app.use("/registered", Registered);

const Audit = require("./routes/AuditRoutes/Audit");
app.use("/audit", Audit);




db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
