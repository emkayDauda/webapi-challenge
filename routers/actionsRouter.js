const express = require("express");

const projectsDbHelper = require("../data/helpers/projectModel");
const actionsDbHelper = require("../data/helpers/actionModel");

const actionRouter = express.Router();

actionRouter.get("/", (req, res) => {
  actionsDbHelper
    .get()
    .then(actions => res.status(201).json(actions))
    .catch(err =>
      res.status(500).json({
        error: true,
        message: err.message
      })
    );
});

actionRouter.get('/:id', actionIdValidator, (req, res) => {
    res.status(201).json(req.valAction)
})

actionRouter.post('/', [projectIdValidator, actionBodyValidator], (req, res) => {
    actionsDbHelper.insert({
        "project_id": req.valProject.id,
        ...req.valActionBody
    })
    .then(createdAction => res.status(201).json({
        error: false,
        message: "Success",
        data: createdAction
    }))
    .catch(err =>
        res.status(500).json({
          error: true,
          message: err.message
        })
      );
})

function actionIdValidator(req, res, next) {
    const { id } = req.params;
    actionsDbHelper
      .get(id)
      .then(action => {
        if (action) {
          req.valAction = action;
          next();
        } else
          res.status(404).json({
            err: true,
            message: "Action with that ID not found"
          });
      })
      .catch(err =>
        res.status(500).json({
          error: err.message,
          message: "An error occurred while fetching from database"
        })
      );
}

function actionBodyValidator(req, res, next) {
    const {project_id, description, notes} = req.body;

    if(!Object.keys(req.body).length){
        res.status(400).json({
            error: true,
            message: "Request body missing"
        })
    } else if (!project_id || !description || !notes) {
        res.status(400).json({
            error: true,
            message: "project_id, description and notes are required fields"
        })
    } else {
        req.valActionBody = {project_id, description, notes}
        next()
    }
}

function projectIdValidator(req, res, next) {
  const id = req.params.id || req.body.project_id;
  projectsDbHelper
    .get(id)
    .then(project => {
      if (project) {
        req.valProject = project;
        next();
      } else
        res.status(404).json({
          err: true,
          message: "Project with that ID not found"
        });
    })
    .catch(err =>
      res.status(500).json({
        error: err.message,
        message: "An error occurred while fetching from database"
      })
    );
}

module.exports = actionRouter;
