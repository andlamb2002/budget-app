const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { auth, db } = require('./firebaseConfig');
const { doc, getDoc, setDoc, collection, getDocs } = require("firebase/firestore");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");


const app = express();
app.use(cors());  
app.use(compression());
app.use(express.json()); 

const PORT = 5000;

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        await setDoc(doc(db, "users", userId), {
            email: email
        });
        res.status(201).send(`User created: ${userId}`);
    } catch (error) {
        console.error("Error registering new user: ", error);
        res.status(500).send("Error registering user");
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        res.status(200).send(`User logged in: ${userCredential.user.uid}`);
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).send("Error logging in user");
    }
});

app.post('/api/budgets', async (req, res) => {
    const { userId, category, amount } = req.body;
    try {
        const budgetRef = doc(db, "users", userId, "budgets", category);
        await setDoc(budgetRef, { category, amount });
        res.status(201).send("Budget created");
    } catch (error) {
        console.error("Error creating budget: ", error);
        res.status(500).send("Error creating budget");
    }
});

app.get('/api/budgets/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const budgetsRef = collection(db, "users", userId, "budgets");
        const querySnapshot = await getDocs(budgetsRef);
        const budgets = querySnapshot.docs.map(doc => doc.data());
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Error retrieving budgets: ", error);
        res.status(500).send("Error retrieving budgets");
    }
});

app.post('/api/expenses', async (req, res) => {
    const { userId, category, amount, date } = req.body;
    try {
        const expenseRef = doc(collection(db, "users", userId, "expenses"));
        await setDoc(expenseRef, { category, amount, date });
        res.status(201).send("Expense logged");
    } catch (error) {
        console.error("Error logging expense: ", error);
        res.status(500).send("Error logging expense");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});