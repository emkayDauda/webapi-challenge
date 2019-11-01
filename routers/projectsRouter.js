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

function projectBodyValidator(req, res, next) {
    const { name, description, completed } = req.body;
    if(!Object.keys(req.body).length){
        res.status(400).json("Request body missing")
    } else if (!name || !description || !completed) 
        res.status(400).json("Please pass in name, description and a completed status for project")
    else if (typeof(completed) !== 'boolean'){
        res.status(400).json("is `completed` a boolean, you tool?")
    } else {
        req.valProject = {name, description, completed}
        next()
    }
}

module.exports = project;