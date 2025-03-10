import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const startServer = async (preferredPort: number, maxRetries = 3) => {
    for (let port = preferredPort; port < preferredPort + maxRetries; port++) {
      try {
        await new Promise((resolve, reject) => {
          server.listen(port)
            .once('listening', () => {
              log(`Server started on port ${port}`);
              resolve(true);
            })
            .once('error', (err: NodeJS.ErrnoException) => {
              if (err.code === 'EADDRINUSE') {
                log(`Port ${port} is in use, trying next port...`);
                server.close();
              }
              reject(err);
            });
        });
        return; // Server started successfully
      } catch (err) {
        if (port === preferredPort + maxRetries - 1) {
          throw new Error(`Could not find an available port after ${maxRetries} attempts`);
        }
        // Continue to next port
      }
    }
  };

  try {
    await startServer(3001);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Failed to start server:', err.message);
    } else {
      console.error('Failed to start server:', err);
    }
    process.exit(1);
  }
})();
