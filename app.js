require("dotenv").config();

// const fs = require("fs");
// const { Server } = require("socket.io");
// const socket = require("socket.io");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const db = require("./helpers/sql.js");
const socket = require("./helpers/socket.js");
const fileUpload = require("express-fileupload");

const prodDbConfig = require("./config/databaseConfig.js");
const testDbConfig = require("./config/databaseTestingConfig.js");
const diagDbConfig = require("./config/diagnosticDatabase.js");
const eClaimsConfig = require("./config/databaseEclaimsConfig.js").prod;
const eClaimsConfigTest = require("./config/databaseEclaimsConfig.js").dev;

const app = express();
const server = http.createServer(app);
socket.socketConnection(server);

(async () => {
  const devMode = process.env.NODE_ENV === "dev" || process.env.DEV;

  console.log(
    `Using ${
      devMode ? "DEVELOPMENT" : "PRODUCTION"
    } database as the default database.`,
  );

  await db.addConn("default", devMode ? testDbConfig : prodDbConfig);
  await db.addConn("prod", prodDbConfig);
  await db.addConn("diag", diagDbConfig);

  // OPTIONAL CONNECTIONS
  try {
    await db.addConn("dev", testDbConfig);
  } catch (error) {
    console.log("Unable to connect to the Dev SQL Server.");
  }

  try {
    await db.addConn("eclaims", devMode ? eClaimsConfigTest : eClaimsConfig);
  } catch (error) {
    console.log(
      "Unable to connect to the EClaims server. CF4 data dumping may fail.",
    );
  }

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());
  app.use(express.json());

  if (devMode) app.use(morgan("dev"));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });

  app.use(fileUpload());

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");
  app.set("view engine", "ejs");

  // Migrated //
  const clinicalAbstractRoutes = require("./routes/clinicalAbstractRoutes");
  const admissionRoutes = require("./routes/admissionRoutes");
  const trainingRoutes = require("./routes/trainingRoutes");
  const announcementsRoutes = require("./routes/announcementRoutes");
  const hospitalRoutes = require("./routes/hospitalRoutes");
  const paymentsRoutes = require("./routes/paymentRoutes");
  const resultRoutes = require("./routes/resultRoutes");
  const templateRoutes = require("./routes/templateRoutes");
  const libraryRoutes = require("./routes/libraryRoutes");
  const pdfRoutes = require("./routes/pdfRoutes");
  const purchaseRequestRoutes = require("./modules/purchase-request/routes/purchaseRequestRoutes");
  const accessRightRoutes = require("./modules/access-rights/routes/accessRightRoutes");
  const personnelRoutes = require("./modules/personnels/routes/personnelRoutes");
  const analyticsRoutes = require("./modules/analytics/routes/analyticsRoutes");
  const ehrStationViewRoutes = require("./modules/ehr-station-view/routes/ehrStationViewRoutes");
  const canvasRoutes = require("./modules/canvas/routes/canvasRoutes");
  const studentPortal = require("./modules/student-portal/routes/route");
  const geographyRoute = require("./routes/geographyRoutes");
  const entityRoute = require("./routes/entityRoutes");
  // const studentDocuments = require("./modules/student-documents/routes/route");
  const asventoRoutes = require("./modules/asvento/routes/route");
  const employeeCentralRoutes = require("./modules/employee-central/routes/route.js");
  const surveyRoutes = require("./routes/survey.js");
  // Migrated //

  const usersRoute = require("./routes/users");
  const employeesRoute = require("./routes/employees");
  const patientsRoute = require("./routes/patients");
  const doctorsRoute = require("./routes/doctors");
  const authRoute = require("./routes/auth");
  const eTriageRoute = require("./routes/e-triage");
  const emailRoute = require("./routes/email");
  const covidVaccination = require("./routes/covid-vaccination");
  const radiologyRoute = require("./routes/radiology");
  const itRoute = require("./routes/it");
  const ePatients = require("./routes/e-patients");
  const upload = require("./routes/upload");
  const monitoring = require("./routes/monitoring");
  const students = require("./routes/students");
  const smsRoute = require("./routes/sms");
  const empKioskRoute = require("./routes/emp-kiosk");
  const qnapRoute = require("./routes/qnap");
  const dohRoute = require("./routes/dohStatistics");
  const biomedRoute = require("./routes/biomed");
  const scholarshipRoute = require("./routes/scholarship");
  const viewImgRoute = require("./routes/view-img");
  const philhealthRoute = require("./routes/philhealth");
  const hrRoute = require("./routes/hr");

  // Ancillary Results Project //
  const ancillaryUserRoutes = require("./modules/ancillary-results/routes/userRoutes");
  const ancillaryDepartmentRoutes = require("./modules/ancillary-results/routes/departmentRoutes");
  const ancillaryChargeRoutes = require("./modules/ancillary-results/routes/chargeRoutes");
  const ancillaryTestOrderRoutes = require("./modules/ancillary-results/routes/testOrderRoutes");
  const ancillaryProcessFlowRoutes = require("./modules/ancillary-results/routes/processFlowRoutes");
  const ancillaryTestRoutes = require("./modules/ancillary-results/routes/testRoutes");
  const ancillaryTestTemplateRoutes = require("./modules/ancillary-results/routes/testTemplateRoutes");
  // Ancillary Results Project //

  // Employee Central //
  app.use(express.static("modules/employee-central/images"));
  app.use(express.static("modules/employee-central/uploaded"));
  // Employee Central //

  // Modular Routes //
  app.use("/images", express.static("images"));
  app.use("/announcements", announcementsRoutes);
  app.use("/library", libraryRoutes);
  app.use("/admission", admissionRoutes);
  app.use("/training", trainingRoutes);
  app.use("/hospital", hospitalRoutes);
  app.use("/payments", paymentsRoutes);
  app.use("/result", resultRoutes);
  app.use("/templates", templateRoutes);
  app.use("/clinical-abstract", clinicalAbstractRoutes);
  app.use("/pdf", pdfRoutes);
  app.use("/purchase-request", purchaseRequestRoutes);
  app.use("/access-right", accessRightRoutes);
  app.use("/personnels", personnelRoutes);
  app.use("/analytics", analyticsRoutes);
  app.use("/ehr-station-view", ehrStationViewRoutes);
  app.use("/canvas", canvasRoutes);
  app.use("/students", studentPortal);
  // app.use("/student-documents", studentDocuments)
  app.use("/asvento", asventoRoutes);
  app.use("/employee-central", employeeCentralRoutes);
  app.use("/survey", surveyRoutes);
  // Modular Routes //

  // Ancillary Results Project //
  app.use("/ancillary/users", ancillaryUserRoutes);
  app.use("/ancillary/departments", ancillaryDepartmentRoutes);
  app.use("/ancillary/charges", ancillaryChargeRoutes);
  app.use("/ancillary/test-orders", ancillaryTestOrderRoutes);
  app.use("/ancillary/process-flows", ancillaryProcessFlowRoutes);
  app.use("/ancillary/tests", ancillaryTestRoutes);
  app.use("/ancillary/test-templates", ancillaryTestTemplateRoutes);
  // Ancillary Results Project //

  app.use("/users", usersRoute);
  app.use("/employees", employeesRoute);
  app.use("/patients", patientsRoute);
  app.use("/doctors", doctorsRoute);
  app.use("/auth", authRoute);
  app.use("/etriage", eTriageRoute);
  app.use("/email", emailRoute);
  app.use("/radiology", radiologyRoute);
  app.use("/it", itRoute);
  app.use("/e-patients", ePatients);
  app.use("/upload", upload);
  app.use("/monitoring", monitoring);
  app.use("/students", students);
  app.use("/sms", smsRoute);
  app.use("/covid-vaccination", covidVaccination);
  app.use("/emp-kiosk", empKioskRoute);
  app.use("/qnap", qnapRoute);
  app.use("/doh", dohRoute);
  app.use("/biomed", biomedRoute);
  app.use("/scholarship", scholarshipRoute);
  app.use("/view-img", viewImgRoute);
  app.use("/philhealth", philhealthRoute);
  app.use("/hr", hrRoute);
  app.use("/geography", geographyRoute);
  app.use("/entity", entityRoute);

  // ROUTES

  app.get("/", (req, res) => {
    res.send({ message: "Welcome to UERM Rest LOCAL API" });
  });

  const port = devMode
    ? process.env.PORT_DEV
    : process.env.PORT ?? process.env.PORT_PROD;

  console.log(
    `App is running in ${devMode ? "DEVELOPMENT" : "PRODUCTION"} mode.`,
  );

  server.listen(port, () => {
    console.log(`Express server is listening on port ${port}.`);
  });

  // let socketDetails = io.on("connection", (socket) => {
  //   console.log("A user connected");

  //   socket.on("disconnect", () => {
  //     console.log("A user disconnected");
  //   });

  //   socket.on("rest-socket", function (data) {
  //     socket.broadcast.emit("chat message", data);
  //   });
  // });

  const server2 = require("http").createServer(app);
  const io = require("socket.io")(server2);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Event handler para sa pag-click sa student
    socket.on("studentClicked", (studentId) => {
      // Dito mo ise-send sa mga clients ang studentId na na-click
      io.emit("studentClicked", studentId);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  server2.listen(8000, () => {
    console.log("Socket Server running on port 8000");
  });
})();

