import app from "./app.js";
import dotenv from "dotenv";
import dataBaseConnetion from "./Db/database.js";
dotenv.config({ path: "../.env" });



const Port = process.env.PORT || 8000;
dataBaseConnetion();
app.listen(Port, () => {
  console.log(`server run in ${Port} Port `);
});
