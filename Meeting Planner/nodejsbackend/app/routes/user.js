const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const calenderController = require("./../../app/controllers/calenderController");
const appConfig = require("./../../config/appConfig")
const auth = require('../middlewares/authmiddleware');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}`;




    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
         @apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
    */

    // auth token params: userId.
    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
        @apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
    */


    app.post(`${baseUrl}/signup`, userController.signUpFunction);

/**
 * @apiGroup users
 * @apiVersion  1.0.0
 * @api {post} /api/v1/signup api for user signup.
 *
 * @apiParam {string} email email of the user. (body params) (required)
 * @apiParam {string} password password of the user. (body params) (required)
 * @apiParam {string} firstName firstName of the user. (body params) (required)
 * @apiParam {string} lastName lastName of the user. (body params) (required)
 * @apiParam {string} mobileNumber mobileNumber of the user. (body params) (required)
 * @apiParam {string} userType userType of the user. (body params) (required)
 *
 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-Response:
     {
        "error": false,
        "message": "User Created",
        "status": 200,
        "data": {
            "CreatedOn": "2018-11-20T09:32:50.000Z"
            "mobileNumber": 2234435524,
            "email": "someone@mail.com",
            "lastName": "Sengar",
            "firstName": "Rishabh",
            "userId": "-E9zxTYA8",
            "userType": "User",
            "resetPassword": "",
            "resetPasswordCreation": ""
    }
      @apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
*/



app.post(`${baseUrl}/forgot`, userController.forgotPassword);

/**
 * @apiGroup users
 * @apiVersion  1.0.0
 * @api {post} /api/v1/forgot api for user forgot.
 *
 * @apiParam {string} appurl appurl of the user. (body params) (required)
 * @apiParam {string} email email of the user. (body params) (required)
 *
 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-Response:
     {
        "error": false,
        "message": "email sent",
        "status": 200,
        "data": {
            "Token": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
            "email": "someone@mail.com",
        }

    }
        @apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
*/


app.post(`${baseUrl}/savePassword`, userController.savePassword);

/**
 * @apiGroup users
 * @apiVersion  1.0.0
 * @api {post} /api/v1/savePassword api for save Password.
 *
 * @apiParam {string} email email of the user. (body params) (required)
 * @apiParam {string} password password of the user. (body params) (required)
 *
 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-Response:
     {
        "error": false,
        "message": "updated user",
        "status": 200,
        "data": {
            "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
            "userDetails": {
            "mobileNumber": 2234435524,
            "email": "someone@mail.com",
            "lastName": "Sengar",
            "firstName": "Rishabh",
            "userId": "-E9zxTYA8"
        }

    }
        @apiErrorExample {object} Error-Response:
     *
     * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
*/

app.post(`${baseUrl}/mail`, userController.sendMail);

/**
 * @apiGroup users
 * @apiVersion  1.0.0
 * @api {post} /api/v1/mail api for mail.
 *
 * @apiParam {string} authToken authToken of the user. (body params) (required)
 * @apiParam {string} userId userId of the user. (body params) (required)
 * @apiParam {string} message message of the user. (body params) (required)
 *
 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-Response:
     {
        "error": false,
        "message": "mail Sent",
        "status": 200,
        "data": {
            "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
            "userDetails": {
            "mobileNumber": 2234435524,
            "email": "someone@mail.com",
            "lastName": "Sengar",
            "firstName": "Rishabh",
            "userId": "-E9zxTYA8"
        }

    }
        @apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
*/

app.post(`${baseUrl}/userlist`, auth.isAuthorized, userController.userList);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/userlist api for user List.
     *
     * @apiParam {string} authToken email of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Success",
            "status": 200,
            "data": [
                {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }, {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }
        ]
        }
        @apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
    */

app.post(`${baseUrl}/setuserEvents`, auth.isAuthorized, calenderController.setuserEvents);

/**
 * @apiGroup users
 * @apiVersion  1.0.0
 * @api {post} /api/v1/setuserEvents api for set user Events.
 *
 * @apiParam {string} authToken authToken of the user. (body params) (required)
 * @apiParam {string} events events of the user. (body params) (required)
 * @apiParam {string} adminemail adminemail of the user. (body params) (required)
 * @apiParam {string} adminId adminId of the user. (body params) (required)
 * @apiParam {string} useremail useremail of the user. (body params) (required)
 * @apiParam {string} userId userId of the user. (body params) (required)
 *
 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-Response:
     {
        "error": false,
        "message": "Success",
        "status": 200,
        "data": {
            adminId: "ZfWxARf26"
            adminemail: "chinnari.bhuvanesh@gmail.com"
            createdOn: "2018-11-20T11:24:11.995Z"
            events: (2) [{…}, {…}]
            modifiedOn: "2018-11-20T11:24:11.995Z"
            seen: false
            userId: "Cbfpt6LQB"
            useremail: "superior@gmail.com"
        }

    }
    *@apiErrorExample {object} Error-Response:
        *
        * {
            "error": true,
            "message": "Error Occured",
            "status": 500,
            "data": null
        }
*/

    app.post(`${baseUrl}/getuserEvents`, auth.isAuthorized, calenderController.getuserEvents);

/**
  * @apiGroup users
  * @apiVersion  1.0.0
  * @api {post} /api/v1/getuserEvents api for get user Events.
  *
  * @apiParam {string} authToken authToken of the user. (body params) (required)
  * @apiParam {string} adminemail adminemail of the user. (body params) (required)
  * @apiParam {string} useremail useremail of the user. (body params) (required)
  *
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
      {
         "error": false,
         "message": "Success",
         "status": 200,
         "data": {
             adminId: "ZfWxARf26"
             adminemail: "chinnari.bhuvanesh@gmail.com"
             createdOn: "2018-11-20T11:24:11.995Z"
             events: (2) [{…}, {…}]
             modifiedOn: "2018-11-20T11:24:11.995Z"
             seen: false
             userId: "Cbfpt6LQB"
             useremail: "superior@gmail.com"
         }
 
     }
 * @apiErrorExample {object} Error-Response:
     *
     * {
         "error": true,
         "message": "Error Occured",
         "status": 500,
         "data": null
        }
 */

    app.post(`${baseUrl}/getOnlyUserEvents`, auth.isAuthorized, calenderController.getOnlyUserEvents);

 /**
  * @apiGroup users
  * @apiVersion  1.0.0
  * @api {post} /api/v1/getOnlyUserEvents api for getOnlyuserEvents.
  *
  * @apiParam {string} authToken authToken of the user. (body params) (required)
  * @apiParam {string} userId userId of the user. (body params) (required)
  * @apiParam {string} useremail useremail of the user. (body params) (required)
  *
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
      {
         "error": false,
         "message": "Success",
         "status": 200,
         "data": {
             adminId: "ZfWxARf26"
             adminemail: "chinnari.bhuvanesh@gmail.com"
             createdOn: "2018-11-20T11:24:11.995Z"
             events: (2) [{…}, {…}]
             modifiedOn: "2018-11-20T11:24:11.995Z"
             seen: false
             userId: "Cbfpt6LQB"
             useremail: "superior@gmail.com"
         }
 
     }
   * @apiErrorExample {object} Error-Response:
       *
       * {
          "error": true,
          "message": "Error Occured",
          "status": 500,
          "data": null
      }
 */

app.post(`${baseUrl}/deleteuserEvents`, auth.isAuthorized, calenderController.deleteuserEvents);

    /**
   * @apiGroup users
   * @apiVersion  1.0.0
   * @api {post} /api/v1/deleteuserEvents api for delete user Events.
   *
   * @apiParam {string} authToken authToken of the user. (body params) (required)
   * @apiParam {string} adminemail adminemail of the user. (body params) (required)
   * @apiParam {string} useremail useremail of the user. (body params) (required)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
          "error": false,
          "message": "Success",
          "status": 200,
          "data": null
  
      }
       @apiErrorExample {object} Error-Response:
       *
       * {
          "error": true,
          "message": "Error Occured",
          "status": 500,
          "data": null
      }
  */

app.post(`${baseUrl}/delete`, auth.isAuthorized, calenderController.deleteEvents);

    /**
* @apiGroup users
* @apiVersion  1.0.0
* @api {post} /api/v1/delete api for delete.
*
* @apiParam {string} email email of the user. (body params) (required)
* @apiParam {string} password password of the user. (body params) (required)
*
* @apiSuccess {object} myResponse shows error status, message, http status code, result.
* 
* @apiSuccessExample {object} Success-Response:
 {
    "error": false,
    "message": "Success",
    "status": 200,
    "data": null

}
 @apiErrorExample {object} Error-Response:
 *
 * {
      "error": true,
      "message": "Error Occured",
      "status": 500,
      "data": null
    }
*/

}
