const express = require("express")
const app = express()
const http = require('http').Server(app);
const path = require("path")
const mysql = require("mysql")
const body_parser = require("body-parser")
const bcrypt = require("bcrypt")
const cookieSession = require('cookie-session')
const { DateTime } = require("luxon")
const { Socket } = require("socket.io");
const fileUpload = require("express-fileupload");
const crypto= require("crypto")
require("dotenv").config()




app.use(fileUpload())



app.use(express.static(__dirname + '/resource'));



app.use(body_parser.urlencoded({
    extended: true
}));
app.use(require('body-parser').json());



app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY],
    maxAge: 168 * 60 * 60 * 1000 // 1 week
}))


app.set("view engine", "ejs")

const authenticateMiddleware = (req, res, next) => {
    if (req.session.hasOwnProperty("user_id")) {
        next()
    }
    else res.send("Access Denied")
}

// const con = mysql.createConnection({
//     user: "root",
//     password: "Fatima586*",
//     host: "localhost",
//     database: "Students"
// })

console.log(process.env)
const con = mysql.createConnection(process.env.MYSQL_CON)

con.connect((err) => {
    if (err) throw err;
    else {
        console.log("connected to mysql")
    }
})

const io= require("socket.io")(http)

let users={}

io.on('connection',(socket)=>{
    socket.on('new-user',(id)=>{
        users[id]=socket.id
      
    })
    socket.on("send-chat-message",(friend_id,msg)=>{
        const key = Object.keys(users).find(key => users[key] === socket.id);
       
    
        con.query('INSERT INTO Messages (sender_id, recipient_id, message) VALUES (?,?,?)', [ key, friend_id, msg], (err,result)=>{
            if (err) throw err;
            else{
                if(users.hasOwnProperty(friend_id)){
                    socket.to(users[friend_id]).emit('recieve-msg', msg, key)
                }
        
            }
        })
       
    })

})




app.get("/", (req, res) => {
    if (req.session.hasOwnProperty("user_id")) {
        res.redirect("myfeed")
    }
    else{
        res.render("login.ejs",{
            error: ""
        })
    }
        
})

app.get("/messenger",(req,res)=>{
    const chater_id= req.query.id
    let chater_name;
    let chater_profie;

    con.query(`SELECT Users.name, AboutInfo.profile FROM Users JOIN AboutInfo ON Users.id = AboutInfo.id  WHERE Users.id= ${chater_id}`,(err,result)=>{
        if (err) throw err
        else{
            if(result!='')
            {
                chater_name= result[0].name
                chater_profie= result[0].profile
            }
            
        }
    
    con.query(`SELECT * FROM Messages WHERE (sender_id=${req.session.user_id} AND recipient_id=${chater_id}) OR (sender_id=${chater_id} AND recipient_id=${req.session.user_id})`,(err,result2)=>{
        if (err) throw err
        res.render("chat.ejs",
        {
            recipient_id: chater_id,
            name_chater: chater_name,
            my_id: req.session.user_id,
            profile:chater_profie,
            rows: result2
        })
    })
    })






  
})

app.get("/login_page", (req, res) => {
    res.render("login.ejs",
    {
        error: ""
    })
})

app.post("/login", (req, res) => {
    con.query(`SELECT id,name,email,password FROM Users WHERE email= '${req.body.email}'`, (err, result) => {
        if (err) throw err;
        else if (result.length === 0) {
            res.render("login.ejs",{
                error: "email or password incorrect"
            })
            return
        }
        else {
            bcrypt.compare(req.body.password, result[0].password, function (err, results) {
                if (err) throw err;
                if(!results){
                    res.render("login.ejs",{
                        error: "email or password incorrect"
                    })
                    return
                }
                if (results) {
                    if(req.session.user_id == false  || !req.session.hasOwnProperty("user_id")){
                       
                        con.query(`SELECT * FROM AboutInfo WHERE id=${result[0].id}`,(err,result_2)=>{
                            if(err) throw err
                            if (result_2 == '')
                            {   
                                con.query(`INSERT INTO AboutInfo (id, description,relationship,city,highschool,profile) VALUES (${result[0].id},"","","","",'default.jpg')`, (err, result3) => {
                                    if (err) throw err;
                                })
                            }
                        })
                    }
                    req.session.username = result[0].name
                    req.session.user_id = result[0].id
                    res.redirect("/myfeed")
                }
            });
        }
    })
})


