const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const appConfig = require("./src/config/main-config.js");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//initialize node app
appConfig.init(app, express);

// API calls
const staticRoutes = require("./routes/static");
const userRoutes = require("./routes/users");
const listRoutes = require("./routes/lists");
const itemRoutes = require("./routes/items");

app.use("/", staticRoutes);
app.use("/", userRoutes);
app.use("/", listRoutes);
app.use("/", itemRoutes);

// Server static assets if in production

if (process.env.NODE_ENV === "production") {
  // Set static files
  app.use(express.static("client/build"));
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
