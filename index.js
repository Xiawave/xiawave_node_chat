const socket = require("express"), 
fupload = require("express-fileupload"), 
fs = require("fs"), 
bodyParser = require("body-parser"),
app = socket()
// Requires ending
app.use(bodyParser.urlencoded({extended:false}));
app.use(fupload());
// requires self js files
const mysql = require("./server_files/mysql_manager.js"),
prof_manager = require("./server_files/profile.js")(app,__dirname),
mustache = require("./client_files/mustache.js"),
server = require("http").createServer(app),
io = require("socket.io").listen(server),
fpath = require("./server_files/filepath.js")(app,socket,__dirname,fs),
fmanager = require("./server_files/file_manager.js")(app,__dirname,fs,socket,fupload,io,mysql);
// self js file require ending
var text = "";
var users;
mysql.GetAllUsersBeginning(function(_value)
{
    users = _value;
});
server.listen(process.env.PORT || 420);
console.log("Server Started...");
io.sockets.on("connection",function(socket)
{
    socket.on("disconnect",function()
    {
        socket.disconnect();
        for (var index_of_socket = 0; index_of_socket < users.length; index_of_socket++) 
        {
            if(users[index_of_socket]._socket == socket)
            {
                users[index_of_socket]._socket = null;
                console.log(users[index_of_socket].username + " lecsatlakozott!");
                SendAllUsers();             
                break;
            }
        }
    });
    socket.on("chat message",function(data)
    {
        io.emit("broadcast",data);
    });
    socket.on('text_editor_changed',function(data)
    {
        text = data;
        io.emit("send_text_editor_state",data);
    });
    socket.on("login",function(data)
    {
        var usrdata = mysql.GetUser(data,function(result_data)
        {
            socket.emit("adduser",result_data.avaible);
            if(result_data.avaible)
            {  
                var index_of_logged_user = (function()
                {
                    for (var index_of_username = 0; index_of_username < users.length; index_of_username++) 
                    {
                        if(users[index_of_username].username == result_data.username)
                        {
                            users[index_of_username]._socket = socket;
                            console.log(users[index_of_username].username + " csatlakozott a szerverhez!");
                            io.emit("send_text_editor_state",text);
                            socket.emit("get_recent_files");
                            SendAllUsers();
                        }
                    }
                })();
                
            }
        });
    });
    socket.on("register",function(data)
    {
        var _reg_data = data;
        if(_reg_data.password == _reg_data.password_again)
        {
            mysql.RegisterUser(_reg_data,function(_result)
            {
                socket.emit("reg_complete",_result);
            });
        }
    });
});
function SendAllUsers()
{
    var Online_Users_Text = "";
    for(var i = 0; i < users.length; i++)
    {
        var _avaible = users[i]._socket != null ? "green" : "red";
        Online_Users_Text += ("<div class='oneuser'> <div class='username'> " + users[i].username + " </div> <div class='avaible_sign'> <div class='" + _avaible +"'> </div> </div> <div class='last_logged'> Utoljára belépve: " + users[i].lastLogged + " </div> </div> </div> </div>");
    }
    io.emit("usernames",Online_Users_Text);
}