// js/analytics.js
import { db, auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';


const params = new URLSearchParams(location.search);
const date = params.get('date');
const noData = document.getElementById('no-data');
const view = document.getElementById('analytics-view');
const analyticsDate = document.getElementById('analytics-date');
const totalHoursEl = document.getElementById('total-hours');
const activityCountEl = document.getElementById('activity-count');


onAuthStateChanged(auth, async (user) => {
if(!user) { window.location.href='index.html'; return; }
if(!date) { showNoData(); return; }
const userDoc = doc(db, 'users', user.uid, 'days', date);
const snap = await getDoc(userDoc);
if(!snap.exists()) { showNoData(); return; }
const data = snap.data();
const activities = data.activities || [];
if(activities.length === 0) { showNoData(); return; }
showAnalytics(date, activities);
});


function showNoData(){ noData.classList.remove('hidden'); view.classList.add('hidden'); }


function showAnalytics(dateStr, activities){
noData.classList.add('hidden'); view.classList.remove('hidden');
analyticsDate.textContent = dateStr;
const total = activities.reduce((s,a)=>s+Number(a.minutes),0);
totalHoursEl.textContent = (total/60).toFixed(2);
activityCountEl.textContent = activities.length;


// category aggregation
const agg = {};
activities.forEach(a=>{ agg[a.category] = (agg[a.category] || 0) + Number(a.minutes); });
const labels = Object.keys(agg);
const values = labels.map(l=>agg[l]);


// Pie chart
const ctx = document.getElementById('categoryChart').getContext('2d');
new Chart(ctx, { type:'pie', data:{ labels, datasets:[{ data: values }] }, options:{ responsive:true } });


// Bar chart of activities
const barLabels = activities.map(a=>a.title + ' ('+a.category+')');
const barValues = activities.map(a=>a.minutes);
const bctx = document.getElementById('barChart').getContext('2d');
new Chart(bctx, { type:'bar', data:{ labels: barLabels, datasets:[{ label:'Minutes', data: barValues }] }, options:{ responsive:true } });
}