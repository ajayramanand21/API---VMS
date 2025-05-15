const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

///app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const loginRoute = require('./routes/login');
const protectedRoute = require('./routes/protected');
const logsRoute = require('./routes/logs');
const departmentRoute = require('./routes/department');
const departmenttableRoute = require('./routes/departmenttable');
const employeesRoute = require('./routes/employees');
//const roleManagementRoutes = require('./routes/roleManagement');
const roleRoutes = require('./routes/roleManagement');

// Route usage
app.use('/login', loginRoute);
app.use('/protected', protectedRoute);
app.use('/logs', logsRoute);
app.use('/department', departmentRoute); 
app.use('/api/employees', departmenttableRoute); 
app.use('/api/employees-data', employeesRoute);
//app.use('/role-management', roleManagementRoutes); 
app.use('/role-management', roleRoutes);


const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
