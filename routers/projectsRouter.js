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
    res.status(200).json(req.valProject)
})

project.post('/', projectBodyValidator, (req, res) => {
    projectsModel.insert(req.valProjectBody)
    .then(insertedProject => {
        res.status(200).json(insertedProject)
    })
    .catch(err => res.status(500).json({
        error: true,
        message: err.message
    }))
})

project.delete('/:id', projectIdValidator, (req, res) => {
    projectsModel.remove(req.valProject.id)
    .then(flag => {
        if (flag) {
            res.status(201).json({
                error: false,
                message: "Deleted successfully",
                data: req.valProject
            })
        }
    })
})

project.put('/:id', [projectIdValidator, projectBodyValidator], (req, res) => {
    projectsModel.update(req.valProject.id, req.valProjectBody)
    .then(flag => {
        if(flag) {
            res.status(200).json({
                error: false,
                id: req.valProject.id, 
                ...req.valProjectBody})
        } else res.status(200).json({error: true, message: 'Failed to delete'})
    })
    .catch(err => res.status(500).json({
        error: true,
        message: err.message
    }))
})

function projectIdValidator(req, res, next) {
    const { id } = req.params;
    projectsModel.get(id)
    .then(project => {
        if (project) {
            req.valProject = project;
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
        req.valProjectBody = {name, description, completed}
        next()
    }
}

module.exports = project;