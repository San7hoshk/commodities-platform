import { users, User, InsertUser, commodities, Commodity, InsertCommodity, suppliers, Supplier, InsertSupplier, shippingMethods, ShippingMethod, InsertShippingMethod, commodityPrices, CommodityPrice, InsertCommodityPrice, shippingCosts, ShippingCost, InsertShippingCost, comparisonSearches, ComparisonSearch, InsertComparisonSearch, subscriptionPlans, SubscriptionPlan, InsertSubscriptionPlan, userSubscriptions, UserSubscription, InsertUserSubscription, comparisonResults, ComparisonResult, InsertComparisonResult } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Commodity operations
  getCommodities(): Promise<Commodity[]>;
  getCommodity(id: number): Promise<Commodity | undefined>;
  createCommodity(commodity: InsertCommodity): Promise<Commodity>;
  
  // Supplier operations
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Shipping method operations
  getShippingMethods(): Promise<ShippingMethod[]>;
  getShippingMethod(id: number): Promise<ShippingMethod | undefined>;
  createShippingMethod(method: InsertShippingMethod): Promise<ShippingMethod>;
  
  // Commodity price operations
  getCommodityPrices(): Promise<CommodityPrice[]>;
  getCommodityPrice(id: number): Promise<CommodityPrice | undefined>;
  getCommodityPricesByCommodity(commodityId: number): Promise<CommodityPrice[]>;
  createCommodityPrice(price: InsertCommodityPrice): Promise<CommodityPrice>;
  
  // Shipping cost operations
  getShippingCosts(): Promise<ShippingCost[]>;
  getShippingCost(id: number): Promise<ShippingCost | undefined>;
  getShippingCostsByDestination(country: string, city?: string): Promise<ShippingCost[]>;
  createShippingCost(cost: InsertShippingCost): Promise<ShippingCost>;
  
  // Comparison search operations
  getComparisonSearches(userId: number): Promise<ComparisonSearch[]>;
  getComparisonSearch(id: number): Promise<ComparisonSearch | undefined>;
  createComparisonSearch(search: InsertComparisonSearch): Promise<ComparisonSearch>;
  
  // Subscription plan operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // User subscription operations
  getUserSubscription(userId: number): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscriptionUsage(id: number, comparisonsUsed: number): Promise<UserSubscription>;
  
  // Comparison result operations
  getComparisonResults(searchId: number): Promise<ComparisonResult[]>;
  getComparisonResult(id: number): Promise<ComparisonResult | undefined>;
  createComparisonResult(result: InsertComparisonResult): Promise<ComparisonResult>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private commodities: Map<number, Commodity>;
  private suppliers: Map<number, Supplier>;
  private shippingMethods: Map<number, ShippingMethod>;
  private commodityPrices: Map<number, CommodityPrice>;
  private shippingCosts: Map<number, ShippingCost>;
  private comparisonSearches: Map<number, ComparisonSearch>;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private userSubscriptions: Map<number, UserSubscription>;
  private comparisonResults: Map<number, ComparisonResult>;
  
  public sessionStore: session.SessionStore;
  private currentIds: {
    users: number;
    commodities: number;
    suppliers: number;
    shippingMethods: number;
    commodityPrices: number;
    shippingCosts: number;
    comparisonSearches: number;
    subscriptionPlans: number;
    userSubscriptions: number;
    comparisonResults: number;
  };

  constructor() {
    this.users = new Map();
    this.commodities = new Map();
    this.suppliers = new Map();
    this.shippingMethods = new Map();
    this.commodityPrices = new Map();
    this.shippingCosts = new Map();
    this.comparisonSearches = new Map();
    this.subscriptionPlans = new Map();
    this.userSubscriptions = new Map();
    this.comparisonResults = new Map();
    
    this.currentIds = {
      users: 1,
      commodities: 1,
      suppliers: 1,
      shippingMethods: 1,
      commodityPrices: 1,
      shippingCosts: 1,
      comparisonSearches: 1,
      subscriptionPlans: 1,
      userSubscriptions: 1,
      comparisonResults: 1,
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize some sample data
    this.initSampleData();
  }

  // Sample data initialization for demonstration purposes
  private initSampleData() {
    // Create sample subscription plans
    const freePlan: InsertSubscriptionPlan = {
      name: "Free Plan",
      description: "Basic access to commodity comparisons",
      monthlyPrice: 0,
      yearlyPrice: 0,
      comparisonsPerMonth: 10,
      features: ["Basic price comparisons", "Supplier contact information", "Limited analytics"],
    };
    
    const businessPlan: InsertSubscriptionPlan = {
      name: "Business Plan",
      description: "Enhanced features for small businesses",
      monthlyPrice: 4999, // £49.99
      yearlyPrice: 49990, // £499.90
      comparisonsPerMonth: 50,
      features: ["Real-time price comparisons", "Supplier contact information", "Basic analytics dashboard", "Price history tracking"],
    };
    
    const enterprisePlan: InsertSubscriptionPlan = {
      name: "Enterprise Plan",
      description: "Full access for large importers",
      monthlyPrice: 9999, // £99.99
      yearlyPrice: 99990, // £999.90
      comparisonsPerMonth: -1, // Unlimited
      features: ["Real-time price comparisons", "Supplier contact information", "Advanced analytics dashboard", "Price history tracking", "API access for system integration", "Advanced price trend analytics"],
    };
    
    this.createSubscriptionPlan(freePlan);
    this.createSubscriptionPlan(businessPlan);
    this.createSubscriptionPlan(enterprisePlan);
    
    // Create sample shipping methods
    const seaFreight: InsertShippingMethod = {
      name: "Sea Freight",
      estimatedDays: 18,
      description: "Standard sea freight shipping",
    };
    
    const airFreight: InsertShippingMethod = {
      name: "Air Freight",
      estimatedDays: 3,
      description: "Express air freight shipping",
    };
    
    const railFreight: InsertShippingMethod = {
      name: "Rail Freight",
      estimatedDays: 12,
      description: "Rail freight via land routes",
    };
    
    this.createShippingMethod(seaFreight);
    this.createShippingMethod(airFreight);
    this.createShippingMethod(railFreight);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, role: "user" };
    this.users.set(id, user);
    return user;
  }

  // Commodity operations
  async getCommodities(): Promise<Commodity[]> {
    return Array.from(this.commodities.values());
  }

  async getCommodity(id: number): Promise<Commodity | undefined> {
    return this.commodities.get(id);
  }

  async createCommodity(commodity: InsertCommodity): Promise<Commodity> {
    const id = this.currentIds.commodities++;
    const newCommodity: Commodity = { ...commodity, id };
    this.commodities.set(id, newCommodity);
    return newCommodity;
  }

  // Supplier operations
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentIds.suppliers++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  // Shipping method operations
  async getShippingMethods(): Promise<ShippingMethod[]> {
    return Array.from(this.shippingMethods.values());
  }

  async getShippingMethod(id: number): Promise<ShippingMethod | undefined> {
    return this.shippingMethods.get(id);
  }

  async createShippingMethod(method: InsertShippingMethod): Promise<ShippingMethod> {
    const id = this.currentIds.shippingMethods++;
    const newMethod: ShippingMethod = { ...method, id };
    this.shippingMethods.set(id, newMethod);
    return newMethod;
  }

  // Commodity price operations
  async getCommodityPrices(): Promise<CommodityPrice[]> {
    return Array.from(this.commodityPrices.values());
  }

  async getCommodityPrice(id: number): Promise<CommodityPrice | undefined> {
    return this.commodityPrices.get(id);
  }

  async getCommodityPricesByCommodity(commodityId: number): Promise<CommodityPrice[]> {
    return Array.from(this.commodityPrices.values()).filter(
      (price) => price.commodityId === commodityId,
    );
  }

  async createCommodityPrice(price: InsertCommodityPrice): Promise<CommodityPrice> {
    const id = this.currentIds.commodityPrices++;
    const newPrice: CommodityPrice = { 
      ...price, 
      id, 
      updatedAt: new Date() 
    };
    this.commodityPrices.set(id, newPrice);
    return newPrice;
  }

  // Shipping cost operations
  async getShippingCosts(): Promise<ShippingCost[]> {
    return Array.from(this.shippingCosts.values());
  }

  async getShippingCost(id: number): Promise<ShippingCost | undefined> {
    return this.shippingCosts.get(id);
  }

  async getShippingCostsByDestination(country: string, city?: string): Promise<ShippingCost[]> {
    return Array.from(this.shippingCosts.values()).filter(
      (cost) => cost.destinationCountry === country && 
                (!city || cost.destinationCity === city)
    );
  }

  async createShippingCost(cost: InsertShippingCost): Promise<ShippingCost> {
    const id = this.currentIds.shippingCosts++;
    const newCost: ShippingCost = { 
      ...cost, 
      id, 
      updatedAt: new Date() 
    };
    this.shippingCosts.set(id, newCost);
    return newCost;
  }

  // Comparison search operations
  async getComparisonSearches(userId: number): Promise<ComparisonSearch[]> {
    return Array.from(this.comparisonSearches.values())
      .filter((search) => search.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getComparisonSearch(id: number): Promise<ComparisonSearch | undefined> {
    return this.comparisonSearches.get(id);
  }

  async createComparisonSearch(search: InsertComparisonSearch): Promise<ComparisonSearch> {
    const id = this.currentIds.comparisonSearches++;
    const newSearch: ComparisonSearch = { 
      ...search, 
      id, 
      createdAt: new Date(),
      filters: search.filters || {}
    };
    this.comparisonSearches.set(id, newSearch);
    return newSearch;
  }

  // Subscription plan operations
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.currentIds.subscriptionPlans++;
    const newPlan: SubscriptionPlan = { ...plan, id };
    this.subscriptionPlans.set(id, newPlan);
    return newPlan;
  }

  // User subscription operations
  async getUserSubscription(userId: number): Promise<UserSubscription | undefined> {
    return Array.from(this.userSubscriptions.values()).find(
      (sub) => sub.userId === userId && sub.isActive,
    );
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const id = this.currentIds.userSubscriptions++;
    const newSubscription: UserSubscription = { 
      ...subscription, 
      id,
      comparisonsUsed: subscription.comparisonsUsed || 0,
      isActive: subscription.isActive !== undefined ? subscription.isActive : true,
      startDate: subscription.startDate || new Date()
    };
    this.userSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateUserSubscriptionUsage(id: number, comparisonsUsed: number): Promise<UserSubscription> {
    const subscription = this.userSubscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription with ID ${id} not found`);
    }
    
    const updatedSubscription: UserSubscription = {
      ...subscription,
      comparisonsUsed,
    };
    
    this.userSubscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Comparison result operations
  async getComparisonResults(searchId: number): Promise<ComparisonResult[]> {
    return Array.from(this.comparisonResults.values())
      .filter((result) => result.searchId === searchId)
      .sort((a, b) => a.totalPrice - b.totalPrice);
  }

  async getComparisonResult(id: number): Promise<ComparisonResult | undefined> {
    return this.comparisonResults.get(id);
  }

  async createComparisonResult(result: InsertComparisonResult): Promise<ComparisonResult> {
    const id = this.currentIds.comparisonResults++;
    const newResult: ComparisonResult = { 
      ...result, 
      id, 
      createdAt: new Date() 
    };
    this.comparisonResults.set(id, newResult);
    return newResult;
  }
}

export const storage = new MemStorage();
