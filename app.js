const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const { response } = require("express");


const urlencodedParser = bodyParser.urlencoded({ extended: true});
var items = [],witems=[];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.connect("mongodb+srv://Vamik:AKV34FYyXGi9EALz@atlascluster.mojtdbm.mongodb.net/todolistDB");
const db = mongoose.connection;
db.on("error",(error)=>console.log(error));
db.once("open",()=>console.log("DB Connected"));
const itemSchema = new mongoose.Schema({
    name:"string"
})
const ListCreatorSchema = new mongoose.Schema({ 
    name : "string",
    listitems: [itemSchema]
});
const ListCreator = mongoose.model("ListCreator",ListCreatorSchema);
const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({
    name:"Welcome to your Todolist"
});
const item2 = new Item({
    name:"add + button to add a new item"
});
const item3 = new Item({
    name:"<-- hit this to delete the item"
});
const defaultItems = [item1, item2, item3];
app.get("/:q1",function(req,res){
          console.log(req.params.q1);
          const newlist = ListCreator({
            name:req.params.q1,
            listitems:defaultItems

          })
    
          ListCreator.findOne({name:req.params.q1}).then(function(doc){
             if(doc == null){
                 newlist.save();
                 res.render("list",{listtitle:newlist.name,adder:newlist.listitems});
             }
             else{
                res.render("list",{listtitle:doc.name,adder:doc.listitems});
             }
             
          })
             

});

app.get("/", function(req, res){
    
  
    Item.find().then((data)=>{
        if(data.length === 0){
              Item.insertMany(defaultItems);
              res.redirect('/');

        }
        else{
         res.render("list",{listtitle:"today",adder:data});     
       
        }
    });
   
   
   
   
});
app.post('/delete', function(req,res){
    console.log(req.body.checkbox);
    const lt = req.body.checkbox.split('-')[0];
    const idd = req.body.checkbox.split('-')[1];

    if(lt =="today"){
        Item.findByIdAndRemove({_id:idd}).then(function(){
        });
        res.redirect('/');
    }
    else{
        // ListCreator.update({ _id: diveId }, { "$pull": { "divers": { "user": userIdToRemove } }}, { safe: true, multi:true }, function(err, obj) {
        //     //do something smart
        // });
       
            // ListCreator.findOneAndUpdate({name:lt},{$pull:{Listitems:{_id: idd}}},function(err, foundList) {
            //         if(err){
            //             console.log(err);
            //         }
            // });
            ListCreator.findOne({name:lt}).then(function(doc){
                doc.listitems.pull({_id:idd});
                doc.save();
               res.redirect("/" + lt);
             });
    
    // if(ListCreator.findOne({name:lt})).then(function(doc)){
    //      if(doc == )
    // }
    // // ListCreator.findOne({name:req.body.checkbox}).then(function(doc){
    //       console.log(doc);
    // });
   
}});
app.post('/', function(req, res){

       console.log(req.body);
       var item = req.body.newtask;
       const newit = new Item({
                name: item
        });
    if(req.body.ct == 'today'){
        
        newit.save();
       
       res.redirect("/");  
    }
    else{
        ListCreator.findOne({name:req.body.ct}).then(function(doc){
            doc.listitems.push(newit);
            doc.save();
           res.redirect("/" + req.body.ct);
         })
      
       
    } 
    

});
app.listen(3000,function(){
    console.log("Server is running");
});