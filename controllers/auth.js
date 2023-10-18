const Joi = require('joi')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')
const jwt = require('jsonwebtoken');

const authController = {
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log({ username, password })
            if (username === process.env.USER_USERNAME && password === process.env.USER_PASSWORD) {
                const accessToken = jwt.sign({ username, password }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
                })
                return res.status(200).json({
                    status: 'success',
                    data: accessToken
                });
            } else {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Invalid credentials',
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 'fail',
                message: error.message,
            });
        }
    }
}

module.exports = authController;