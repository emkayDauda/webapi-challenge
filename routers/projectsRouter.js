const express = require('express')
const projectsModel = require('../data/helpers/projectModel')
const project = express();

project.get('/', (req, res) => {
    projectsModel.get()
    .then(projects => {
        res.status(200).json(projects)
    })
    .catch(err => res.status(500).json({
        error: err.message,
        message: 'An error occurred while fetching from database'
    }))
})

project.get('/:id', projectIdValidator, (req, res) => {
    res.status(200).json(res.valProject)
})

function projectIdValidator(req, res, next) {
    const { id } = req.params;
    projectsModel.get(id)
    .then(project => {
        if (project) {
            res.valProject = project;
            next();
        } else res.status(404).json({
            err: true,
            message: "Project with that ID not found"
        })
    })
    .catch(err => res.status(500).json({
        error: err.message,
        message: 'An error occurred while fetching from database'
    }))
}

module.exports = project;