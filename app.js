const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const learningCSV = "learning.csv";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/load-learning", (req, res) => {
  try {
    const csvData = fs.readFileSync(learningCSV, "utf8");
    res.send(csvData);
  } catch (err) {
    let defaultRecords = "";
    const numRows = 529;
    const numColumns = 5;
    for (let i = 0; i < numRows; i++) {
      defaultRecords += "1";
      for (let j = 0; j < numColumns - 1; j++) {
        defaultRecords += ",1";
      }
      defaultRecords += "\n";
    }
    res.send(defaultRecords);
  }
});

app.post("/save-learning", async (req, res) => {
  const dataArray = req.body;
  const csvData = dataArray.map((row) => row.join(",")).join("\n");

  fs.writeFile(learningCSV, csvData, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
      res.status(500).send("Error writing CSV file");
    } else {
      console.log("CSV file saved successfully");
      res.send("CSV file saved successfully");
    }
  });
});

// app.post("/budgetary-pdf", async (req, res) => {
//   try {
//     const values = {
//       document: req.body.document || "",
//       ref_no: req.body.ref_no || "",
//       date: req.body.date || "",
//       name: req.body.name || "",
//       address: req.body.address || "",
//       contact: req.body.contact || "",
//       gst_no: req.body.gst_no || "",
//       from: req.body.from || "",
//       to: req.body.to || "",
//       purpose: req.body.purpose || "",
//       height: req.body.height || "",
//       width: req.body.width || "",
//       pixel_pitch_x: req.body.pixel_pitch_x || "",
//       pixel_pitch_y: req.body.pixel_pitch_y || "",
//       sq_ft: req.body.sq_ft || "",
//       rate: req.body.rate || "",
//       day: req.body.day || "",
//       amount: req.body.amount || "",
//       discount: req.body.discount || "",
//       discounted_price: req.body.discounted_price || "",
//       transportation: req.body.transportation || "",
//       tax: req.body.tax || "",
//       total_amount: req.body.total_amount || "",
//     };

//     const pdfPath = await pdfGenerator.editPDF(values);

//     if (!pdfPath) {
//       return res.status(500).send("Failed to generate PDF");
//     }

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${values.document}"`
//     );
//     res.setHeader("Content-Type", "application/pdf");

//     res.download(pdfPath, `${values.document}.pdf`, (err) => {
//       if (err) {
//         res.status(404).send("Download Error");
//       }
//     });

//     // fs.unlink(pdfPath, (err) => {
//     //   if (err) {
//     //     console.error("Error deleting file:", err);
//     //   }
//     // });
//   } catch (error) {
//     console.error("Error processing:", error);
//     res.status(500).send(`Server Error`);
//   }
// });

// app.get("/quotation", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "quotation.html"));
// });

// app.get("/budgetary", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "budgetary.html"));
// });

// app.get("/projects", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "projects.html"));
// });

// async function serveEmployeePages() {
//   client = new MongoClient(uri, options);
//   await client.connect();

//   const db = client.db("rcx");
//   const collection = db.collection("employees");

//   const cursor = collection.find();
//   const employees = await cursor.toArray();

//   employees.forEach((employee) => {
//     app.get(`/${employee.coded_id}`, (req, res) => {
//       let htmlContent = fs.readFileSync(
//         path.join(__dirname, "public", "employee.html"),
//         "utf-8"
//       );
//       htmlContent = htmlContent.replace("|employee-name|", `${employee.name}`);
//       htmlContent = htmlContent.replace("|employee-name|", `${employee.name}`);
//       htmlContent = htmlContent.replace(
//         "|employee-designation|",
//         `${employee.designation}`
//       );
//       htmlContent = htmlContent.replace(
//         "|employee-phone|",
//         `${employee.phone}`
//       );
//       htmlContent = htmlContent.replace(
//         "|employee-phone|",
//         `${employee.phone}`
//       );
//       htmlContent = htmlContent.replace("|employee-dob|", `${employee.dob}`);
//       htmlContent = htmlContent.replace(
//         "|employee-join_date|",
//         `${employee.join_date}`
//       );
//       htmlContent = htmlContent.replace(
//         "|employee-expiry_date|",
//         `${employee.expiry_date}`
//       );
//       res.setHeader("Content-Type", "text/html");
//       res.send(htmlContent);
//     });
//   });

//   if (client) {
//     client.close();
//   }
// }
// serveEmployeePages();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