app.get("/signup", (req, res) => {
    res.render("signup.ejs",
        {
            error: ""
        })

})

app.get("/info",authenticateMiddleware,(req,res)=>{
    con.query(`SELECT name,email FROM Users WHERE id=${req.session.user_id}`,(err,result)=>{
        if(err) throw err 
        else{
            res.render("info.ejs", {
                name: result[0].name,
                email: result[0].email
            }) 
        }
    })
})


app.post("/update_info",authenticateMiddleware,(req,res)=>{
    bcrypt.hash(`${req.body.password}`, 10, function (err, hash) {
        if (err) throw err;
        else {
            con.query(`SELECT * FROM Users WHERE id = ${req.session.user_id}`, (err, result) => {
                if (result != "") {
                    if (req.body.password == ""){
                        con.query(`UPDATE Users SET name= ?, email= ? WHERE  id=${req.session.user_id}`, [req.body.name, req.body.email], (error, result) => {
                            if (error) throw error;
                            else {
                                res.redirect("/profile")
                            }
                        })
                    }
                    else{
                        con.query(`UPDATE Users SET name= ?, email= ?,password=? WHERE  id=${req.session.user_id}`, [req.body.name, req.body.email, hash], (error, result) => {
                            if (error) throw error;
                            else {
                                res.redirect("/profile")
                            }
                        })
                    }
                    
                }

            })

        }
    });
})

app.get("/edit", authenticateMiddleware, (req, res) => {
    con.query(`SELECT * FROM AboutInfo WHERE id= ${req.session.user_id}`, (err, result) => {
        if (err) res.status(500).send("something went wrong")
        else {
            res.render("edit.ejs",
                {

                    city: result[0].city,
                    relation: result[0].relationship,
                    highschool: result[0].highschool,
                    des: result[0].description
                })
        }
    })
})

app.post("/about", authenticateMiddleware, (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        con.query(`UPDATE AboutInfo SET description = ?, relationship=?, city=?, highschool=? WHERE id = ${req.session.user_id}`, [req.body.des, req.body.relation, req.body.city, req.body.highschool], (err, rows) => {
            if (!err) {
                res.redirect('/profile');

            } else {
                throw err;
            }
            return
        })
    }
    else {
        // nam eof the input is sampleFile
        let id = crypto.randomBytes(20).toString('hex');
        sampleFile = req.files.profile
        filename= sampleFile.name.replace(/\s+/g, '');

        uploadPath = __dirname + "/resource/profile_img/" + id +req.session.user_id + filename
            // use the mv to place the file on the server
            sampleFile.mv(uploadPath, (err) => {
                if (err) return res.status(500).send(err)

                con.query(`UPDATE AboutInfo SET description = ?, relationship=?, city=?, highschool=?, profile=? WHERE id = ${req.session.user_id}`, [req.body.des, req.body.relation, req.body.city, req.body.highschool, id +req.session.user_id + filename], (err, rows) => {
                    if (!err) {
                        res.redirect('/profile');
                    } else {
                        throw err;
                    }
                })
            })

    }



})
app.post("/signup", (req, res) => {
    bcrypt.hash(`${req.body.password}`, 10, function (err, hash) {
        if (err) throw err;
        else {
            con.query(`SELECT email FROM Users WHERE email ='${req.body.email}'`, (err, result) => {
                if (result != "") {
                    res.render("signup.ejs",
                        {
                            error: "email already exist"
                        })
                }
                else {
                    con.query(`INSERT INTO Users (name,email,password) VALUES ('${req.body.name}', '${req.body.email}', '${hash}')`, (error, result) => {
                        if (error) throw error;
                        else {
                            res.redirect("/login_page")
                        }
                    })
                }

            })

        }
    });
})


app.get("/logout", (req, res) => {
    req.session = null
    res.render("login.ejs",{
        error: ""
    })

})

