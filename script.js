
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAjrtNW7FWTA6VCtRxpV1XsHI1tDmXz-1A",
    authDomain: "counter-3dc4a.firebaseapp.com",
    projectId: "counter-3dc4a",
    storageBucket: "counter-3dc4a.appspot.com",
    messagingSenderId: "731550094260",
    appId: "1:731550094260:web:b99aafdba8ca63c15558e1",
    measurementId: "G-06JPNHFM6K"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("nameInput");
const clickBtn = document.getElementById("clickBtn");
const totalClicks = document.getElementById("totalClicks");
const userName = document.getElementById("name");

totalClicks.classList.add("hidden");
clickBtn.classList.add("hidden");
userName.classList.add("hidden");

submitBtn.addEventListener("click", function () {
    const valueOfInput = nameInput.value.trim();
    if (valueOfInput === "") {
        alert("Please enter your name.");
        return;
    }
    submitBtn.classList.add("hidden");
    nameInput.classList.add("hidden");
    totalClicks.classList.remove("hidden");
    clickBtn.classList.remove("hidden");
    userName.classList.remove("hidden");
    userName.textContent = `${valueOfInput}`;
    getUserData(valueOfInput);
});

clickBtn.addEventListener("click", async function () {
    const valueOfInput = nameInput.value.trim();
    if (valueOfInput === "") {
        alert("Please enter your name before clicking.");
        return;
    }

    const userDocRef = doc(db, "users", valueOfInput);

    try {
      
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            await updateDoc(userDocRef, {
                clicks: increment(1),
                name: valueOfInput
            });
        } else {
          
            await setDoc(userDocRef, {
                name: valueOfInput,
                clicks: 1
            });
        }

        const updatedUserDoc = await getDoc(userDocRef);
        const updatedClicks = updatedUserDoc.data().clicks;

        const globalDocRef = doc(db, "global", "clicks");
        await updateDoc(globalDocRef, {
            totalClicks: increment(1)
        });

        const globalDoc = await getDoc(globalDocRef);
        const globalClicks = globalDoc.data().totalClicks;

        totalClicks.textContent = `Total clicks around the world: ${globalClicks}`;
        userName.textContent = `${valueOfInput} just clicked`;

        userName.classList.remove("hidden");
        userName.classList.remove("fade-out");
        setTimeout(() => {
            userName.classList.add("fade-out");
        }, 100);
        setTimeout(() => {
            userName.classList.add("hidden");
        }, 2000);

    } catch (error) {
        console.error("Error updating user data: ", error);
    }
});

const getUserData = async (userName) => {
    const userDocRef = doc(db, "users", userName);
    const globalDocRef = doc(db, "global", "clicks");

    try {
        const userDoc = await getDoc(userDocRef);
        const globalDoc = await getDoc(globalDocRef);

        if (userDoc.exists()) {
            const userClicks = userDoc.data().clicks;
            totalClicks.textContent = `Total clicks around the world: ${globalDoc.data().totalClicks}`;
            userName.textContent = `${userName} just clicked`;
        } else {
            totalClicks.textContent = `Total clicks around the world: ${globalDoc.data().totalClicks}`;
            userName.textContent = `${userName} is the first click`;
        }
    } catch (error) {
        console.error("Error fetching user data: ", error);
    }
};

const initGlobalClicks = async () => {
    const globalDocRef = doc(db, "global", "clicks");
    const globalDoc = await getDoc(globalDocRef);

    if (!globalDoc.exists()) {
        await setDoc(globalDocRef, {
            totalClicks: 0
        });
    }
};

initGlobalClicks();
