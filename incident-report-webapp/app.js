// Incident Report Log — vanilla JS. Persists to localStorage (runs fully client-side).
const KEY = 'incident-log-v1';
const $ = s => document.querySelector(s);
let logs = JSON.parse(localStorage.getItem(KEY) || '[]');

function save(){ localStorage.setItem(KEY, JSON.stringify(logs)); }
function fmt(ts){ return new Date(ts).toLocaleString(); }

function render(){
  const q = ($('#search').value || '').toLowerCase();
  const rows = logs.filter(l => (l.title+l.category).toLowerCase().includes(q))
                   .sort((a,b)=>b.createdAt-a.createdAt);
  const tb = $('#table tbody'); tb.innerHTML='';
  rows.forEach(l=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${fmt(l.createdAt)}</td><td>${l.title}</td><td>${l.category}</td>
      <td><span class="pill ${l.priority}">${l.priority}</span></td>
      <td><button class="del" data-id="${l.id}">Delete</button></td>`;
    tb.appendChild(tr);
  });
  $('#empty').style.display = rows.length ? 'none':'block';
  const high = logs.filter(l=>l.priority==='high').length;
  $('#stats').textContent = `${logs.length} total • ${high} high-priority`;
}

$('#form').addEventListener('submit', e=>{
  e.preventDefault();
  logs.push({ id:Date.now(), title:$('#title').value.trim(), category:$('#category').value,
    priority:$('#priority').value, notes:$('#notes').value.trim(), createdAt:Date.now() });
  save(); e.target.reset(); render();
});
$('#search').addEventListener('input', render);
$('#table').addEventListener('click', e=>{
  if(e.target.classList.contains('del')){
    logs = logs.filter(l=>l.id!==Number(e.target.dataset.id)); save(); render();
  }
});
render();
