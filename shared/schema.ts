import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("user").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  companyName: true,
  email: true,
});

// Commodities model
export const commodities = pgTable("commodities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  grade: text("grade"),
  description: text("description"),
});

export const insertCommoditySchema = createInsertSchema(commodities).pick({
  name: true,
  type: true,
  grade: true,
  description: true,
});

// Suppliers model
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
});

export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  country: true,
  contactEmail: true,
  contactPhone: true,
});

// Shipping methods model
export const shippingMethods = pgTable("shipping_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  estimatedDays: integer("estimated_days").notNull(),
  description: text("description"),
});

export const insertShippingMethodSchema = createInsertSchema(shippingMethods).pick({
  name: true,
  estimatedDays: true,
  description: true,
});

// Commodity prices model
export const commodityPrices = pgTable("commodity_prices", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  supplierId: integer("supplier_id").notNull(),
  price: integer("price").notNull(), // Price in pence
  unit: text("unit").notNull(),
  availableQuantity: integer("available_quantity"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCommodityPriceSchema = createInsertSchema(commodityPrices).pick({
  commodityId: true,
  supplierId: true,
  price: true,
  unit: true,
  availableQuantity: true,
});

// Shipping costs model
export const shippingCosts = pgTable("shipping_costs", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  shippingMethodId: integer("shipping_method_id").notNull(),
  destinationCountry: text("destination_country").notNull(),
  destinationCity: text("destination_city"),
  baseCost: integer("base_cost").notNull(), // Base cost in pence
  costPerKg: integer("cost_per_kg").notNull(), // Cost per kg in pence
  minWeight: integer("min_weight"),
  maxWeight: integer("max_weight"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertShippingCostSchema = createInsertSchema(shippingCosts).pick({
  supplierId: true,
  shippingMethodId: true,
  destinationCountry: true,
  destinationCity: true,
  baseCost: true,
  costPerKg: true,
  minWeight: true,
  maxWeight: true,
});

// Comparison searches model
export const comparisonSearches = pgTable("comparison_searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  commodityId: integer("commodity_id").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
  destinationCountry: text("destination_country").notNull(),
  destinationCity: text("destination_city"),
  timeframe: integer("timeframe"), // Delivery timeframe in days
  createdAt: timestamp("created_at").defaultNow().notNull(),
  filters: json("filters").$type<Record<string, any>>(),
});

export const insertComparisonSearchSchema = createInsertSchema(comparisonSearches).pick({
  userId: true,
  commodityId: true,
  quantity: true,
  unit: true,
  destinationCountry: true,
  destinationCity: true,
  timeframe: true,
  filters: true,
});

// Subscription plans model
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  monthlyPrice: integer("monthly_price").notNull(), // Price in pence
  yearlyPrice: integer("yearly_price").notNull(), // Price in pence
  comparisonsPerMonth: integer("comparisons_per_month"),
  features: json("features").$type<string[]>(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).pick({
  name: true,
  description: true,
  monthlyPrice: true,
  yearlyPrice: true,
  comparisonsPerMonth: true,
  features: true,
});

// User subscriptions model
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  comparisonsUsed: integer("comparisons_used").default(0).notNull(),
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).pick({
  userId: true,
  planId: true,
  isActive: true,
  startDate: true,
  endDate: true,
  comparisonsUsed: true,
});

// Comparison results model
export const comparisonResults = pgTable("comparison_results", {
  id: serial("id").primaryKey(),
  searchId: integer("search_id").notNull(),
  commodityPriceId: integer("commodity_price_id").notNull(),
  shippingCostId: integer("shipping_cost_id").notNull(),
  totalPrice: integer("total_price").notNull(), // Total price in pence
  deliveryDays: integer("delivery_days").notNull(),
  isBestPrice: boolean("is_best_price").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertComparisonResultSchema = createInsertSchema(comparisonResults).pick({
  searchId: true,
  commodityPriceId: true,
  shippingCostId: true,
  totalPrice: true,
  deliveryDays: true,
  isBestPrice: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Commodity = typeof commodities.$inferSelect;
export type InsertCommodity = z.infer<typeof insertCommoditySchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type ShippingMethod = typeof shippingMethods.$inferSelect;
export type InsertShippingMethod = z.infer<typeof insertShippingMethodSchema>;

export type CommodityPrice = typeof commodityPrices.$inferSelect;
export type InsertCommodityPrice = z.infer<typeof insertCommodityPriceSchema>;

export type ShippingCost = typeof shippingCosts.$inferSelect;
export type InsertShippingCost = z.infer<typeof insertShippingCostSchema>;

export type ComparisonSearch = typeof comparisonSearches.$inferSelect;
export type InsertComparisonSearch = z.infer<typeof insertComparisonSearchSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;

export type ComparisonResult = typeof comparisonResults.$inferSelect;
export type InsertComparisonResult = z.infer<typeof insertComparisonResultSchema>;