app.get("/myfeed", authenticateMiddleware, (req, res) => {
    res.render("feed.ejs",
        {
            name: req.session.username,
            id: req.session.user_id
        })
})
app.post("/postnew", authenticateMiddleware, (req, res) => {
    if (req.body.hasOwnProperty("content") && req.body.content != "") {
        con.query(`INSERT INTO Posts (content, user_id) VALUES(?,?)`, [req.body.content, req.session.user_id], (err, result) => {
            if (err) {
                res.send("Error occured")
            }
        })
    }
})

app.get("/allpost", authenticateMiddleware, (req, res) => {
    con.query(`SELECT Users.name, Posts.user_id, Posts.poster_id, Users.email, Posts.content, Posts.date_posted, AboutInfo.profile FROM Posts JOIN Users ON Posts.user_id=Users.id JOIN AboutInfo ON AboutInfo.id=Posts.user_id ORDER BY Posts.poster_id DESC;`, (err, result) => {
        if (err) throw err
        else {
            const final_result = result.map((elem) => {
                elem.date_posted = DateTime.fromJSDate(elem.date_posted).toFormat("dd LLL yyyy")
                return elem

            })
            res.json(final_result)
        }
    })

})

app.post("/mypost",authenticateMiddleware ,(req,res)=>{
    con.query(`SELECT Users.name, Posts.user_id, Posts.poster_id, Users.email, Posts.content, Posts.date_posted, AboutInfo.profile FROM Posts JOIN Users ON Posts.user_id=Users.id JOIN AboutInfo ON AboutInfo.id=Posts.user_id WHERE Users.id= ${req.body.input.req_id} ORDER BY Posts.poster_id DESC ;`, (err, result) => {
        if (err) throw err
        else {
            const final_result = result.map((elem) => {
                elem.date_posted = DateTime.fromJSDate(elem.date_posted).toFormat("dd LLL yyyy")
                return elem
        })
            res.json(final_result)
        }
    })

})

app.post("/update",authenticateMiddleware,(req,res)=>{
    const post_id=req.body.post_id
    const post_text=req.body.msg
    con.query(`UPDATE Posts SET content= '${post_text}' WHERE poster_id=${post_id}`,(err,result)=>{
        if (err) throw err
    })  

})

app.post("/delpost",authenticateMiddleware,(req,res)=>
{
    const post_id= req.body.post_id
    con.query(`DELETE FROM Posts WHERE poster_id=${post_id}`,(err,result)=>{
        if (err) throw err
    })
})

app.post("/getusers", authenticateMiddleware, (req, res) => {
    con.query(`SELECT * FROM Users JOIN AboutInfo ON Users.id=AboutInfo.id WHERE Users.name LIKE '${req.body.input.val}%' LIMIT 4;`, (err, result) => {
        if (err) throw err;
        else {
            res.json(result)
        }
    })

})


app.get("/req_info", authenticateMiddleware, (req, res) => {
    let info;
    con.query(`SELECT * FROM AboutInfo WHERE id= ${req.query.id}`,(err,resultx)=>{
        if (err) throw err
        else{
            info=resultx
            con.query(`SELECT * FROM Users  WHERE Users.id= ${req.query.id} `, (err, result) => {
                if (err) throw err
                else {
                    con.query(`SELECT * FROM Friends WHERE user1_id= ${result[0].id} AND user2_id= ${req.session.user_id} `, (err, result_2) => {
                        if (err) throw err
                        else {
                            let corn = "Add Friend"
                            if (result_2 != "") {
                                if (result_2[0].status2 == 0) {
                                    corn = "Accept request"
                                }
                                else if (result_2[0].status2 == 1) {
                                    corn = "Friend"
                                }
                            }
                            res.render("myprofile.ejs", {
                                u_name: result[0].name,
                                user_id: result[0].id,
                                my_id: req.session.user_id,
                                friend_status: corn,
                                req_list: [],
                                my_info:info
                            })
        
                        }
                    })        
                }
            })
        }})


    

})
app.get("/userinfo", authenticateMiddleware, (req, res) => {
    
    let info;
    con.query(`SELECT * FROM AboutInfo WHERE id= ${req.query.id}`,(err,resultx)=>{
        if (err) throw err
        else{
            info=resultx
            con.query(`SELECT * FROM Users WHERE Users.id= ${req.query.id}`, (err, result) => {
                if (err) throw err
                else {
                    con.query(`SELECT * FROM Friends WHERE (user1_id= ${req.session.user_id} AND user2_id= ${result[0].id}) OR (user1_id=${result[0].id}  AND user2_id=${req.session.user_id})`, (err, result_2) => {
                        if (err) throw err
                        else {
                            let corn = "Add Friend"
                            if (result_2 != "") {  
                                
                                if (result_2[0].status2==0 && (req.session.user_id == result_2[0].user2_id)){
                                    corn = "Accept request"
                                }

                                else if (result_2[0].status2 == 0) {
                                    corn = "cancel req"
                                }
                                
                                else if (result_2[0].status2 == 1) {
                                    corn = "Friend"
                                }
                            }
                            res.render("myprofile.ejs", {
                                u_name: result[0].name,
                                user_id: result[0].id,
                                my_id: req.session.user_id,
                                friend_status: corn,
                                req_list: [],
                                my_info:info
                            })
        
                        }
                    })
                }
            })
        }})
    
})

