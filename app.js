import express from 'express'

const PORT = 3030;
const app = express();

app.listen(PORT, ()=> console.log(`Server listening at http://localhost:${PORT}`))