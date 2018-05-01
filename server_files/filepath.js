module.exports = function(app,socket,directory_name,_fs)
{
    app.get("/",function(req,res)
    {
        res.sendFile(directory_name  + "/index.html");
    });
    app.get("/client_files/mustache.js",function(req,res)
    {
        res.sendFile(directory_name  + "/client_files/mustache.js");
    });
    app.get("/client_files/client_events.js",function(req,res)
    {
        res.sendFile(directory_name  + "/client_files/client_events.js");
    });
    app.get("/client_files/client_functions.js",function(req,res)
    {
        res.sendFile(directory_name  + "/client_files/client_functions.js");
    });
    app.get("/prof_pics/*.*",function(req,res)
    {
        var img_src = req.url.split('/').pop();
        if(_fs.existsSync(directory_name + "/profile_pictures/" + img_src))
        {
            res.sendFile(directory_name + "/profile_pictures/" + img_src);
        }
        else
        {
            res.sendFile(directory_name  + "/Images/transparent_profile.png");
        }
        
    });
    app.get('/socket.io', function(req, res)
    {
        res.sendFile(directory_name + '/socket.io.js'); 
    });
    app.get('/style.css', function(req, res)
    {
        res.sendFile(directory_name + '/style.css'); 
    });
    app.get("/Images/nature-wallpaper.jpg",function(req,res)
    {
        res.sendFile(directory_name  + "/Images/nature-wallpaper.jpg");
    });
    app.get('/user.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/user.png'); 
    });
    app.get('/users.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/users.png'); 
    });
    app.get('/files.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/files.png'); 
    });
    app.get('/editor.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/editor.png'); 
    })
    app.get('/alarm.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/alarm.png'); 
    });
    app.get('/transparent_profile.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/transparent_profile.png'); 
    });
    app.get('/upload.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/upload.png'); 
    });
    app.get('/back.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/back.png'); 
    });
    app.get('/upload_btn.png', function(req, res)
    {
        res.sendFile(directory_name + '/Images/upload_btn.png'); 
    });
}
