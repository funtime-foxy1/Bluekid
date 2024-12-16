import{ref,realtimeSet,realtime,realtimeUpdate,realtimeGet,doc,db,getDoc,realtimeRemove,onAuthStateChanged,auth,onValue}from"../../js/util/firebase.js";let gameId="",gameSetup=!1;class Bluekid{static async GetPlayers(){return new Promise(async(t,e)=>{if(gameSetup){var a=ref(realtime,"games/"+gameId);let e=await realtimeGet(a);t(e=null==(e=e.val().players)?[]:e)}else e("Game not setup.")})}static async GetUIDPlayers(){return new Promise(async(e,t)=>{await this.GetPlayers();var a=[];for(let e=0;e<players.length;e++)a.push(players[e].uid);e(a)})}static async HasAccount(r){return new Promise(async(e,t)=>{var a;gameSetup?(a=doc(db,"users",r),e((await getDoc(a)).exists())):t("Game not setup.")})}}async function setupGame(r,n){return new Promise(async(e,t)=>{gameId=n.code;var a=ref(realtime,"games/"+gameId);await realtimeSet(a,{owner:r.uid,settings:n.settings,players:[],gamemode:n.gamemode,state:"menu",event:{id:"",data:{},effectedPlayers:[],rid:Math.round(1e8*Math.random())}}),gameSetup=!0,e()})}async function removeGame(){var e=ref(realtime,"games/"+gameId);console.log("what the sigma"),gameSetup=!1,gameId="",await realtimeRemove(e)}var allListeners=[];function init(){var e=ref(realtime,"games/"+gameId+"/owner__event");onValue(e,async e=>{if(0!=e.exists()){var a=e.val(),r=a.data;let t=await realtimeGet(ref(realtime,"games/"+gameId));t=t.val().owner__event;for(let e=0;e<allListeners.length;e++){var n=allListeners[e];n.id===a.id&&n.callback(t,r)}}})}async function sendEventToClients(n,s,i){return new Promise(async(e,t)=>{var a,r;gameSetup?(a={rid:Math.round(1e8*Math.random()),id:s,effectedPlayers:n,sender:auth.currentUser.uid,data:i},r=ref(realtime,"games/"+gameId),await realtimeUpdate(r,{event:a}),e()):t("Game not setup")})}function listenForEvent(e,t){allListeners.push({id:e,callback:t}),console.log(`Now listening for ${e}. New list:`,allListeners)}function removeListenerForEvent(t){let a=-1;for(let e=0;e<allListeners.length;e++)allListeners[e].id===t&&(a=e);return-1==a?(console.log("Could not find listener for event: "+t),!1):(allListeners.splice(a),!0)}export{gameId,Bluekid,setupGame,removeGame,init,sendEventToClients,listenForEvent,removeListenerForEvent};