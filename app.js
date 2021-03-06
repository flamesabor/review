const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//Port
var port = process.env.PORT || 3000;

//Init App

const app=express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//Local testing DB
//const url = 'mongodb://localhost:27017/todoapp';

//Online mlab link
const url = 'mongodb://admin:admin-123@ds233323.mlab.com:33323/reviewbase';


//Body-Parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));


//View setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


//Connect to mongodb
MongoClient.connect(url,(err,database)=>{
console.log('MongoDB Connected.....');
if(err) throw err;

db = database;
Todos= db.collection('todos');

app.listen(port, ()=>{
    console.log('Server running on port ' + port );
});

});

//Display all content on Index page
app.get('/', (req, res, next)=>{
    Todos.find().toArray((err, todos)=>{
        if(err){
            return console.log(err);
        }
        
        res.render('index', {
            todos: todos
        });
    });
});

//Display specific content on Index page
// app.get('/', (req, res, next)=>{
//     var main_query = {text: "Two Countries"};
//     Todos.find(main_query).toArray((err, todos)=>{
//         if(err){
//             return console.log(err);
//         }
        
//         res.render('index', {
//             todos: todos
//         });
//     });
// });

app.post('/todo/add', (req, res, next)=>{
//Create todo
const todo = {
    text: req.body.text,
    textcat: req.body.textcat,
    body: req.body.body
}

//Insert Todo
Todos.insert(todo, (err, result)=>{
if(err){
    return console.log(err);
}
console.log('Todo Added.....');
res.redirect('/');
});
});

app.delete('/todo/delete/:id', (req, res, next)=>{
const query = {_id: ObjectID(req.params.id)}
Todos.deleteOne(query, (err, response)=>{
    if(err){
        return console.log(err);
    }
    console.log('Todo Removed');
    res.send(200);
});
});


app.get('/todo/edit/:id', (req, res, next)=>{
    const query = {_id: ObjectID(req.params.id)}
    Todos.find(query).next((err, todo)=>{
        if(err){
            return console.log(err);
        }
        
        res.render('edit', {
            todo: todo
        });
    });
});


app.post('/todo/edit/:id', (req, res, next)=>{
    const query = {_id: ObjectID(req.params.id)}
    //Create todo
    const todo = {
        text: req.body.text,
        textcat: req.body.textcat,
        body: req.body.body
    }
    
    //Update Todo
    Todos.updateOne(query, {$set:todo}, (err, result)=>{
    if(err){
        return console.log(err);
    }
    console.log('Todo Updated.....');
    res.redirect('/');
    });
    });


    //Render new Topics page

    app.get('/add', (req, res, next)=>{
        Todos.find({}).toArray((err, todos)=>{
            if(err){
                return console.log(err);
            }
            
            res.render('addTopic', {
                todos: todos
            });
        });
    });

    //Search nav

     app.get('/search', (req, res, next)=>{
            var myText = req.query.svalue;
                var main_query = {text: myText};
                Todos.find(main_query).toArray((err, todos)=>{
                    if(err){
                        return console.log(err);
                    }
                    
                    res.render('index', {
                        todos: todos
                    });
                });
            });
     
            //Materialize NoUislider
            
            