const {MongoClient}=require('mongodb')
let dbcon;
module.exports={
    connectToDb:(cb)=>{
        // Inside connectToDb function
MongoClient.connect('mongodb://127.0.0.1:27017/tasks_allotment')
.then((client) => {
  dbcon = client.db();
  return cb();
})
.catch((err) => {
  console.log(err);
  return cb(err);
});

    },
    getDb:()=>dbcon
}