var step = require('step');
var validator = require('validator');
var logger = require('../../common/logger.js');
var mysql = require('../../common/mysql.js');
var responsor = require('../../common/responsor.js');
var common = require('../../common/common.js');
var Constants = require('../../common/constants.js');

module.exports = function (req, res) {

    var connection, result = {};

    var session = common.checkSession(req);
    if (session.err !== undefined)
        return responsor(session.err, res);

    var params = common.checkRequest(req, ["year", "ownerType"]);
    if (params.err !== undefined)
        return responsor(params.err, res);

    if (Constants.CONSTRAINTS.OWNER_TYPE.indexOf(params.ownerType) < 0)
        return responsor(common.error(3), res);

    step(
        function () {
            mysql.getConnection(this);
        },
        function (err, conn) {
            if (err) throw err;

            connection = conn;

            var startTimestamp, endTimestamp;

            if (params.month !== undefined && params.day !== undefined) {
                startTimestamp = common.makeUnixTime(params.year, params.month, params.day);
                endTimestamp = common.makeUnixTime(params.year, params.month, params.day + 1);
            }
            else if (params.month !== undefined) {
                startTimestamp = common.makeUnixTime(params.year, params.month, 1);
                endTimestamp = common.makeUnixTime(params.year, params.month + 1, 1);
            }
            else {
                startTimestamp = common.makeUnixTime(params.year, 1, 1);
                endTimestamp = common.makeUnixTime(params.year + 1, 1, 1);
            }

            var query = mysql.makeQuery('call spViewBills(%d,%d,%d,%d)', session.user_sn, session.group_sn, startTimestamp, endTimestamp);

            connection.query(query, this);
        },
        function (err, rows, fields) {
            if (err) throw err;

            var totalAmount = [];
            for (var i = 0; i < 12; i++) {
                totalAmount[i] = 0;
            }
            var sumAmount = 0;
            for (var i = 0; i < rows[0].length; i++) {
                if (params.ownerType == "MINE" && session.user_sn != rows[0][i].UserSN)
                    continue;
                else if (params.ownerType == "PARTNER" && session.user_sn == rows[0][i].UserSN)
                    continue;

                var date = new Date(rows[0][i].Timestamp * 1000);
                var month = date.getMonth();

                totalAmount[month] += rows[0][i].Amount;
            }
            result = totalAmount;
            return null;
        },
        function (err, contents) {
            if (connection)
                connection.release();

            return responsor(err, res, result);
        }
    );
};
