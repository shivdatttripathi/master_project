import mongoose from "mongoose";

const dataBaseConnetion = () => {
  console.log(process.env.DATA_BASE_URL);
  try {
    mongoose.connect(process.env.DATA_BASE_URL).then(() => {
      console.log("DataBase connection succesful");
    });
  } catch (error) {
    console.log(`error in data base ${error}`);
  }
};
export default dataBaseConnetion;
