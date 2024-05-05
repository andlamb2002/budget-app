const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { auth, db } = require('./firebaseConfig');
const { doc, getDoc, setDoc, collection, getDocs, addDoc } = require("firebase/firestore");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const app = express();
app.use(cors());  
app.use(compression());
app.use(express.json()); 

const PORT = 5000;

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

function formatFirebaseError(error) {
    const code = error.code;
    const message = error.message;
    switch (code) {
        case 'auth/invalid-email':
            return "The email address is invalid. Please enter a valid email address.";
        case 'auth/user-not-found':
            return "No user found with this email address.";
        case 'auth/wrong-password':
            return "Incorrect password. Please try again.";
        case 'auth/email-already-in-use':
            return "This email is already in use by another account.";
        case 'auth/weak-password':
            return "The password must have at least 6 characters. Please use a stronger password.";
        case 'auth/missing-password':
            return "No password was provided. Please enter a password.";
        case 'auth/missing-email':
            return "No email address was provided. Please enter an email address.";
        default:
            return `Authentication error: ${message}`;
    }
}

app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName.trim() || !lastName.trim()) {
        return res.status(400).send({ error: 'First name and last name are required and cannot be empty.' });
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        const userData = {
            firstName,
            lastName,
            email
        };
        await setDoc(doc(db, "users", userId), userData);

        res.status(201).json({
            id: userId, 
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        });
    } catch (error) {
        console.error("Error registering new user: ", error);
        res.status(500).send({ error: formatFirebaseError(error) });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential) {
            throw new Error('Login failed');
        }
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (!userDoc.exists()) {
            throw new Error("User not found in database");
        }
        const userData = userDoc.data();
        res.status(200).json({
            id: userCredential.user.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).send({ error: formatFirebaseError(error) });
    }
});

app.post('/api/budgets', async (req, res) => {
    const { userId, category, amount } = req.body;
    const formattedCategory = category.trim().charAt(0).toUpperCase() + category.toLowerCase().slice(1);

    try {
        const budgetsRef = collection(db, "users", userId, "budgets");
        const snapshot = await getDocs(budgetsRef);
        const exists = snapshot.docs.some(doc => doc.data().category === formattedCategory);

        if (exists) {
            return res.status(400).json({ error: "Budget category already exists." });
        }

        const budgetRef = await addDoc(budgetsRef, { category: formattedCategory, amount });
        res.status(201).json({ id: budgetRef.id, category: formattedCategory, amount });
    } catch (error) {
        console.error("Error creating budget: ", error);
        res.status(500).json({ error: "Error creating budget" });
    }
});

app.get('/api/budgets/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const budgetsRef = collection(db, "users", userId, "budgets");
        const querySnapshot = await getDocs(budgetsRef);
        const budgets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Error retrieving budgets: ", error);
        res.status(500).send("Error retrieving budgets");
    }
});

app.put('/api/budgets/:userId/:budgetId', async (req, res) => {
    const { userId, budgetId } = req.params;
    const { category, amount } = req.body;
    const formattedCategory = category.trim().charAt(0).toUpperCase() + category.toLowerCase().slice(1);

    try {
        const budgetRef = doc(db, "users", userId, "budgets", budgetId);
        await updateDoc(budgetRef, { category: formattedCategory, amount });
        res.status(200).json({ message: `Budget updated with ID: ${budgetId}`, category: formattedCategory, amount });
    } catch (error) {
        console.error("Error updating budget: ", error);
        res.status(500).json({ error: "Error updating budget" });
    }
});

app.delete('/api/budgets/:userId/:budgetId', async (req, res) => {
    const { userId, budgetId } = req.params;
    try {
        const budgetRef = doc(db, "users", userId, "budgets", budgetId);
        await deleteDoc(budgetRef);
        res.status(200).send(`Budget deleted with ID: ${budgetId}`);
    } catch (error) {
        console.error("Error deleting budget: ", error);
        res.status(500).send("Error deleting budget");
    }
});

app.post('/api/expenses', async (req, res) => {
    const { userId, category, amount, date } = req.body;
    const formattedCategory = category.trim().charAt(0).toUpperCase() + category.toLowerCase().slice(1);

    try {
        const budgetsRef = collection(db, "users", userId, "budgets");
        const budgetSnapshot = await getDocs(budgetsRef);
        const categoryExists = budgetSnapshot.docs.some(doc => doc.data().category === formattedCategory);

        if (!categoryExists) {
            return res.status(400).json({ error: "Expense category does not match any existing budget categories." });
        }

        const expensesRef = collection(db, "users", userId, "expenses");
        const expenseRef = await addDoc(expensesRef, { category: formattedCategory, amount, date });
        res.status(201).json({ id: expenseRef.id, category: formattedCategory, amount, date });
    } catch (error) {
        console.error("Error logging expense: ", error);
        res.status(500).json({ error: "Error logging expense" });
    }
});

app.get('/api/expenses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const expensesRef = collection(db, "users", userId, "expenses");
        const querySnapshot = await getDocs(expensesRef);
        const expenses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error retrieving expenses: ", error);
        res.status(500).send("Error retrieving expenses");
    }
});

app.put('/api/expenses/:userId/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;
    const { category, amount, date } = req.body;
    const formattedCategory = category.trim().charAt(0).toUpperCase() + category.toLowerCase().slice(1);

    try {
        const expenseRef = doc(db, "users", userId, "expenses", expenseId);
        await updateDoc(expenseRef, { category: formattedCategory, amount, date });
        res.status(200).json({ message: `Expense updated with ID: ${expenseId}`, category: formattedCategory, amount, date });
    } catch (error) {
        console.error("Error updating expense: ", error);
        res.status(500).json({ error: "Error updating expense" });
    }
});

app.delete('/api/expenses/:userId/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;
    try {
        const expenseRef = doc(db, "users", userId, "expenses", expenseId);
        await deleteDoc(expenseRef);
        res.status(200).send(`Expense deleted with ID: ${expenseId}`);
    } catch (error) {
        console.error("Error deleting expense: ", error);
        res.status(500).send("Error deleting expense");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});