app.get("/profile", authenticateMiddleware, (req, res) => {    
                let info;
                con.query(`SELECT Users.name, AboutInfo.id, AboutInfo.city,AboutInfo.description,AboutInfo.relationship,AboutInfo.profile,AboutInfo.highschool FROM AboutInfo JOIN Users ON Users.id=AboutInfo.id  WHERE Users.id= ${req.session.user_id}`,(err,result)=>{
                    if (err) throw err
                    else{
                        info=result
                        if (req.query.hasOwnProperty("typ")) {
                            res.render("myprofile.ejs", {
                                u_name: result[0].name,
                                user_id: result[0].id,
                                my_id: req.session.user_id,
                                friend_status: "Accept request",
                                req_list: [],
                                my_info:info
                            })
                        }
                        else{
                            con.query(`SELECT  Friends.user1_id, Users.name, AboutInfo.profile FROM Friends JOIN Users ON Users.id=Friends.user1_id JOIN AboutInfo ON AboutInfo.id=Friends.user1_id WHERE Friends.user2_id= ${req.session.user_id} AND Friends.status2= 0;`,(err,result_2)=>{
                                if(err) throw err
                                if(result_2!=''){
                                    res.render("myprofile.ejs", {
                                    u_name: result[0].name,
                                    user_id: req.session.user_id,
                                    my_id: req.session.user_id,
                                    friend_status: "notifictaion",
                                    req_list: result_2,
                                    my_info:info
                                })
                                    
                                }
                                else {
                                    res.render("myprofile.ejs", {
                                        u_name: req.session.username,
                                        user_id: req.session.user_id,
                                        my_id: req.session.user_id,
                                        friend_status: "none",
                                        req_list: [],
                                        my_info:info
                                    })
                
                                }
                            })
                            
                        }
                        

                    }
                
                

            })
                




            
        

    

})

app.post("/friend_req", authenticateMiddleware, (req, res) => {
    con.query(`INSERT INTO Friends(user1_id, user2_id, status1,status2) VALUES (${req.session.user_id}, ${req.body.input.req_id}, 1, 0)`, (err, result) => {
        if (err) throw err;
        else
            res.sendStatus(200)
    })
})

app.post("/accept_req", authenticateMiddleware, (req, res) => {
    con.query(`UPDATE Friends SET status2=1 WHERE user2_id= ${req.session.user_id} AND user1_id=${req.body.input.req_id} AND status1= 1;`, (err, result) => {
        if (err) throw err;
        else{
            if(result.changedRows == 1){
                res.sendStatus(200)
            }
            else{
                res.sendStatus(205)
            }
            
        }
            
    })


})


app.post("/cancel_req", authenticateMiddleware, (req, res) => {
    con.query(`DELETE FROM Friends WHERE user1_id=${req.session.user_id} AND  user2_id=${req.body.input.req_id} AND status1=1 AND status2=0;`, (err, result) => {
        if (err) throw err;
        else
            res.sendStatus(200)
    })

})


http.listen(process.env.PORT, () => {
    console.log("server lsitening on port 3000")
})
