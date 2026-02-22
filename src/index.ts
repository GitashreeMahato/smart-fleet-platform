 import express, { Request, Response } from 'express';
 import { checkConnection } from './config/db';
 import dotenv from 'dotenv';
dotenv.config();
import routes from './routes'

const app= express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
  const db = await checkConnection();
    res.status(200).json({ 
      status: "OK", 
      message: "Fleet Optimization API is running 🚀",
      database: db.ok ? 'connected' : 'disconnected',
    ...(db.error && { databaseError: db.error }),
    })
})
app.get("/api", (req: Request, res: Response) => {
  res.json({ 
    message: "Welcome to Fleet Optimization Backend",
name: "Fleet Optimization API",
version: "1.0.0",
description: "API for optimizing fleet operations using AI and machine learning",
endpoints: ['/api/cars', '/api/subscriptions', '/api/assignments', '/api/reports']});
});

// start the server
app.use('/', routes);
app.listen(PORT, () => {
  console.log(`Smart Fleet API running at http://localhost:${PORT}`);
});


export default routes;
