"use strict";
var jwt = require("jsonwebtoken");
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const user = db.admin;
const utility = require("../helpers/utility");
const validation = require("../helpers/validation");
const Constant = require("../config/constant");
let users = {};

users.userRegistration = async function (req, res) {
  try {
    let userData = await validation.checkUserData(req.body);
    if (userData.message) {
      return res.status(Constant.ERROR_CODE).json({
        code: Constant.ERROR_CODE,
        massage: Constant.INVAILID_DATA,
        data: userData.message,
      });
    } else {
      userData.verification_token = utility.randomString(24);
      let result = await user.findAll({
        where: {
          email: userData.email,
        },
      });
      if (result.length > 0) {
        return res.status(Constant.FORBIDDEN_CODE).json({
          code: Constant.FORBIDDEN_CODE,
          massage: Constant.EMAIL_ALREADY_REGISTERED,
          data: null,
        });
      } else {
        userData.password = bcrypt.hashSync(userData.password, salt);
        let result = await user.create(userData);
        return res.status(Constant.SUCCESS_CODE).json({
          code: Constant.SUCCESS_CODE,
          massage: Constant.USER_SAVE_SUCCESS,
          data: result,
        });
      }
    }
  } catch (err) {
    return res.status(Constant.ERROR_CODE).json({
      code: Constant.ERROR_CODE,
      massage: Constant.SOMETHING_WENT_WRONG,
      data: null,
    });
  }
};

users.userLogin = async (req, res) => {
  try {
    let { userName, password } = req.body;
    let userData = {
      userName: userName,
      password: password
    };
    console.log(userData)
    let data = await validation.userLogin(userData);

    if (data.message) {
      return res.status(Constant.ERROR_CODE).json({
        code: Constant.ERROR_CODE,
        massage: Constant.INVAILID_DATA,
        data: data.message,
      });
    } else {
      let result = await user.findOne({
        where: {
          email: userName,
        },
      });
      console.log(user.email)

      if(bcrypt.compareSync(password, result.password)){
        let params = {
          userId: result.id,
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
        };
        params.jwtToken = jwt.sign(params, process.env.SECRET);
        return res.status(Constant.SUCCESS_CODE).json({
          code: Constant.SUCCESS_CODE,
          massage: Constant.USER_LOGIN_SUCCESS,
          data: params,
        });
      }else{
        return res.status(Constant.FORBIDDEN_CODE).json({
          code: Constant.FORBIDDEN_CODE,
          massage: Constant.USER_EMAIL_PASSWORD,
          data: null,
        })
      }
    }
    }catch (error) {
    return res.status(Constant.ERROR_CODE).json({
      code: Constant.ERROR_CODE,
      massage: Constant.SOMETHING_WENT_WRONG,
      data: null,
    });
  }
};

users.uplodeImages = async (req, res) => {
  try {
    let { userId} = req.body;
    let img = "";
    user
      .findOne({
        where: {
          id: userId,
        },
      })
      .then(async (result) => {
        if (result) {
          if (req.files) {
            img = await utility.fileupload(req.files);

            let userData = {
              image: img,
            };
            result.update(userData);
          }

          return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            massage: Constant.USER_DATA_UPDATE_SUCCESS,
            data: result,
          });
        } else {
          return res.status(Constant.ERROR_CODE).json({
            code: Constant.ERROR_CODE,
            massage: Constant.USER_RESET_PASSWORD,
            data: null,
          });
        }
      });
  } catch (error) {
    return res.status(Constant.ERROR_CODE).json({
      code: Constant.ERROR_CODE,
      massage: Constant.USER_RESET_PASSWORD,
      data: null,
    });
  }
};
module.exports = users;
