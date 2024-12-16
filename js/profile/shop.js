import{onAuthStateChanged,auth,db,doc,getDoc,getDocs,setDoc,updateDoc,collection}from"../util/firebase.js";import{isUserVaild,UserReasons}from"../util/auth_helper.js";let packdata=null,_packdata=await fetch("../../asset/blues.json");async function checkVaild(o,c){return new Promise(async(e,t)=>{var n=isUserVaild(o,c);if(n.reason==UserReasons.OVERDUE)location.href="../auth/overdue.html";else if(n.reason==UserReasons.BANNED)(a=document.createElement("dialog")).innerHTML=`
            <h1>You're banned.</h1>
            <p>Reason: ${n.banReason}</p>
            <br>
            <b>You can resolve this by contacting the developer.</b>
            <button class="puffy_button danger" id="logout__ban">Logout</button>
        `,document.body.append(a),a.showModal(),document.getElementById("logout__ban").addEventListener("click",async()=>{await signOut(auth),location.href="../index.html"});else if(n.reason==UserReasons.TEMPBANNED){var a=document.createElement("dialog"),i=1e3*n.endsOn.seconds,i=new Date(i).getTime();let e=Math.floor((i-Date.now())/864e5),t="days";console.log(e),0==e&&(e=Math.floor((i-Date.now())/36e5),t="hours",0==e)&&(e=Math.floor((i-Date.now())/6e4),t="minutes"),a.innerHTML=`
            <h1>You're banned.</h1>
            <p>Reason: ${n.banReason}</p>
            <p>Ends in ${e} ${t}.</p>
            <br>
            <b>You can resolve this sooner by contacting the developer.</b>
            <button class="puffy_button danger" id="logout__ban">Logout</button>
        `,document.body.append(a),a.showModal(),void document.getElementById("logout__ban").addEventListener("click",async()=>{await signOut(auth),location.href="../index.html"})}else n.reason==UserReasons.OTHER&&showNotification(3,"Something went wrong checking user info. Continuing as normal."),e()})}let allPacks=(packdata=await _packdata.json()).packs,allSpecials=packdata.specials,localCost=0,isSaving=!1,confetti=new JSConfetti;async function wait(n){return new Promise(async(e,t)=>{setTimeout(()=>{e()},1e3*n)})}function monthToText(e){switch(e){case 0:return"Janurary";case 1:return"Feburary";case 2:return"March";case 3:return"April";case 4:return"May";case 5:return"June";case 6:return"July";case 7:return"August";case 8:return"September";case 9:return"October";case 10:return"November";case 11:return"December"}}function weighted_random(e,t){for(var n=1;n<t.length;n++)t[n]+=t[n-1];var a=Math.random()*t[t.length-1];for(n=0;n<t.length&&!(a<t[n]);n++);return e[n]}async function saveLocalCoins(){return new Promise(async(e,t)=>{isSaving=!0;var n=doc(db,"users",auth.currentUser.uid);document.getElementById("allcoins").innerHTML=localCost.toLocaleString(),await updateDoc(n,{tokens:localCost}),isSaving=!1,e()})}async function saveBlue(c){return new Promise(async(e,t)=>{isSaving=!0;var n=doc(db,"users",auth.currentUser.uid,"blues",c);let a;var i=await getDoc(n).then(e=>(a=e.exists(),e.data()));let o=0;a?(o=i.amount,await updateDoc(n,{amount:o+1})):await setDoc(n,{amount:1,pack:packdata.blues[c].pack}),isSaving=!1,console.log("Success. new amount: "+(o+1)),e()})}async function buyPack(e){var t=allPacks[e].cost;if(isSaving)showNotification(3,"Trying to save. Please try again.");else if(t>localCost)showNotification(3,"Not enough tokens!");else{localCost-=t;t=packdata.packs[e].blues;let n=[];Object.entries(t).forEach((e,t)=>{e=packdata.blues[e[1]];n.push(e.chance)});t=weighted_random(t,n);startAnimationSequence("../asset/packs/"+allPacks[e].graphic,t,packdata.blues[t]),document.getElementById("unlockScreen").style.backgroundImage=`linear-gradient(${allPacks[e].buyBackground[0]}, ${allPacks[e].buyBackground[1]})`,allPacks[e].buyBackground,await saveLocalCoins(),saveBlue(t)}}async function startAnimationSequence(e,t,n){var a=document.getElementById("quickTransition").checked,i=document.getElementById("unlockScreen"),o=document.getElementById("unlockcenter");o.children[0].src=e,document.getElementById("unlockedimg").src="../asset/char/"+n.imgPath,document.getElementById("unlockedName").innerHTML=t,document.getElementById("unlockedRarity").innerHTML=n.rarity+` (${n.chance}%)`,console.log(n),i.removeAttribute("hide"),a||await wait(.5),o.setAttribute("shake",""),a?await wait(.5):await wait(1),o.removeAttribute("shake"),o.setAttribute("leaveframe",""),a?await wait(.25):await wait(.5),n.chance<=1&&confetti.addConfetti(),o.removeAttribute("leaveframe"),o.setAttribute("hide",""),a?await wait(.5):await wait(1),i.setAttribute("hide",""),o.removeAttribute("hide")}async function playSpecialUnlockAnim(){return new Promise(async(e,t)=>{var n=document.getElementById("specialUnlock");n.parentElement.parentElement.removeAttribute("hide"),await wait(.5),n.style.animation="unlocked 1s infinite ease-in-out",await wait(2),n.removeAttribute("hide"),n.style.animation="specialUnlock 750ms",await wait(1),n.style.animation="",await wait(.25),document.getElementById("unlockedText").removeAttribute("hide"),await wait(1),e()})}function showPackInfo(e){var e=allPacks[e],t=e.display_name,n=e.cost,a=e.graphic,i=e.blues;document.getElementById("info_icon").src="../asset/packs/"+a,document.getElementById("info_name").innerHTML=t,document.getElementById("info_price").innerHTML=n,document.getElementById("info_blues").innerHTML=i.toString(),document.getElementById("limited").style.display="none",null!=e.ends_on&&(document.getElementById("limited").style.display="unset",a=new Date(e.ends_on),document.getElementById("offer_end").innerHTML=`${monthToText(a.getMonth())} ${a.getDate()}, `+a.getFullYear()),document.getElementById("packdata").showModal()}async function addAllPacks(){return new Promise(async e=>{Object.entries(allPacks).forEach((t,e)=>{let n=t[0];var t=t[1],a=(console.log(n,t),t.buyable);if(0!=a){var a=t.display_name,i=t.cost,o=t.graphic;if(null!=t.ends_on)if(new Date(t.ends_on).getTime()-(new Date).getTime()<=0)return;var c=document.getElementById("packex").cloneNode(!0);c.id=n,c.children[0].src="../asset/packs/"+o;let e=c.children[1];e.children[0].innerHTML=a,null!=t.ends_on&&(e.children[0].innerHTML='<i title="Limited time! Click the info button to learn more." class="fa-solid fa-clock fa-xs"></i> '+a),e.children[1].innerHTML="Cost: "+i+" coins",e.children[2].children[0].addEventListener("click",()=>{buyPack(n),e.children[2].children[0].blur()}),e.children[2].children[1].addEventListener("click",()=>showPackInfo(n)),document.getElementById("allPacks").append(c)}}),e()})}async function addAllSpecials(){return new Promise(async(e,t)=>{var n=Object.entries(allSpecials),a=await getDocs(collection(db,"users",auth.currentUser.uid,"blues"));let l=[];a.forEach((e,t)=>{l.push(e.id)}),n.forEach((n,e)=>{let a=n[0],i=n[1],o=(console.log(a,i),document.getElementById("nolimitedtime")&&document.getElementById("nolimitedtime").remove(),i.bluedata);var n=i.cost,c=packdata.blues[i.bluedata].imgPath,s=new Date(i.endsOn).getTime()-(new Date).getTime();if(!(s<=0)){s=Math.round(s/864e5);let e=document.getElementById("specialex").cloneNode(!0),t=(e.id=a,e.children[0].src="../asset/char/"+c,e.children[1]);l.includes(a)&&(t.children[2].children[1].innerHTML='<i class="fa-solid fa-star"></i> Claimed',t.children[2].children[1].setAttribute("disabled","true")),t.children[0].innerHTML=o,t.children[1].innerHTML="Cost: "+n+" coins",t.children[2].children[0].children[0].innerHTML=s,t.children[2].children[1].addEventListener("click",async()=>{l.includes(a)||(t.children[2].children[1].innerHTML="Working...",await saveBlue(i.bluedata),document.getElementById("specialUnlock").src=e.children[0].src,document.getElementById("unlockeddd").innerHTML=o,await playSpecialUnlockAnim(),location.reload())}),document.getElementById("allSpecials").append(e)}}),e()})}console.log(new Date(2024,5,25)),onAuthStateChanged(auth,async e=>{var t,a;e?(t=e.uid,t=doc(db,"users",t),await checkVaild(e,a=await getDoc(t).then(e=>e.data())),document.getElementById("allcoins").innerHTML=a.tokens.toLocaleString(),"true"==localStorage.getItem("fastPackOpening")&&(document.getElementById("quickTransition").checked=!0),await addAllPacks(),await addAllSpecials(),document.getElementById("quickTransition").addEventListener("change",()=>{var e=document.getElementById("quickTransition").checked;localStorage.setItem("fastPackOpening",e)}),document.getElementById("submitsuggestion").addEventListener("click",async()=>{document.getElementById("submitsuggestion").innerHTML="Sending...",document.getElementById("submitsuggestion").setAttribute("disabled","");var e=document.getElementById("packnamesuggest").value,t=document.getElementById("packcostsuggest").value,n=document.getElementById("packbluessuggest").value,e={content:`UID: ${auth.currentUser.uid}
----------------------
Pack name: ${e}
Pack cost: ${t} coins
Blues: `+n,username:a.username+" | BluekidPackRequest"};await fetch("https://discord.com/api/webhooks/1244834902046937100/8AXTHuz1Y4CT7ru7KgQwI4HQ1SZdCxFGnlcEoAHAmcr6w0X9OQDdFNT2ZRzu2jqeq5tV",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(e)}),document.getElementById("submitsuggestion").innerHTML="Thanks!"}),localCost=a.tokens):location.href="../auth/login.html"});