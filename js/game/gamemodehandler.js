let currentGamemode,gamemodeSelectedSettings={},settingObjects=[];function refreshSettings(){document.getElementById("settings").innerHTML="",console.log("refresh settings"),Object.entries(currentGamemode.settings).forEach((e,t)=>{var n=e[0],e=e[1],d=e.display;let r=document.getElementById("examplesection").cloneNode(!0);r.id=n,r.children[0].innerHTML=d,document.getElementById("settings").append(r),settingObjects=[],Object.entries(e.settings).forEach((e,t)=>{var n=e[0];let d=e[1];var e=d.type,l=d.defaultValue,i=d.display,m=d.extraInfo,c={name:i,settingName:n};switch(e){case"bool":var o=document.getElementById("checkboxex").cloneNode(!0);if(o.id="",o.setAttribute("for",n),o.children[0].id=n,o.children[0].checked=l,o.children[2].innerHTML=i,null!=m&&(o.children[2].innerHTML+=` <i class="fa-solid fa-circle-question" title="${m}"></i>`),r.append(o),c.type=Boolean,c.object=o.children[0],null!=gamemodeSelectedSettings[currentGamemode.id]){let e=gamemodeSelectedSettings[currentGamemode.id].get(n);o.children[0].checked=e}break;case"number":var o=document.getElementById("numberex").cloneNode(!0),s=(o.placeholder=l,o.value=l,o.id=n,o.style.fontSize="16px",document.createElement("label"));if(s.setAttribute("for",n),s.innerHTML=i,s.style.marginRight="5px",null!=m&&(s.innerHTML+=` <i class="fa-solid fa-circle-question" title="${m}"></i>`),r.append(s),r.append(o),c.type=Number,c.object=o,null!=gamemodeSelectedSettings[currentGamemode.id]){let e=gamemodeSelectedSettings[currentGamemode.id].get(n);o.value=e}}settingObjects.push(c)})})}function clickGamemode(e,t){currentGamemode=e,document.getElementById("host").getAttribute("disabled")&&document.getElementById("host").removeAttribute("disabled"),document.getElementById("testingOnly").style.display="none",e.limitedAccess&&!t.limitedAccess&&(document.getElementById("host").setAttribute("disabled","true"),document.getElementById("testingOnly").style.display="flex"),document.getElementById("gamemode_start").showModal(),document.getElementById("gamemodeName").innerHTML=e.display,document.getElementById("gamemodeDesc").innerHTML=e.description,document.getElementById("gamemodecover").src=e.cover,document.getElementById("modaltags").innerHTML="",e.tags.forEach((e,t)=>{var n=document.getElementById("modaltagex").cloneNode(!0);n.id="",n.innerHTML=e,document.getElementById("modaltags").append(n)})}export{currentGamemode,gamemodeSelectedSettings,settingObjects,refreshSettings,clickGamemode};