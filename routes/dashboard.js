const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const {years, semesters} = require('./config');

/**
 * localhost:8082/dashboard?username=NAME&password=PW
 */
router.get('/', function (req, res, next) {
    if (req.query.username === undefined || req.query.username === '' || req.query.password === undefined || req.query.password === '') {
        res.render('error', {
            message: 'LOGIN FAILED',
            error: 'Username or password is null.'
        });
        return;
    }
    fetch('http://localhost:8080/get-user-by-username', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"username": req.query.username})
    })
        .then(resp =>  resp.json())
        .then(user => {
            if (user.password === req.query.password) {
                switch (user.privilege) {
                    case 2:
                        res.render('dashboard-admin', {
                            uid: user.id,
                            username: user.username,
                            fullName: user.firstName + ' ' + user.lastName,
                            gender: user.gender,
                            email: user.email
                        });
                        break;
                    case 1:
                        res.render('dashboard-lecturer', {
                            uid: user.id,
                            username: user.username,
                            fullName: user.firstName + ' ' + user.lastName,
                            gender: user.gender,
                            email: user.email
                        });
                        break;
                    case 0:
                        res.render('dashboard-student', {
                            uid: user.id,
                            username: user.username,
                            fullName: user.firstName + ' ' + user.lastName,
                            gender: user.gender,
                            email: user.email
                        });
                        break;
                    default:
                        res.render('error', {
                            message: 'LOGIN FAILED',
                            error: 'Unknown privilege weight.'
                        });
                        break;
                }
            } else {
                res.render('error', {
                    message: 'LOGIN FAILED',
                    error: 'Username or password error.'
                });

            }
        })
        .catch(e => {
        res.render('error', {
            message: 'LOGIN FAILED',
            error: `Unexpected error occurred. (${e})`
        });
    });
});

router.get('/report', function (req, res, next) {
    if (req.query.username === undefined || req.query.username === '' || req.query.password === undefined || req.query.password === '') {
        res.render('error', {
            message: 'USERNAME OR PASSWORD ERROR!',
            error: {status: 'Forbid', stack: 'NULL'}
        });
        return;
    }
    fetch('http://localhost:8080/get-user-by-username', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"username": req.query.username})
    })
        .then(resp => {
            if (resp.body === undefined || resp.body === '') {
                res.render('error', {
                    message: 'USERNAME OR PASSWORD ERROR!',
                    error: {status: 'Forbid', stack: 'NULL'}
                });
                return undefined;
            } else {
                return resp.json();
            }
        })
        .then(user => {
            if (user.password === req.query.password) {
                switch (user.privilege) {
                    case 0:
                        res.render('report', {
                            uid: user.id,
                            username: user.username,
                            fullName: user.firstName + ' ' + user.lastName,
                            gender: user.gender,
                            email: user.email
                        });
                        break;
                    default:
                        res.render('error', {
                            message: 'USERNAME OR PASSWORD ERROR!',
                            error: {status: 'Forbid', stack: 'NULL'}
                        });
                        break;
                }
            }
        });
});

router.get('/get-identity', function (req, res, next) {
    if (req.query.username === undefined || req.query.username === '') {
        res.render('error', {
            message: 'VOID USERNAME!',
            error: {status: 'Forbid', stack: 'NULL'}
        });
        return;
    }
    fetch('http://localhost:8080/get-user-by-username', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"username": req.query.username})
    })
        .then(resp => {
            if (resp.body === undefined || resp.body === '') {
                res.render('error', {
                    message: 'USERNAME OR PASSWORD ERROR!',
                    error: {status: 'Forbid', stack: 'NULL'}
                });
                return undefined;
            } else {
                return resp.json();
            }
        }).then(user => res.json(user));
});

router.get('/get-grades', function (req, res, next) {
    // todo: replace local verification with fetch
    fetch('http://localhost:8080/grades')
        .then(resp => resp.json())
        .then(modules => {
            console.log(modules["_embedded"]["gradeList"]);
            res.json(modules["_embedded"]["gradeList"])
        });
});

/**
 * Method deprecated.
 * localhost:8082/dashboard/get-grades-by-uid?uid=NaN
 */
router.get('/get-grades-by-uid', function (req, res, next) {
    res.json({message: 'Method deprecated.'})
});

/**
 * localhost:8082/dashboard/get-grades-by-sid?sid=NaN
 */
