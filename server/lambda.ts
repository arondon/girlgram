import serverless from 'serverless-http';
import express, { type Request, type Response, type NextFunction } from 'express';
import { registerRoutes } from './routes';

async function createApp() {
  const app = express();
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // CORS headers for Lambda
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Register routes
  await registerRoutes(app);
  
  return app;
}

// For Lambda deployment
let app: express.Application;

export const handler = serverless(async (req: any, res: any) => {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
});

// For local testing
if (require.main === module) {
  createApp().then(app => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}