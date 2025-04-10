import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKj4i9xunI9d--uU5yG5Lf86fgKYlMfWQ",
  authDomain: "sl-number-finder.firebaseapp.com",
  projectId: "sl-number-finder",
  storageBucket: "sl-number-finder.firebasestorage.app",
  messagingSenderId: "235702134881",
  appId: "1:235702134881:web:4ca8d41c7187a9d8c5e220",
  measurementId: "G-QZD1P56V73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Search Button Logic
document.getElementById('searchBtn').addEventListener('click', async () => {
  const phone = document.getElementById('phone').value.trim();

  if (!phone) {
    showAlert("Please enter a phone number.");
    return;
  }

  const docRef = doc(db, "numbers", phone);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById('name').innerText = data.name || '-';
    document.getElementById('location').innerText = data.location || '-';
    document.getElementById('contributor').innerText = data.contributor || '-';
    document.getElementById('profilePic').src = data.profilePic || 'https://via.placeholder.com/100';
    document.getElementById('result').classList.remove('hidden');
  } else {
    showNotFoundAlert(); // Show 'Number not found' alert
  }
});

// Modal Trigger Logic (For Adding New Number)
document.getElementById('addNewNumberBtn').addEventListener('click', () => {
  document.getElementById('popupModal').classList.remove('hidden'); // Show modal
});

// Close Modal
document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('popupModal').classList.add('hidden'); // Hide modal
});

// Submit New Number to Firestore
document.getElementById('submitBtn').addEventListener('click', async () => {
  const phone = document.getElementById('addPhone').value.trim();
  const name = document.getElementById('addName').value.trim();
  const location = document.getElementById('addLocation').value.trim();
  const contributor = document.getElementById('addContributor').value.trim();
  const profilePic = document.getElementById('addProfilePic').value.trim();

  if (!phone || !name || !location || !contributor) {
    showAlert("Please fill all required fields.");
    return;
  }

  try {
    await setDoc(doc(db, "numbers", phone), {
      name,
      location,
      contributor,
      profilePic
    });

    showAlert("✅ Number added successfully!");
    document.getElementById('popupModal').classList.add('hidden'); // Close the modal
    clearModalInputs(); // Clear inputs
  } catch (error) {
    console.error("Error adding document: ", error);
    showAlert("❌ Failed to add number. Check console for details.");
  }
});

// Function to Show Alert Box
function showAlert(message) {
  document.getElementById('alertMessage').innerText = message;
  document.getElementById('alertBox').classList.remove('hidden'); // Show alert
  setTimeout(() => {
    document.getElementById('alertBox').classList.add('hidden'); // Hide alert after 5 seconds
  }, 5000);
}

// Close Alert Manually
document.getElementById('closeAlertBtn').addEventListener('click', () => {
  document.getElementById('alertBox').classList.add('hidden');
});

// Clear Modal Inputs After Submission
function clearModalInputs() {
  ['addPhone', 'addName', 'addLocation', 'addContributor', 'addProfilePic'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// Function to Show 'Number Not Found' Alert Box
function showNotFoundAlert() {
    // Display the alert box for number not found
    document.getElementById('notFoundAlertBox').classList.remove('hidden');
    
    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      document.getElementById('notFoundAlertBox').classList.add('hidden');
    }, 5000);
}
  
// Close the 'Number not found' alert manually
document.getElementById('closeNotFoundAlertBtn').addEventListener('click', () => {
  document.getElementById('notFoundAlertBox').classList.add('hidden');
});
