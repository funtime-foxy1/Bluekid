import{initializeApp}from"https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";let firebaseConfig={apiKey:"AIzaSyDB3PJ-cXM9thcOYhajlz15b8LiirZ44Kk",authDomain:"bluekid-303db.firebaseapp.com",databaseURL:"https://bluekid-303db-default-rtdb.firebaseio.com",projectId:"bluekid-303db",storageBucket:"bluekid-303db.appspot.com",messagingSenderId:"207140973406",appId:"1:207140973406:web:888dcf699a0e7d1e30fdcf"},app=initializeApp(firebaseConfig);import{getAuth,onAuthStateChanged,sendEmailVerification,signOut}from"https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";let auth=getAuth();onAuthStateChanged(auth,e=>{e?(document.getElementById("emailaddress").innerText=e.email,document.getElementById("logout").addEventListener("click",async()=>{await signOut(auth),location.href="../index.html"}),document.getElementById("delete").addEventListener("click",async()=>{alert("no")}),document.getElementById("send").addEventListener("click",async()=>{document.getElementById("send").innerHTML="Working...",document.getElementById("send").setAttribute("disabled",""),await sendEmailVerification(auth.currentUser),showNotification(4,"Check your email! (Make sure to check spam.)"),document.getElementById("send").innerHTML='<i class="fa-solid fa-envelope-circle-check"></i> Send verification',document.getElementById("send").removeAttribute("disabled")})):location.href="/login.html"});