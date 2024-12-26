// Required Modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'customers.json');
const serverPublic = path.join(__dirname, 'public');
const serverPages = path.join(__dirname, 'public/pages');

// Middleware setup
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

// index route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: serverPages });
});

// customers route
app.get('/customers', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const customers = JSON.parse(data);
        if (!customers) {
            throw new Error("Error: no users available");
        }
        res.status(200).json(customers);
    } catch (error) {
        console.error("Problem getting the users: " + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});

// About route
app.get('/about', (req, res) => {
    res.sendFile('pages/about.html', { root: serverPublic });
});
app.get('/sign-in.html', (req, res) => {
    res.sendFile('pages/sign-in.html', { root: serverPublic });
});
app.get('/home.html', (req, res) => {
    res.sendFile('pages/home.html', { root: serverPublic });
});
app.get('/deposit.html', (req, res) => {
    res.sendFile('pages/deposit.html', { root: serverPublic });
});
app.get('/action.html', (req, res) => {
    res.sendFile('pages/action.html', { root: serverPublic });
});
app.get('/'), (req, res) => {
    res.sendFile('/client/src/img', { root: serverPublic });
}

//Home Route
app.get('/home', (req, res) => {
    res.sendFile('pages/home.html', { root: serverPublic });
});


// Form route
// app.get('/form', (req, res) => {
//     res.sendFile('pages/form.html', { root: serverPublic });
// });



// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        const { email, password } = req.body;

        let customers = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            customers = JSON.parse(data);
        } catch (error) {
            console.error("Error reading user data:", error)
            customers = [];
        }

        let customer = customers.find(u => u.email === email && u.password === password);
        if (customer) {
            // user.messages.push(message)
        } else {
            customer = { email, password };
            customers.push(customer);
        }

        await fs.writeFile(dataPath, JSON.stringify(customers, null, 2));
        res.redirect('/sign-in');

    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).send('An error occurred while processing your submission.');
    }
});

// Sign-in processing
app.post('/sign-in', async (req, res) => {
    // Implementation remains the same
});
// Update user route (currently just logs and sends a response)
app.put('/update-user/:currentEmail/:currentPassword', async (req, res) => {
    try {
        const { currentEmail, currentPassword } = req.params;
        const { newEmail, newPassword } = req.body;
        console.log('Current user:', { currentEmail, currentPassword });
        console.log('New user data:', { newEmail, newPassword });
        const data = await fs.readFile(dataPath, 'utf8');
        if (data) {
            let customers = JSON.parse(data);
            const customerIndex = customers.findIndex(customer => customer.email === currentEmail && user.password === currentPassword);
            console.log(customerIndex);
            if (customerIndex === -1) {
                return res.status(404).json({ message: "User not found" })
            }
            customers[customerIndex] = { ...customers[customerIndex], email: newEmail, password: newPassword };
            console.log(customers);
            await fs.writeFile(dataPath, JSON.stringify(customers, null, 2));

            res.status(200).json({ message: `You sent ${newEmail} and ${newPassword}` });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});



app.delete('/user/:email/:password', async (req, res) => {
    try {
        const { email, password } = req.params
        // initalize an empty array of 'users'
        let customers = [];
        // try to read the users.json file and cache as data
        try {
            const data = await fs.readFile(dataPath, 'utf-8');
            customers = JSON.parse(data);
        } catch (error) {
            return res.status(404).send('Customers data not found')
        }
        // cache the userIndex based on a matching name and email
        const customerIndex = customers.findIndex(customer => customer.email === email && customer.password === password);
        console.log(customerIndex);
        if (customerIndex === -1) {
            return res.status(404).send('User not found');
        }
        // splice the users array with the intended delete name and email
        customers.splice(userIndex, 1);
        try {
            await fs.writeFile(dataPath, JSON.stringify(customers, null, 2));
        } catch (error) {
            console.error("Failed to write to database");
        }
        // send a success deleted message
        res.send('Customer deleted successfully');
    } catch (error) {
        res.status(500).send('There was an error deleting user');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



