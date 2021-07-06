console.log(firebase);
const auth = firebase.auth();

const whenSignedIn = document.getElementById('when_signed_in');
const signInBtn = document.getElementById('sign_in_btn');
const whenSignedOut = document.getElementById('when_signed_out');
const signOutBtn = document.getElementById('sign_out_btn');
const userDetails = document.getElementById('user_details');

const googleProvider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(googleProvider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3> Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        console.log('no user');

        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

const db = firebase.firestore();

const thingsList = document.getElementById('things-list');
const createThing = document.getElementById('create-thing');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
    if (user) {
        thingsRef = db.collection('things');
        createThing.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp(),
            });
        };

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot((querySnapshot) => {
                const items = querySnapshot.docs.map(
                    (doc) => `<li>${doc.data().name}</li>`
                );

                thingsList.innerHTML = items.join('');
            });
    } else {
        unsubscribe && unsubscribe();
    }
});
