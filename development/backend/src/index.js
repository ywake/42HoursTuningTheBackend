const express = require('express')
const app = express();

app.use(express.json({ limit: '10mb' }))

const api = require("./api");

const fs = require('fs');
const pprof = require('pprof');
async function prof() {
  console.log("start to profile >>>");
  const profile = await pprof.time.profile({
    // durationMillis: 240000, // for development
    durationMillis: 30000, // for local
  });

  const buf = await pprof.encode(profile);
  fs.writeFile('wall.pb.gz', buf, (err) => {
    if (err) {
      throw err;
    }
  });
  
  const profile_heap = await pprof.heap.profile();
  const buf_heap = await pprof.encode(profile_heap);
  fs.writeFile('heap.pb.gz', buf_heap, (err) => {
    if (err) throw err;
  })

  console.log("<<< finished to profile");
}


app.get('/api/hello', (req, res) => {
  console.log('requested');
  res.send({ response: 'World!' })
})

app.post('/api/client/records', async (req, res, next) => {
  try {
    await api.postRecords(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/records/:recordId', async (req, res, next) => {
  try {
    await api.getRecord(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/record-views/tomeActive', async (req, res, next) => {
  try {
    await api.tomeActive(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/record-views/allActive', async (req, res, next) => {
  try {
    await api.allActive(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/record-views/allClosed', async (req, res, next) => {
  try {
    await api.allClosed(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/record-views/mineActive', async (req, res, next) => {
  try {
    await api.mineActive(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.put('/api/client/records/:recordId', async (req, res, next) => {
  try {
    await api.updateRecord(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/records/:recordId/comments', async (req, res, next) => {
  try {
    await api.getComments(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.post('/api/client/records/:recordId/comments', async (req, res, next) => {
  try {
    await api.postComments(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/categories', async (req, res, next) => {
  try {
    await api.getCategories(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.post('/api/client/files', async (req, res, next) => {
  try {
    await api.postFiles(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/records/:recordId/files/:itemId', async (req, res, next) => {
  try {
    await api.getRecordItemFile(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

app.get('/api/client/records/:recordId/files/:itemId/thumbnail', async (req, res, next) => {
  try {
    await api.getRecordItemFileThumbnail(req, res);
  } catch (e) {
    console.log(e);
    next(new Error("Unexpect"));
  }
})

prof();

// pprof related delete when submitting
prof();
// The average number of bytes between samples.
const intervalBytes = 512 * 1024;
// The maximum stack depth for samples collected.
const stackDepth = 64;

pprof.heap.start(intervalBytes, stackDepth); 

app.listen(8000, () => console.log('listening on port 8000...'))

