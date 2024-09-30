const express = require('express');
const employeeRouter = require('./src/controller/EmployeeRouter');
const authRouter = require('./src/controller/AuthRouter');
const managerRouter = require('./src/controller/ManagerRouter');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/managers", managerRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port which is ${PORT}`);
});
