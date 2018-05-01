module.exports = function(app,directory_name)
{
    app.post("/uploadprofile",function(req,res)
    {
        if(!req.files)
        {
            res.sendStatus(200);
        }
        else
        {
            var prof_pic_path = directory_name + "/profile_pictures/" + req.body.username + ".jpg";
            if(req.files.user_profile.mv(prof_pic_path))
            {
                res.send(prof_pic_path);
            }
        }
    });
    app.post("/changepassword", function(req,res)
    {
        var password_data = req.body;
        var is_filled = true;
        for(var i = 0; i < password_data.length; i++)
        {
            if(password_data[i] == "")
            {
                is_filled = false;
                break;
            }
        }
        if(is_filled)
        {
            var mysql_pass_data = require("./mysql_manager.js");
            var result = mysql_pass_data.Password_Change(password_data);
            res.send(result);
        }  
    })
}