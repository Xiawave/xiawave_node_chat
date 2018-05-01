module.exports = function(app,directory_name,_fs,socket,_fupload,_io,_mysql)
{
    app.post("/getfiles", function(req,res)
    {
        var path = directory_name + "/" + req.body.route;
        _fs.lstat(path,function(err,stat)
        {
            if(!err)
            {
                if(stat.isDirectory())
                {
                    _fs.readdir(path, function(err, result)
                    {
                        var resToSendBack = [];
                        for(var i = 0; i < result.length; i++)
                        {
                            var filetypeArray = result[i].split(".");
                            if(filetypeArray.length == 2)
                            {
                                var imgsrc = filetypeArray[filetypeArray.length - 1];
                                resToSendBack.push({"filename":result[i],"src":req.body.route + "/" + result[i] ,"filetype":imgsrc});
                            }
                            else if(filetypeArray.length == 1)
                            {
                                resToSendBack.push({"filename":result[i],"src":req.body.route + "/" + result[i],"filetype":"folder"});
                            }
                        }
                        res.send(resToSendBack);
                    })
                }
                else
                {
                    res.send(null);
                }
            }
            else
            {
                console.log(err);
            }
        });
        
    });
    app.get("/file_manager_files/*.*",function(req,res)
    {
        res.download(directory_name + req.url);
    });
    app.post("/delfiles", function(req,res)
    {
        var _username = req.body.username;
        var ToDel = req.body.filesToDelete.split(',');
        for(var i = 0; i < ToDel.length; i++)
        {
            var _ToShow = ToDel[i];
            _fs.unlink(directory_name + "/" + ToDel[i],function(err)
            {
                if(!err)
                {
                    var DirToSend = req.body.filesToDelete;
                    _mysql.FileManagerEvent({event_username:_username,event_type:"filedelete",event_text:DirToSend});
                    console.log(_ToShow + " törölve!");
                }
                else
                {
                    throw err;
                }
            })
        }
        _io.emit("get_recent_files");
    });
    app.post("/uploadfiles", function(req,res)
    {
        req.files.file_data.mv(directory_name + "/" + req.body.file_location + "/" + req.body.file_name + req.body.file_extension);
        _mysql.FileManagerEvent({event_username:req.body.username,event_type:"fileupload",event_text:(req.body.file_location + "/" + req.body.file_name + req.body.file_extension)});
        _io.emit("get_recent_files");
    });
    app.post("/createfolder",function(req,res)
    {
        var _username = req.body.username;
        var DirName = directory_name + "/" + req.body.PathToCreateFolder;
        if(!_fs.existsSync(DirName))
        {
            _fs.mkdir(DirName,function(err)
            {
                if(!err)
                {
                    var DirToSend = req.body.PathToCreateFolder;
                    _mysql.FileManagerEvent({event_username:_username,event_type:"dircreate",event_text:DirToSend});
                    _io.emit("get_recent_files");
                    return true;
                }
                else
                {
                    console.log(err);
                    return false;
                }       
            });
            return false;
        }
        return false;
    });
    app.post("/deletefolder",function(req,res)
    {
        var _username = req.body.username;
        var DelDir = req.body.DirToDel.split(',');
        for(var j = 0; j < DelDir.length; j++)
        {
            var location = DelDir[j];
            if(_fs.existsSync(directory_name + "/" + location))
            {
                _fs.lstat(directory_name + "/" + location +"/",function(err,stats)
                {
                    if(!err)
                    {
                        _fs.readdir(directory_name + "/" + location,function(err,files_to_del)
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            for(var i = 0; i < files_to_del.length; i++)
                            {
                                var todel = files_to_del[i];
                                _fs.unlink(directory_name + "/" + location + "/" + todel,function(err)
                                {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                });
                            }
                            _fs.rmdir(directory_name + "/" + location,function(err)
                            {
                                if(!err)
                                {
                                    _mysql.FileManagerEvent({event_username:_username,event_type:"dirdelete",event_text:location});
                                    console.log("A könyvtár törlésre került.");
                                }
                                else
                                {
                                    console.log(err);
                                }
                            });
                        })
                    }
                    else
                    {
                        console.log(err);
                    }
                })
            }
            else
            {
                console.log("nem létezik");
            }
        }
        _io.emit("get_recent_files");
    });
    app.use('/server_files/file_icons', socket.static(directory_name + '/server_files/file_icons'));
    app.use('/file_manager_images', socket.static(directory_name + '/file_manager_images'));
}