router.get('/get-grades-by-sid', function (req, res, next) {
    fetch('http://localhost:8080/get-grades-by-sid', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"sid": req.query.sid})
    })
        .then(resp => {
            if (resp.body === undefined || resp.body === '') {
                res.render('error', {
                    message: 'UNABLE TO FIND GRADES!',
                    error: {status: 'Forbid', stack: 'NULL'}
                });
                return undefined;
            } else {
                return resp.json();
            }
        })
        .then(grades => {
            try {
                res.json(grades['_embedded']['gradeList']);
            } catch (e) {
                res.render('error', {
                    message: 'UNABLE TO FIND GRADES!',
                    error: e
                });
            }
        });
});

/**
 * localhost:8082/dashboard/get-grades-by-mid?mid=NaN
 */
router.get('/get-grades-by-mid', function (req, res, next) {
    fetch('http://localhost:8080/get-grades-by-mid', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"mid": req.query.mid})
    })
        .then(resp => {
            if (resp.body === undefined || resp.body === '') {
                res.render('error', {
                    message: 'UNABLE TO FIND GRADES!',
                    error: {status: 'Forbid', stack: 'NULL'}
                });
                return undefined;
            } else {
                return resp.json();
            }
        })
        .then(grades => {
            try {
                res.json(grades['_embedded']['gradeList']);
            } catch (e) {
                res.render('error', {
                    message: 'UNABLE TO FIND GRADES!',
                    error: e
                });
            }
        });
});

/**
 * localhost:8082/dashboard/get-grades-by-lid?lid=NaN
 */
router.get('/get-grades-by-lid', function (req, res, next) {
    fetch('http://localhost:8080/get-grades-by-lid', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"lid": req.query.lid})
    })
        .then(resp => {
            if (resp.body === undefined || resp.body === '') {
                res.render('error', {
                    message: 'UNABLE TO FIND GRADES!',
                    error: {status: 'Forbid', stack: 'NULL'}
                });
                return undefined;
            } else {
                return resp.json();
            }
        })
        .then(grades => {
            try {
                res.json(grades['_embedded']['gradeList']);
            } catch (e) {
                res.render('error', {
                    message: 'UNABLE TO FIND GRADES!',
                    error: e
                });
            }
        });
});

/**
 * localhost:8082/dashboard/update-grade?gid=NaN&mid=NaN&sid=NaN&lid=NaN&grade=NaN&year=NaN&semester=NaN
 *
 * {
        "id": 55,
        "mid": 10,
        "sid": 29,
        "lid": 32,
        "grade": 12.3,
        "year": 2020,
        "semester": 1
    }
 */
router.get('/update-grade', function (req, res, next) {
    if (req.query.gid === undefined || req.query.gid === '' || req.query.grade === undefined || req.query.grade === '') {
        res.json({
            error: "invalid parameters"
        });
    } else {
        fetch(`http://localhost:8080/grades/${req.query.gid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({

                "mid": req.query.mid,
                "sid": req.query.sid,
                "lid": req.query.lid,
                "grade": req.query.grade,
                "year": req.query.year,
                "semester": req.query.semester

            })
        })
            .then(resp => {
                if (resp.body === undefined || resp.body === '') {
                    res.render('error', {
                        message: 'UNABLE TO FIND GRADES!',
                        error: {status: 'Forbid', stack: 'NULL'}
                    });
                    return undefined;
                } else {
                    return resp.json();
                }
            })
            .then(grades => {
                if (grades === undefined) {
                    res.json({status: "update failed"});
                } else {
                    res.json({status: "update success"});
                }

            });
    }

});

router.get('/get-modules', function (req, res, next) {
    // todo: replace local verification with fetch
    fetch('http://localhost:8080/modules')
        .then(resp => resp.json())
        .then(modules => res.json(modules["_embedded"]["moduleList"]));
});

router.get('/get-module-by-mid', function (req, res, next) {
    // todo: replace local verification with fetch
    fetch(`http://localhost:8080/modules/${req.query.mid}`)
        .then(resp => resp.json())
        .then(modules => res.json(modules));
});

router.post('/get-module-by-moduleName', function (req, res, next) {
    // todo: replace local verification with fetch
    // console.log(req.body.moduleName);


        fetch(`http://localhost:8080/get-module-by-name`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name": req.body.name})
        })
            .then(resp => {
                if (resp.status === 200) {
                    return resp.json();
                } else {
                    return {};
                }
            })
            .then(grades => {
                // console.log((grades.name === undefined) ? 'Null' : grades);
                res.json(grades);
            });

});

/**
 * localhost:8082/dashboard/get-user-by-uid?uid=NaN
 */
router.get('/get-user-by-uid', function (req, res, next) {
    fetch(`http://localhost:8080/users/${req.query.uid}`)
        .then(resp => resp.json())
        .then(user => res.json(user));
});

module.exports = router;
