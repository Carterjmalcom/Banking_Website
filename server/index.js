// Required Modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'users.json');
const serverPublic = path.join(__dirname, 'public');
const serverPages = path.join(__dirname, 'public/pages');

// Middleware setup
app.use(express.static(clientPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes


// users route
app.get('/user', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const users = JSON.parse(data);
        if (!users) {
            throw new Error("Error: no users available");
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Problem getting the users: " + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});

app.get('/', (req, res) => {
    res.sendFile('pages/home.html', { root: serverPages });
});

//Home Route
app.get('/home', (req, res) => {
    res.sendFile('pages/home.html', { root: serverPublic });
});

//My Banks Route
app.get('/my-banks', (req, res) => {
    res.sendFile('pages/my-banks.html', { root: serverPublic });
});

//Transfer Funds Route
app.get('/transfer-funds', (req, res) => {
    res.sendFile('pages/transfer-funds.html', { root: serverPublic });
});

//Transaction History Route
app.get('/transaction-history', (req, res) => {
    res.sendFile('pages/transaction-history.html', { root: serverPublic });
});

//Settings Route
app.get('/settings', (req, res) => {
    res.sendFile('pages/settings.html', { root: serverPublic });
});

//Logout Route
app.get('/logout', (req, res) => {
    res.sendFile('pages/logout.html', { root: serverPublic });
});

//Profile Route
app.get('/profile', (req, res) => {
    res.sendFile('pages/sign-in.html', { root: serverPublic });
});

//Sign Up Route
app.get('/sign-up', (req, res) => {
    res.sendFile('pages/sign-up.html', { root: serverPublic });
});





// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        const { email, password } = req.body;
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            console.error("Error reading user data:", error)
            users = [];
        }

        let user = users.find(u => u.email === email);
        if (user) {
            console.log("already an account")
        } else {
            user = { email, password };
            users.push(user);
            console.log("already an account")
        }

        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.status(200).send("Successfully created an account")

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
            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.email === currentEmail && user.password === currentPassword);
            console.log(userIndex);
            if (userIndex === -1) {
                return res.status(404).json({ message: "User not found" })
            }
            users[userIndex] = { ...users[userIndex], email: newEmail, password: newPassword };
            console.log(users);
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

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
        let users = [];
        // try to read the users.json file and cache as data
        try {
            const data = await fs.readFile(dataPath, 'utf-8');
            users = JSON.parse(data);
        } catch (error) {
            return res.status(404).send('users data not found')
        }
        // cache the userIndex based on a matching name and email
        const userIndex = users.findIndex(user => user.email === email && user.password === password);
        console.log(userIndex);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        // splice the users array with the intended delete name and email
        users.splice(userIndex, 1);
        try {
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error("Failed to write to database");
        }
        // send a success deleted message
        res.send('user deleted successfully');
    } catch (error) {
        res.status(500).send('There was an error deleting user');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





