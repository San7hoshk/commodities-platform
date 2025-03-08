import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertComparisonSearchSchema, insertCommoditySchema, insertSupplierSchema, insertShippingMethodSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes for commodity operations
  app.get("/api/commodities", async (req, res) => {
    try {
      const commodities = await storage.getCommodities();
      res.json(commodities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commodities" });
    }
  });

  app.get("/api/commodities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid commodity ID" });
      }
      
      const commodity = await storage.getCommodity(id);
      if (!commodity) {
        return res.status(404).json({ message: "Commodity not found" });
      }
      
      res.json(commodity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commodity" });
    }
  });

  app.post("/api/commodities", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertCommoditySchema.parse(req.body);
      const commodity = await storage.createCommodity(validatedData);
      res.status(201).json(commodity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create commodity" });
    }
  });

  // API routes for supplier operations
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // API routes for shipping method operations
  app.get("/api/shipping-methods", async (req, res) => {
    try {
      const methods = await storage.getShippingMethods();
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipping methods" });
    }
  });

  // API routes for subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  // API route for getting user subscription
  app.get("/api/user-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      
      const plan = await storage.getSubscriptionPlan(subscription.planId);
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      
      res.json({
        subscription,
        plan
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });

  // API route for comparison searches
  app.post("/api/compare", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      // Get user's subscription
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription) {
        return res.status(403).json({ message: "No active subscription" });
      }
      
      const plan = await storage.getSubscriptionPlan(subscription.planId);
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      
      // Check if user has reached comparison limit
      if (plan.comparisonsPerMonth !== -1 && subscription.comparisonsUsed >= plan.comparisonsPerMonth) {
        return res.status(403).json({ message: "Monthly comparison limit reached" });
      }
      
      // Validate input data
      const searchSchema = insertComparisonSearchSchema.omit({ userId: true });
      const validatedData = searchSchema.parse(req.body);
      
      // Create comparison search
      const search = await storage.createComparisonSearch({
        ...validatedData,
        userId: req.user.id
      });
      
      // Update usage count
      await storage.updateUserSubscriptionUsage(
        subscription.id, 
        subscription.comparisonsUsed + 1
      );
      
      // For MVP, we'll return dummy comparison results
      // In production, this would query real commodity and shipping prices
      const dummyResults = generateDummyComparisonResults(search.id);
      
      res.status(201).json({
        search,
        results: dummyResults
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to perform comparison" });
    }
  });

  // API route for getting user's search history
  app.get("/api/search-history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const searches = await storage.getComparisonSearches(req.user.id);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });

  // Helper function to generate dummy comparison results for MVP
  function generateDummyComparisonResults(searchId: number) {
    const suppliers = [
      { name: "Eastern Traders Ltd", country: "India" },
      { name: "Global Rice Suppliers", country: "Pakistan" },
      { name: "Rice Express Ltd", country: "India" }
    ];
    
    return suppliers.map((supplier, index) => {
      const basePrice = 820 + Math.floor(Math.random() * 80); // 820-900
      const shippingCost = 110 + Math.floor(Math.random() * 80); // 110-190
      const totalPrice = basePrice + shippingCost;
      const minDays = 12 + Math.floor(Math.random() * 7); // 12-18
      const maxDays = minDays + Math.floor(Math.random() * 8); // minDays + (0-7)
      
      return {
        id: index + 1,
        searchId,
        supplier,
        commodityPrice: {
          price: basePrice * 100, // Convert to pence
          unit: "ton",
          grade: "Premium Grade"
        },
        shippingCost: {
          cost: shippingCost * 100, // Convert to pence
          method: "Sea Freight"
        },
        totalPrice: totalPrice * 100, // Convert to pence
        deliveryTime: `${minDays}-${maxDays} days`,
        isBestPrice: index === 0 // First result is best price
      };
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
