$(function()
{
    client = io.connect('http://localhost:420');
    if(localStorage.getItem("set_storage") !== null)
    {
        $(".login_form input[type='text']").val(localStorage.getItem("username"));
        $(".login_form input[type='password']").val(localStorage.getItem("password"));
    }
    client.on("reg_complete",function(data)
    {
        if(data == true)
        {
            $(".reg_message_label").css("background-color","lightgreen");
            $(".reg_message_label").text("SIKERES REGISZTRÁCIÓ");
        }
        else
        {
            $(".reg_message_label").css("background-color","red");
            $(".reg_message_label").text("FELHASZNÁLÓNÉV FOGLALT");
        }
    });
})
function GetFiles(_route)
{
    $.ajax(
        {
            url:"/getfiles",
            data:"route=" + _route,
            type:"POST",
            success:function(data)
            {
                if(data != "undefined")
                {
                    $(".file_manager_files").html("");
                    for(var i = 0; i < data.length; i++)
                    {
                        var template = $("#file_template").html();
                        var output = Mustache.render(template, data[i]);
                        $('.file_manager_files').append(output);
                    }
                    $(".file_manager_dir_location").text(currentDirectory);
                }
            }
        }
    );
}
function CheckBeforeLogin()
{
    if(typeof(Storage) !== "undefined")
    {
        if(localStorage.getItem("set_storage") === null)
        {
            $(".save_password_form").css("display","block");
        }
        else
        {
            Login();
        }
    }
    else
    {
        Login();
    } 
}
function progress(e)
{
    if(e.lengthComputable)
    {
        var max = e.total;
        var current = e.loaded;
        var Percentage = (current * 100)/max;
        if(Percentage >= 100)
        {
           // process completed  
        }
    }  
}
function Login()
{ 
    if(typeof(Storage) !== "undefined")
    {
        if(localStorage.getItem("set_storage") === null)
        {
            $(".save_password_form").css("display","block");
        }
    }   
    $(".file_manager_dir_location").text(currentDirectory);
    username = $("#username_input").val();
    var password = $("#password_input").val();
    if(username != "" && password != "")
    {
        client.emit("login",{usrname:username,pswd:password});
        client.on("adduser",function(data)
        {
            if(data == true)
            {
                $(".login_container").fadeOut(1000,function()
                {
                    $(".chat_container").fadeIn("500");
                    $("body").css("background-color","rgba(0,0,0,0.8)");
                });
                LoggedIn();
            }
            else
            {
                $(".form_message_label").css("opacity","1");
                $(".form_message_label").text("Érvénytelen Belépési Adatok!");
            }
        })
    }
}
function RegUser()
{
    client.emit("register",{username:$("#username_to_reg").val(),password:$("#password_to_reg").val(),password_again:$("#password_to_reg_again").val()});
}
function DelFile()
{
    var FilesToDelete = []
    $(".onefile input[type='checkbox']").each(function(i)
    {
        if($(this).prop("checked"))
        {
            var href_to_check = $(this).siblings(".file_body").children("a").attr("href");
            if(IsFile(href_to_check))
            {
                FilesToDelete.push(href_to_check);
            }
            
        }
    })
    $(".file_manager_deleter").animate({top:"-100%",opacity:'0'},500);
    $.ajax({
        url:"/delfiles",
        data:"filesToDelete="+FilesToDelete+"&username="+username,
        type:"POST",
        success:function(data)
        {
        }
    })
}
function CreateFolder(_dirName) 
{ 
    $(".file_manager_adddir").animate({top:"-100%",opacity:'0'},500);
    $.ajax(
        {
            url:"/createfolder",
            data:"PathToCreateFolder="+currentDirectory + "/" + _dirName +"&username="+username,
            type:"POST",
            success:function(data)
            {            

            }
        }
    );
}
function DelFolder()
{
    var DirToDelete = []
    $(".onefile input[type='checkbox']").each(function(i)
    {
        if($(this).prop("checked"))
        {
            var href_to_check = $(this).siblings(".file_body").children("a").attr("href");
            if(!IsFile(href_to_check))
            {
                DirToDelete.push(href_to_check);
            }
        }
    });
    $(".file_manager_deldir").animate({top:"-100%",opacity:'0'},500);
    $.ajax(
        {
            url:"/deletefolder",
            data:"DirToDel="+DirToDelete+"&username="+username,
            type:"POST",
            success:function(data)
            {
            }
        }
    );
}
function UploadFile()
{
    var f = new FormData();
    f.append("username",username);
    f.append("file_location",currentDirectory);
    f.append("file_data",$("input[name='new_file']")[0].files[0]);
    f.append("file_name",$("input[name='file_name']").val());
    f.append("file_extension",$("input[name='new_file']")[0].files[0].name.substring($("input[name='new_file']")[0].files[0].name.lastIndexOf("."),$("input[name='new_file']")[0].files[0].name.length));
    $.ajax(
        {
            url:"/uploadfiles",
            data:f,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            xhr: function() 
            {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload)
                {
                    myXhr.upload.addEventListener('progress',progress, false);
                }
                return myXhr;
            },
            success:function(data)
            {

            }
        }
    );
}
function IsFile(_pathToFile)
{
    return _pathToFile.split('/').pop().indexOf(".") > -1 ? true : false;
}
function SwitchMenu(_index)
{
    switch(_index)
    {
        case 0:
         $(".file_manager_adddir").animate({top:"0",opacity:'1'},500);
        break;
        case 1:
            CheckForChecks(false);
            if(checkednumber > 0)
            {
                $(".file_manager_deldir label").text("Biztos vagy benne, hogy törölni akarsz " + checkednumber + " könyvtárat, benne minden tartalommal?? ");
                $(".file_manager_deldir").animate({top:"0",opacity:'1'},500);
            } 
        break;
        case 2:
            $(".file_manager_uploader").animate({top:"0",opacity:'1'},500);
        break;
        case 3:
            CheckForChecks(true);
            if(checkednumber > 0)
            {
                $(".file_manager_deleter label").text("Biztos vagy benne, hogy törölni akarsz " + checkednumber + " fájlt? ");
                $(".file_manager_deleter").animate({top:"0",opacity:'1'},500);
            }
        break;
        case 4:
            if(currentDirectory != "file_manager_files")
            {
                currentDirectory = currentDirectory.split('/').slice(0,-1).join("/");
            }
            else
            {
                currentDirectory = "file_manager_files";           
            }
            if(currentDirectory == "file_manager_files")
            {
                $(".menu_img:last-of-type").css("display","none");
            }
            GetFiles(currentDirectory);
        break;
    }
}
function ChangePassword(_psw_data)
{
    $.post("/changepassword",_psw_data + "&username=" + username,function(err,response)
    {
        
    });
}
function UploadProfile(_userFormData)
{
    $.ajax(
        {
            url:"/uploadprofile",
            data:_userFormData,
            type:"POST",
            contentType:false,
            processData:false,
            success:function(data)
            {
                
            }
        }
    )
}
function CheckForChecks(_isFileVar)
{
    checkednumber = 0;
    $(".onefile input[type='checkbox']").each(function(i)
    {
        if($(this).prop("checked"))
        {
            if(IsFile($(this).siblings(".file_body").children("a").attr("href")) == _isFileVar)
            {
                checkednumber++;
            }
        }
    })
}