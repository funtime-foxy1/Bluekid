import{ref,realtime,realtimeUpdate,realtimeGet,onAuthStateChanged,auth,onValue,getDoc,doc,db}from"../../js/util/firebase.js";let gameId;class BluekidClient{static addPlayer(i){return new Promise(async(e,t)=>{var a=auth.currentUser,r=ref(realtime,"games/"+gameId),n=(await realtimeGet(r)).val().players||[],s=await getDoc(doc(db,"users/"+a.uid)),a=n.push({uid:a.uid,username:i,hasAccount:s.exists()});await realtimeUpdate(r,{players:n}),sendEventToOwner("bluekid__playerjoin",{username:i,hasAccount:s.exists()}),e(a)})}static setGameId(e){gameId=e}}var allListeners=[];async function sendEventToOwner(n,s){return new Promise(async(e,t)=>{var a=auth.currentUser,a=(console.log(s),{rid:Math.round(1e8*Math.random()),id:n,sender:a.uid,data:s}),r=ref(realtime,"games/"+gameId);await realtimeUpdate(r,{owner__event:a}),e()})}function listenForEvent(e,t){allListeners.push({id:e,callback:t})}function removeListenerForEvent(t){let a=-1;for(let e=0;e<allListeners.length;e++)allListeners[e].id===t&&(a=e);return-1==a?(console.log("Could not find listener for event: "+t),!1):(allListeners.splice(a),!0)}onAuthStateChanged(auth,async n=>{var e;n&&(e=ref(realtime,"games/"+gameId+"/event"),await realtimeGet(e),onValue(e,e=>{if(0!=e.exists()){var t=e.val(),a=t.data;console.log("Recieved event from owner: "+a.id);for(let e=0;e<allListeners.length;e++){var r=allListeners[e];r.id===t.id&&t.effectedPlayers.includes(n.uid)&&r.callback(a)}}}))});export{BluekidClient,sendEventToOwner,listenForEvent,removeListenerForEvent};