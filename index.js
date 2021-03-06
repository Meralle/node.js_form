var uuidv4 = require('uuid/v4');
var express = require('express');
require('dotenv').config();
var app = express();
var fs = require('fs');
app.set('view engine', 'pug');


app.get('/register', (req, res) => {
    res.render('index' , {
        h1:'Register',
        label:'Email address',
        label:'passward',
        button:'Sign in'
    });
});

app.get('/', (req, res) => {
    // console.log('./register/users');
    var files = fs.readdirSync('./user_folder');
    // console.log(files);
    var confirmedUsers = []; 
    files.forEach(file => {
    var user = fs.readFileSync('./user_folder/' + file )
    // console.log(user)
    let parseUser = JSON.parse(user);
    // console.log(parseUser)
        if (parseUser.status !== 'unconfirmed'){
            confirmedUsers.push(parseUser);
            console.log(confirmedUsers);
        }
    });
    res.render('register',{ users:confirmedUsers}); 

});


app.get('/admin', (req, res) => {
   // console.log('./admin/users');
   var files = fs.readdirSync('./user_folder');
   // console.log(files); 
   var adminUsers = [];
   files.forEach(file => {
    var user = fs.readFileSync('./user_folder/' + file)
    // console.log(user);
    let parseUser = JSON.parse(user);
    // console.log(parseUser)
        if(parseUser.status === 'unconfirmed' && 'confirmed'){
            adminUsers.push(parseUser);
            console.log(adminUsers);
        } 
});
   
  res.render('admin' ,{users: adminUsers});
});

app.get('/user/create', (req, res) => {

var id = uuidv4();
var obj = {
	"uuid": id, //every user should become a uuid. https://www.npmjs.com/package/uuid
 	"email":req.query.email, //from form
 	"pw":req.query.pw, //from form
 	"status":"unconfirmed", //default value unconfirmed, every register is first unconfirmed
 	"session": true //depending on the RememberMe checkbox
}

fs.writeFile(`./user_folder/${id}.json`,JSON.stringify(obj), (err) =>{
	if(err){
		return console.log(err);
	}
	console.log('ths file was saved')
	
});
	res.send('user/created')
	// console.log(req.query)

});


app.get('/user/verify/:token', (req, res) => {
    console.log(req.params.token)
    //open your files folder fs.readDir
    fs.readFile(`./user_folder/${req.params.token}.json`, (err, file) => {
        if (err) console.log('Error', err);
        else {
            var file = JSON.parse(file)
            //set that document status to confirmed
            if (file.uuid === req.params.token) {
                console.log("current file uuid:", file.uuid)
                file.status = "confirmed";
                //write file back
                fs.writeFile(`./user_folder/${req.params.token}.json`, JSON.stringify(file), (err) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The email was confirmed!");
                    //redirect to /
                    res.redirect("/admin");
                });
            }
        };
    });
});

app.listen(4000, () => console.log('Example app listening on port 4000!'))