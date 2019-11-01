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

module.exports = project;