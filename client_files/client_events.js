var username,
n,
client,
curPos = 0,
HasFocus = true,
checkednumber = 0,
currentDirectory = "file_manager_files";

$(".login_form input[type='text'], .login_form input[type='password']").on("keypress",function(e)
{
    if(e.keyCode == 13)
    {
        CheckBeforeLogin();
    }
})
$(".answer_btns button").on("click",function()
{
    localStorage.setItem("set_storage","1");
    switch($(this).index())
    {
        case 0:
            localStorage.setItem("username",$(".login_form input[type='text']").val());
            localStorage.setItem("password",$(".login_form input[type='password']").val());
        break;
    }
    Login();
})
$("body").on("change",".onefile input[type='checkbox']",function()
{
    checkednumber = 0;
    if($(this).prop("checked"))
    {
        $(this).parent().css("box-shadow","1px 1px 1px black, -1px -1px 1px black");
    }
    else
    {
        $(this).parent().css("box-shadow","0px 0px 0px black, 0px 0px 0px black");
    }
    $(".onefile input[type='checkbox']").each(function(i)
    {
        if($(this).prop("checked"))
        {
            checkednumber += 1;
            $(".file_manager_deleter label").text("Biztos vagy benne, hogy törölni akarsz " + checkednumber + " fájlt? ");
        }
    });
});
$(".file_manager_uploader img:first-of-type").on('click',function()
{
    $("input[name='new_file']").trigger('click');
});
$("input[name='new_file']").on("change",function()
{
    var withoutExt = $(this)[0].files[0].name.substring(0,$(this)[0].files[0].name.lastIndexOf("."));
    $("input[name='file_name']").val(withoutExt);
});
$(".file_manager_upper_class img:last-of-type").on('click',function()
{
    $(this).parent().animate({top:"-100%",opacity:"0"},500);
});
$(".file_manager_deleter img:nth-of-type(1)").on("click",function()
{
    DelFile();
});
$(".file_manager_adddir img:nth-of-type(1)").on("click",function () 
{  
    var DirName = $(".file_manager_adddir input[type='text']").val();
    CreateFolder(DirName);
});
$(".file_manager_deldir img:nth-of-type(1)").on("click",function()
{
    DelFolder();
});
$(".upload_btn").on('click',function()
{
    UploadFile();
});
$(".menu_img").on("click",function()
{
    SwitchMenu($(this).index());
});
$(".login_form input[type='button']").on('click',function()
{
    CheckBeforeLogin();
});
$(".registration_form input[type='button']").on('click',function()
{
    RegUser();
});
$("#text").on("keypress",function(e)
{
    if(e.keyCode == 13)
    {
        $("#send").click();
    }
});
$(".change_login").on('click',function()
{
    var _index = $(this).index();
    switch(_index)
    {
        case 0:
            $(".login_form").css("display","block");
            $(".registration_form").css("display","none");
        break;
        case 1:
            $(".login_form").css("display","none");
            $(".registration_form").css("display","block");
        break;
    }
});
$(".setpassword input[type='password']").on('focus',function()
{
    if($(this).val() == "")
    {
        $(this).siblings(".input_helper").animate({bottom:"50px",fontSize: "12px"},300);
    }
});
$(".setpassword input[type='password']").on('focusout',function()
{
    if($(this).val() == "")
    {
        $(this).siblings(".input_helper").animate({bottom:"18px",fontSize: "18px"},300);
    }
});
$("#passw_form").on('submit',function(e)
{
    e.preventDefault();
    var password_data = $(this).serialize();
    ChangePassword(password_data);
});
$(".profilehead img").on('click',function()
{
    $(this).siblings("input[type='file']").trigger('click');
});
$(".profilehead input[type='file']").on('change',function()
{
    var f = new FormData();
    f.append("username",username);
    f.append("user_profile",$(this)[0].files[0]);
    UploadProfile(f);
});
$("body").on("click",".file_body a",function(e)
{
    var path = $(this).attr("href");
    if(!IsFile(path))
    {
        $(".menu_img:nth-of-type(5)").css("display","block");
        currentDirectory = path;
        e.preventDefault();
        GetFiles(currentDirectory);
    }
})
function LoggedIn()
{
    $(".black_bg").on('click',function(event)
    {
        if($(event.target).hasClass("black_bg"))
        {
            $(this).animate({opacity:'0'},400,function()
            {
                $(this).css("display","none");
            })
        }
    })
    $(".profilehead img").attr("src","/prof_pics/" + username +".jpg");
    $(".menu_item").on("mouseenter",function()
    {
        $show = "";
        $elem = $(this).children("img").attr("src");
        $(this).children("img").animate({width:"95px",height:"95px"},150);
        switch($elem)
        {
            case "user.png":
            $show = "Felhasználó";
            break;
            case "users.png":
            $show = "Felhasználók Adatai";
            break;
            case "files.png":
            $show = "Megosztott fájlok";
            break;
            case "editor.png":
            $show = "Szövegszerkesztő";
            break;
            case "alarm.png":
            $show = "Értesitő";
            break;
        }
        $(".selected_menu").text($show);
        $(".selected_menu").css("opacity","1");
    });
    $(".menu_item").on("click",function()
    {
        $elem = $(this).children("img").attr("src");
        switch($elem)
        {
            case "user.png":
            $(".black_fixed_my_profile").css("display","block").animate({"opacity":1},400);
            break;
            case "users.png":
            $(".black_online_users").css("display","block").animate({"opacity":1},400);
            break;
            case "files.png":
            $(".black_fixed_files").css("display","block").animate({"opacity":1},400);
            break;
            case "editor.png":
            $(".black_fixed_editor").css("display","block").animate({"opacity":1},400);
            break;
            case "alarm.png":
            break;
        }
    });
    $(".menu_item").on("mouseleave",function()
    {
        $(this).children("img").animate({width:"80px",height:"80px"},150);
        $(".selected_menu").css("opacity","0");
    });
    $("#send").on('click',function()
    {
        if($("#text").val() != "")
        {
            client.emit('chat message', "<b> " + username +": </b> " + $("#text").val());
            $("#text").val("");
        }
    })
    client.on("broadcast",function(data)
    {
        $(".chat").append("<div class='chat_message'> " + data + "</div>");
        if(!HasFocus)
        {
            $("title").text("Üzenet érkezett!");
        }
    });
    client.on("usernames",function(data)
    {
        $(".online_users").html(data);
    });
    $(window).blur(function()
    {
        HasFocus = false;
    });
    $(window).focus(function()
    {
        HasFocus = true;
        $("title").text("CHAT");
    });
    $(".online_text_editor").on("change",function()
    {
        curPos = $(this).prop("selectionStart");
        client.emit("text_editor_changed",$(this).val());
    });
    client.on("send_text_editor_state",function(data)
    {   
        $(".online_text_editor").val(data);
        var tempCurPos = $(".online_text_editor").prop("selectionStart");
        $(".online_text_editor").prop("selectionStart", curPos - tempCurPos);
        $(".online_text_editor").prop("selectionEnd",curPos - tempCurPos);
    })
    client.on("get_recent_files",function()
    {
        GetFiles(currentDirectory);
    });
    $(window).on("unload",function()
    {
        client.disconnect();
    });
}
