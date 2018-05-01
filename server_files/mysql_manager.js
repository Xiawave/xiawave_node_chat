const mysql = require("mysql");
var connection = mysql.createPool
({
    host     : 'localhost',
    user     : 'root',
    database : 'node_chat',
    connectionLimit: 20
});
module.exports =
{
    CheckForDataBase:function()
    {
        connection.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'node_chat'",function(checkerr,checkres,checkfield)
        {
            if(!checkerr && !checkres)
            {
                connection.query("CREATE DATABASE IF NOT EXISTS `node_chat` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci; USE `node_chat`;");
                connection.query("DROP TABLE IF EXISTS `file_manager_activity`; CREATE TABLE IF NOT EXISTS `file_manager_activity` ( `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, `user_id` int(2) NOT NULL,`activity_id` int(2) NOT NULL,`value` varchar(200) NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `id` (`id`)) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
                connection.query("INSERT INTO `file_manager_activity_types` (`id`, `description`) VALUES (1, 'filedownload'),(2, 'filedelete'),(3, 'fileupload'),(4, 'dircreate'),(5, 'dirdelete');");
                connection.query("DROP TABLE IF EXISTS `users`; CREATE TABLE IF NOT EXISTS `users` (`id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,`username` varchar(30) NOT NULL, `password` varchar(30) NOT NULL, `last_log` timestamp NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `id` (`id`)) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;");
                connection.query("INSERT INTO `users` (`id`, `username`, `password`, `last_log`) VALUES(1, 'test1', 'test1', '2000-01-01 10:10:10'),(2, 'test2', 'test2', '2000-01-11 10:10:10'),COMMIT;");
            }
        });
    },
    RegisterUser: function(reg_user_data,regcallback)
    {
        connection.query("SELECT username FROM users WHERE username = '" + reg_user_data.username +"'",function(reg_err,reg_res, reg_field)
        {
            if(!reg_err)
            {
                if(!reg_res[0])
                {
                    var usr_to_reg = reg_user_data.username;
                    var psw_to_reg = reg_user_data.password;
                    connection.query("INSERT INTO users (`username`, `password`, `last_log`) VALUES('" + usr_to_reg + "','" + psw_to_reg + "', NOW())",function(err,res,field)
                    {
                        if(!err)
                        {
                            regcallback(true);
                        }
                        else
                        {
                            regcallback(false);
                        }
                    });
                }
            }
            else
            {
                console.log(reg_err);
            }
        });
    },
    GetUser: function(userdata,callback)
    {
        connection.query("SELECT username, password from users where username = '" + userdata.usrname + "' AND password = '" + userdata.pswd +"'",function(err,result,fields)
        {
            if(result[0])
            {
                userdata.avaible = true;
                userdata.username = result[0].username;
                userdata.password = result[0].password;
                connection.query("UPDATE `users` SET `last_log`= NOW() WHERE username = '" + userdata.usrname + "';",function(err,res,f)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                });
            }
            else
            {
                userdata.username = "";
                userdata.password = "";
                userdata.avaible = false;
            }
            callback(userdata);
        });
    },
    EndConnection: function()
    {
        connection.end();
    },
    Password_Change: function(_password_data)
    {
        if(connection.query("SELECT username FROM users WHERE password = '" + _password_data.old_psw + "' AND username = '" + _password_data.username + "'",function(err,res)
        {
            if(res.length == 1)
            {
                connection.query("UPDATE `users` SET `password`='" + _password_data.new_psw + "' WHERE username = '" + _password_data.username + "'",function(err,result,f)
                {
                    if(err)
                    {
                        return false;
                    }
                    return true;
                });
            }
            else
            {
                return false;
            }
        }));
        return false;
    },
    GetAllUsersBeginning: function(_callback)
    {
        connection.query("SELECT username, last_log FROM users",function(err,results,field)
        {
            var returnData = [];
            if(results)
            {
                for(var i = 0; i < results.length; i++)
                {
                    var d = new Date(results[i].last_log);
                    d = (d.getFullYear() + "-" + (d.getMonth() < 10 ? "0":"") + d.getMonth() + "-" + (d.getDay() < 10 ? "0":"") + d.getDay() + " " + d.getHours() + ":" + (d.getMinutes() < 10 ? "0":"") + d.getMinutes());
                    returnData.push({username:results[i].username,isOnline:false,_socket:null,lastLogged:d});
                }
            }
            _callback(returnData);
        });
    },
    FileManagerEvent: function(_event_data)
    {
        var user_of_event = _event_data.event_username;
        connection.query("SELECT users.id FROM users WHERE users.username = '" + user_of_event +"'",function(user_err,user_results,user_fields)
        {
            if(!user_err)
            {
                if(user_results)
                {
                    var user_id = user_results[0].id;
                    var type_of_event = _event_data.event_type;
                    connection.query("SELECT file_manager_activity_types.id FROM file_manager_activity_types WHERE file_manager_activity_types.description = '" + type_of_event + "'",function(file_err, file_res,file_field)
                    {
                        if(!file_err)
                        {
                            if(file_res)
                            {
                                var event_id = file_res[0].id;
                                var created_text = _event_data.event_text;
                                connection.query("INSERT INTO `file_manager_activity`(`user_id`, `activity_id`, `value`) VALUES (" + user_id +"," + event_id +",'" + created_text + "')",function(err,res,field)
                                {
                                    if(!err)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        console.log(err);
                                        return false;
                                    }
                                });
                            }
                            else
                            {
                                console.log(file_err);
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    })
                }
                else
                {
                    return false;
                }
            }
            else
            {
                console.log(user_err);
                return false;
            }
        })
    }
};