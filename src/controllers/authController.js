import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import Promise from 'bluebird'
import { UserModel } from '../models/user';
import modelFactory from '../models/modelFactory';
import config from '../config/index';
import responseHandler from '../helpers/responseHandler';

const checkAuth = async(req, res) => {
    try {
        await _checkAuth(req);
        res.sendStatus(httpStatus.OK);
    } catch (err) {
        res.sendStatus(httpStatus.UNAUTHORIZED);
    }
};

const createUserIfNotExists = async (req, res) => {
    const user = await UserModel.where({ username: req.body.username }).findOne();
    try {
        if (!_.isNull(user)) {
            res.sendStatus(httpStatus.CONFLICT);
        } else {
            const newUser = modelFactory.createUser(req.body);
            await newUser.save();
            res.sendStatus(httpStatus.CREATED);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

const getToken = async (req, res) => {
    try {
        await _checkAuth(req);
    } catch (err) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const token = jwt.sign({ username: req.body.username }, config.jwtSecret);
    responseHandler.handleResponse(res, { token });
};

const _checkAuth = (req) => {
    return new Promise((resolve, reject) => {
        UserModel.where({ username: req.body.username, password: req.body.password }).findOne()
            .then((user) => {
                if (_.isUndefined(user) || _.isNull(user)) {
                    reject(new Error("Invalid credentials"));
                } else {
                    resolve();
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default { checkAuth, createUserIfNotExists, getToken };