// const server = app.listen(3000, () => {
//     const host = server.address().address
//     const port = server.address().port
//     console.log(`Running at ${host}:${port}`)
// })

// let httpServer = http.createServer(app);

// const httpServer = createServer(app);
// const io = new Server(httpServer, {});
// io.on("connection", (socket) => {
//   console.log(`connect ${socket.id}`);

//   socket.on("disconnect", (reason) => {
//     console.log(`disconnect ${socket.id} due to ${reason}`);
//   });

//   socket.on("news", function (data) {
//     console.log(typeof data);
//     console.log(data, "data");
//     var msg = data.description;
//     socket.broadcast.emit("newclientconnect", {
//       description: msg,
//     });
//   });
// });
// // httpServer.listen(3443);
// httpServer.listen(3000, () => {
//   console.log(`Server is running on port ${3000}`);
// });
// let httpsServer = https.createServer(
//   {
//     cert: certificate,
//     key: privateKey
//   },
//   app
// );

// const client = new WebSocket("ws://localhost:3000");

// client.on("open", () => {
//   // Causes the server to print "Hello"
//   client.send("Hello");
// });
// app.use('/covid-vaccination', function (req, res, next) {
//   req.websocketConfig = {
//       wss: wss
//   };
//   next();
// }, covidVaccination);

// httpsServer.listen(3443);

// const server2 = require("http").createServer(app);
// const io = require("socket.io")(server2);

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Event handler para sa pag-click sa student
//   socket.on("studentClicked", (studentId) => {
//     // Dito mo ise-send sa mga clients ang studentId na na-click
//     io.emit("studentClicked", studentId);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// server2.listen(8000, () => {
//   console.log("Server running on port 3000");
// });
