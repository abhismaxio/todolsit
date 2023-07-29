const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date =require(__dirname+"/date.js");

// console.log(date);
const app =express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));           // for html ejs
app.use(express.static("public"));             // for css


mongoose.connect('mongodb://127.0.0.1:27017/ToDoListDB',);

const listSchema = new mongoose.Schema({
    name:String
});

const List = mongoose.model("List",listSchema);

const item1 = new List({
    name:"buy food"
});
const item2 = new List({
    name:"cook food"
});
const item3 = new List({
    name:"eat food"
});


const defaultItems=[item1,item2,item3 ];

const ItemSchema = new mongoose.Schema({
    name:String,
    items: [listSchema]
});

const Item = mongoose.model("Item",ItemSchema)
app.get("/",function(req ,res){   
    let day = date.getDay();

    List.find({}).then((found_items)=>{                         // find item
        console.log(found_items);
        const newItem=found_items;
        if (found_items.length===0) {
            List.insertMany(defaultItems).then(()=>{              // success
                console.log("successfully inserted");
            }).catch(()=>{
                  console.log("error");
            });
            res.redirect("/");
        }else{
            res.render("list",{listTitle:day,newListItem:found_items});             // here is new list item
        }
            
    }).catch(()=>{
        console.log("err")
    });
});


app.post("/",function(req,res){
    let item_name =req.body.newItem;    // newItem is naming form on ejs

    // if(req.body.list=== "work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }else{
        const item = new List({
            name: item_name
        });
        item.save();
        res.redirect("/")
    // }

    
})

app.post("/delete", async function(req, res){
    checkedItemId = req.body.checkbox;
    console.log(checkedItemId);
    if(checkedItemId != undefined){
        List.findByIdAndRemove(checkedItemId)
        .then(()=>console.log(`Deleted ${checkedItemId} Successfully`)
        )
        .catch((err) => console.log("Deletion Error: " + err));
    }
    res.redirect("/");
})



app.get("/:custom_list_name",function(req,res){
    const new_list =req.params.custom_list_name;
    console.log(new_list);
    const item =  new Item({
        name : new_list,
        items: defaultItems
    });
    item.save();
    console.log(item);
    res.redirect("/");
    Item.findOne({name:new_list}).then((find_item)=>{

    })
})


// app.get("/work",function(req,res){
//         res.render("list",{listTitle:"work list",newListItem:workItems});
// })



// app.post("/work",function(res,req){
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })

app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("server")
});














