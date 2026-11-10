const $ = (id) => document.getElementById(id);
let rows = [];
const personalDomains = new Set(["gmail.com","yahoo.com","outlook.com","hotmail.com","live.com","icloud.com","aol.com","proton.me","protonmail.com"]);
$("collect").addEventListener("click", async () => {
  $("status").textContent = "Checking the active tab…";
  rows = [];
  $("export").disabled = true;
  try {
    const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    if (!tab?.id || !tab.url) throw new Error("Open Google Search first.");
    const url = new URL(tab.url);
    if (url.hostname !== "www.google.com" || !url.pathname.startsWith("/search")) throw new Error("This extension currently works on google.com Search results pages.");
    const [{result}] = await chrome.scripting.executeScript({target:{tabId:tab.id},func:() => {
      const emailRe = /[A-Z0-9.!#$%&'*+/=?^`_{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/gi;
      const blocks = [...document.querySelectorAll("#search .MjjYud, #search .g, #rso .g")];
      const out = [];
      for (const block of blocks) {
        const text = block.innerText || "";
        const title = block.querySelector("h3")?.innerText?.trim() || "";
        const link = block.querySelector("a[href^='http']")?.href || location.href;
        for (const email of (text.match(emailRe) || [])) out.push({email:email.toLowerCase(),name:title,sourceUrl:link});
      }
      return out;
    }});
    const country = $("country").value.trim();
    const category = $("category").value.trim();
    if (!country) throw new Error("Enter the country before collecting.");
    const seen = new Set();
    rows = (result || []).filter(r => {
      const domain = r.email.split("@")[1];
      if (!domain || personalDomains.has(domain) || seen.has(r.email)) return false;
      seen.add(r.email);
      return true;
    }).map(r => ({email:r.email,name:r.name,country,category,sourceUrl:r.sourceUrl,consentStatus:"pending"}));
    $("status").textContent = rows.length ? rows.length + " unique business-domain email(s) found. Review sources before import." : "No visible business-domain emails found on this page. Try another query or open result pages manually.";
    $("export").disabled = !rows.length;
  } catch (error) { $("status").textContent = error.message || "Collection failed."; }
});
$("export").addEventListener("click", async () => {
  if (!rows.length) return;
  const headers = ["Email","Name","Country","Category","Source URL","Consent status"];
  const quote = v => '"' + String(v ?? "").replace(/"/g,'""') + '"';
  const csv = [headers,...rows.map(r=>[r.email,r.name,r.country,r.category,r.sourceUrl,r.consentStatus])].map(row=>row.map(quote).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const dataUrl = URL.createObjectURL(blob);
  await chrome.downloads.download({url:dataUrl,filename:"nexora-google-business-emails.csv",saveAs:true});
  $("status").textContent = "CSV export requested. These leads remain consent-pending and are not sent to Brevo.";
});