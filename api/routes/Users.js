const express = require('express');
const User = require('../models').Users
const authenticate = require('../middleware/authenticate');
const { where } = require('sequelize');


const Router = express.Router();

Router.get('/users', authenticate, async (req, res, next)=>{
    try {
        const users = await User.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt']},
            where: {
                id: req.currentUser.id
            }
        });
        res.status(200).send(users);
    } catch (error) {
        next(error)
    }
})

Router.post('/users', async (req, res, next)=>{
    try {
        const incompleteError = new Error('Please provide: first and last name, an valid email and password')
        incompleteError.status = 400;
        if(JSON.stringify(req.body) === '{}') throw incompleteError;

        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        });

        const result = await User.findOne({ where: { emailAddress: user.emailAddress }, attributes: {exclude: ['password', 'createdAt', 'updatedAt']}})

        res.location('/').status(201).send(result);
    } catch (error) {
        next(error)
    }
})

module.exports = Router;