const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { auth, db } = require('./firebaseConfig');
const { doc, getDoc, setDoc } = require("firebase/firestore");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");


const app = express();
app.use(cors());  
app.use(compression());
app.use(express.json()); 

const PORT = 5000;

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

app.post('/api/setdata', async (req, res) => {
    try {
        await setDoc(doc(db, "testCollection", "testDoc"), {
            content: "Hello Firestore!"
        });
        res.status(200).send("Data set in Firestore");
    } catch (error) {
        console.error("Error setting document: ", error);
        res.status(500).send("Error setting document");
    }
});

app.get('/api/getdata', async (req, res) => {
    try {
        const docRef = doc(db, "testCollection", "testDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            res.status(200).json({ data: docSnap.data() });
        } else {
            res.status(404).send("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        res.status(500).send("Error getting document");
    }
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});