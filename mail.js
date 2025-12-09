  const firebaseConfig = {
    apiKey: "AIzaSyDvZYHuZ2NHVrTpS3NhVS0f1wDeW-phZ10",
    authDomain: "shaktiind-31e08.firebaseapp.com",
    databaseURL: "https://shaktiind-31e08-default-rtdb.firebaseio.com",
    projectId: "shaktiind-31e08",
    storageBucket: "shaktiind-31e08.firebasestorage.app",
    messagingSenderId: "394230439792",
    appId: "1:394230439792:web:2178e633cff48093f5b9b5"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Main node
const userDB = ref(db, "shaktiind/users");

// -----------------------------------------------------------
// SIGNUP (FULL ACCOUNT CREATION)
// -----------------------------------------------------------
document.getElementById('createAccountBtn').addEventListener("click", signupUser);

async function signupUser(e) {
    e.preventDefault();

    const gmail = getValue('gmail');
    const username = getValue('username');
    const password = getValue('password');
    const mobile = localStorage.getItem("signup_mobile");

    if (!gmail || !username || !password || !mobile) {
        alert("Please fill all the details!");
        return;
    }

    // --- check if username or mobile already exists ---
    const snap = await get(userDB);

    if (snap.exists()) {
        const users = snap.val();

        for (let id in users) {
            if (users[id].username === username) {
                alert("Username already exists. Try different one!");
                return;
            }
            if (users[id].mobile === mobile) {
                alert("Mobile number already registered!");
                return;
            }
        }
    }

    // --- Save user ---
    const newUserRef = push(userDB);
    await set(newUserRef, {
        gmail: gmail,
        username: username,
        password: password,
        mobile: mobile
    });

    // Show success alert
    document.querySelector('.alert').style.display = 'block';

    setTimeout(() => {
        window.location.href = "profile_setup.html";
    }, 2000);
}

// -----------------------------------------------------------
// LOGIN SYSTEM (mobile/username + password)
// -----------------------------------------------------------
document.getElementById("loginbtn")?.addEventListener("click", loginUser);

async function loginUser() {
    const loginId = getValue("loginid");
    const loginPass = getValue("loginPass");

    if (!loginId || !loginPass) {
        alert("Please enter login details");
        return;
    }

    const snap = await get(userDB);

    if (!snap.exists()) {
        alert("No users found!");
        return;
    }

    const users = snap.val();

    for (let id in users) {
        const user = users[id];

        // Match by username OR mobile
        if ((user.username === loginId || user.mobile === loginId) &&
            user.password === loginPass) {

                localStorage.setItem("logged_user_mobile", user.mobile);
            // Store session if needed
            localStorage.setItem("user_session", user.username);

            window.location.href = "Landing page2.html";
            return;
        }
    }

    alert("Invalid username/mobile or password!");
}

// -----------------------------------------------------------
function getValue(id) {
    return document.getElementById(id)?.value.trim();
}
