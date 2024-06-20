import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();
import * as db from "./utils/database.js";

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

// Common handler function to render pages with projects data
async function renderProjectsPage(req, res, next, template, limit = null) {
  try {
    await db.connect();
    let projects = await db.getAllProjects();
    if (limit) {
      projects = projects.slice(0, limit);
    }
    res.render(template, { projectArray: projects });
  } catch (error) {
    next(error);
  }
}

// Route for the index page
app.get("/", (req, res, next) => {
  renderProjectsPage(req, res, next, "index.ejs", 3);
});

// Route for the projects page
app.get("/projects", (req, res, next) => {
  renderProjectsPage(req, res, next, "projects.ejs");
});

// Route for individual project pages
app.get("/project/:id", async (req, res, next) => {
  try {
    await db.connect();
    let projects = await db.getAllProjects();
    let id = parseInt(req.params.id, 10);

    console.log("Projects: ", projects); // Debugging line to log all projects
    console.log("Project ID: ", id); // Debugging line to log the requested project ID

    if (id > 0 && id <= projects.length) {
      const project = projects.find(p => p.id === id);
      console.log("Project: ", project); // Debugging line to log the found project
      res.render("project.ejs", { project: project, which: id });
    } else {
      next(new Error("No project with that ID"));
    }
  } catch (error) {
    next(error);
  }
});

// Route for the about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// Route for the contact page
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

// Route for sending mail
app.post("/mail", async (req, res) => {
  try {
    await utils.sendMessage(req.body.sub, req.body.txt);
    res.send({ result: "success" });
  } catch {
    res.send({ result: "failure" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  let msg = err.message !== "No project with that ID" ? "Oops! There was an internal error." : err.message;
  res.render("error.ejs", { msg: msg });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
