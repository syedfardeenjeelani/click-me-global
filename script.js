// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
// import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";

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
});

clickBtn.addEventListener("click", async function () {
    const valueOfInput = nameInput.value.trim();
    if (valueOfInput === "") {
        alert("Please enter your name before clicking.");
        return;
    }

    const globalDocRef = doc(db, "global", "clicks");

    try {
        const globalDocSnap = await getDoc(globalDocRef);

        if (!globalDocSnap.exists()) {
            await setDoc(globalDocRef, {
                lastClickedName: valueOfInput,
                totalClicks: 1
            });
        } else {
            await updateDoc(globalDocRef, {
                lastClickedName: valueOfInput,
                totalClicks: globalDocSnap.data().totalClicks + 1
            });
        }
    } catch (error) {
        console.error("Error updating global data: ", error);
    }
});

// Listen for real-time updates to the global document
onSnapshot(doc(db, "global", "clicks"), (doc) => {
    if (doc.exists()) {
        const data = doc.data();
        totalClicks.textContent = `Total clicks around the world: ${data.totalClicks}`;
        userName.textContent = `${data.lastClickedName} just clicked`;

        userName.classList.remove("hidden");
        userName.classList.remove("fade-out");
        setTimeout(() => {
            userName.classList.add("fade-out");
        }, 100);
        setTimeout(() => {
            userName.classList.add("hidden");
        }, 2000);
    }
});
