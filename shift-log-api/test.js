// Lightweight tests using Node's built-in http + assert (no test framework needed).
const assert = require('assert');
const http = require('http');
const app = require('./server');
app._reset();
const server = app.listen(0);
const port = server.address().port;

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({ host:'127.0.0.1', port, path, method,
      headers: data ? {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)} : {} },
      res => { let b=''; res.on('data',c=>b+=c); res.on('end',()=>resolve({status:res.statusCode, body:b?JSON.parse(b):null})); });
    r.on('error', reject); if (data) r.write(data); r.end();
  });
}

(async () => {
  let r = await req('POST','/api/logs',{title:'Door alarm zone 3', category:'Alarm Response', priority:'high'});
  assert.strictEqual(r.status,201); assert.strictEqual(r.body.id,1);
  r = await req('POST','/api/logs',{title:'bad'}); assert.strictEqual(r.status,400); // missing category
  r = await req('GET','/api/logs'); assert.strictEqual(r.body.length,1);
  r = await req('GET','/api/logs?priority=high'); assert.strictEqual(r.body.length,1);
  r = await req('PUT','/api/logs/1',{priority:'medium'}); assert.strictEqual(r.body.priority,'medium');
  r = await req('DELETE','/api/logs/1'); assert.strictEqual(r.status,200);
  r = await req('GET','/api/logs'); assert.strictEqual(r.body.length,0);
  r = await req('GET','/api/logs/999'); assert.strictEqual(r.status,404);
  console.log('All API tests passed ✓');
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
