const express = require('express');

const employeeRouter = require('./src/controller/EmployeeRouter')
const authRouter = require('./src/controller/AuthRouter')

const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;



app.use("/auth", authRouter);
app.use("/employee", employeeRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port which is ${PORT}`);
});
