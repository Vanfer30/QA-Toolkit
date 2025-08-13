// ===============================
// 1. BASIC TYPES
// ===============================

// Declares a variable 'firstName' that must be a string, assigns "Jordan"
let firstName: string = "User";

// Declares 'age' that must be a number, assigns 33
let age: number = 33;

// Declares 'isQAEngineer' that must be a boolean, assigns true
let isQAEngineer: boolean = true;

// Prints values to the console using template literals (string interpolation)
console.log(`Name: ${firstName}, Age: ${age}, QA: ${isQAEngineer}`);

// Type inference (TS figures out the type without explicitly stating it)
let inferred = "Hello TypeScript"; // TypeScript infers this is of type 'string'

// Arrays of numbers
let numbers: number[] = [1, 2, 3];

// Arrays of strings (using generic syntax Array<string>)
let strings: Array<string> = ["apple", "banana"];

// Union type: variable can hold either a string OR a number
let mixed: string | number = "Hello"; // currently a string
mixed = 42; // now a number — both valid because of the union

// Literal type: variable can only hold exactly "admin" or "user"
let role: "admin" | "user" = "admin";

// ===============================
// 2. FUNCTIONS
// ===============================

// Function 'greet' takes a string parameter 'name' and returns a string
function greet(name: string): string {
  // Uses template literal to return a greeting
  return `Hello, ${name}`;
}
// Calls greet with "Jordan" and logs the result
console.log(greet("User"));

// Function with optional parameter 'userId' (can be omitted)
function logMessage(message: string, userId?: number): void {
  // '??' means "nullish coalescing" — if userId is null/undefined, use "N/A"
  console.log(`Message: ${message}, User ID: ${userId ?? "N/A"}`);
}
// Call with only message, userId will be undefined
logMessage("System running");

// Arrow function syntax: takes two numbers, returns their product
const multiply = (a: number, b: number): number => a * b;
// Call multiply(4, 5) => logs 20
console.log(multiply(4, 5));

// ===============================
// 3. INTERFACES & TYPES
// ===============================

// 'interface' defines the shape of an object
interface User {
  id: number; // required property
  name: string; // required property
  email?: string; // optional property (can be missing)
}

// Creates an object matching the User interface
const user1: User = {
  id: 1,
  name: "User",
};

// 'type' also defines a shape, here for a Point with x/y numbers
type Point = { x: number; y: number };

// Creates a Point object
const p1: Point = { x: 10, y: 20 };

// Interface extension: Employee inherits from User and adds 'position'
interface Employee extends User {
  position: string;
}

// Creates an Employee (must include User fields + position)
const emp1: Employee = { id: 2, name: "User", position: "QA Tester" };

// ===============================
// 4. ENUMS
// ===============================

// Enum with default numeric values: Pending=0, InProgress=1, Done=2
enum Status {
  Pending,
  InProgress,
  Done,
}
// Assigns currentStatus to Status.InProgress (value = 1)
let currentStatus: Status = Status.InProgress;
// Logs "Current Status: 1"
console.log("Current Status:", currentStatus);

// String enum: values are fixed strings, not numbers
enum Environment {
  Dev = "Development",
  Prod = "Production",
}
// Assigns 'env' to "Production"
let env: Environment = Environment.Prod;
// Logs "Production"
console.log(env);

// ===============================
// 5. CLASSES
// ===============================

// Class 'Person' has a public 'name' and a private 'age'
class Person {
  // 'public' means accessible anywhere; 'private' means only inside this class
  constructor(public name: string, private age: number) {}

  // Method that returns a greeting string
  greet(): string {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}
// Create a Person instance with name "Jordan", age 30
const person1 = new Person("User", 33);
// Call greet() => logs the greeting
console.log(person1.greet());

// Class 'QAEngineer' extends Person (inherits name & age)
class QAEngineer extends Person {
  // Adds new property 'tool' (public)
  constructor(name: string, age: number, public tool: string) {
    // Call the parent constructor to set name and age
    super(name, age);
  }

  // Method specific to QAEngineer
  test(): string {
    return `${this.name} is testing with ${this.tool}`;
  }
}
// Create QAEngineer instance
const qa = new QAEngineer("User", 33, "Cypress");
// Call test() => logs "Jordan is testing with Cypress"
console.log(qa.test());

// ===============================
// 6. GENERICS
// ===============================

// Generic function: 'T' is a placeholder for any type
function identity<T>(value: T): T {
  return value; // returns the value unchanged
}
// Call with explicit type 'string'
console.log(identity<string>("Hello"));
// Call with explicit type 'number'
console.log(identity<number>(123));

// Generic interface: 'T' allows flexible 'data' type
interface ApiResponse<T> {
  status: number;
  data: T;
}
// Create ApiResponse<User> — data must match User interface
const userResponse: ApiResponse<User> = {
  status: 200,
  data: { id: 3, name: "Bob" },
};

// ===============================
// 7. UTILITY TYPES
// ===============================

// Product interface
interface Product {
  id: number;
  name: string;
  price: number;
}
// Partial<Product> makes all fields optional
type PartialProduct = Partial<Product>;
// Readonly<Product> makes all fields read-only (cannot be changed)
type ReadonlyProduct = Readonly<Product>;
// Pick<Product, "name" | "price"> selects only name & price fields
type ProductNameAndPrice = Pick<Product, "name" | "price">;

// Create PartialProduct — only 'name' is provided
const draftProduct: PartialProduct = { name: "Laptop" };

// Create ReadonlyProduct — all fields required but immutable
const lockedProduct: ReadonlyProduct = { id: 1, name: "Phone", price: 999 };

// ===============================
// 8. TYPE ASSERTIONS & UNKNOWN
// ===============================

// 'unknown' type means we don't yet know what type it is
let unknownValue: unknown = "Hello TS";
// Type assertion: tell TS to treat unknownValue as a string
let stringLength: number = (unknownValue as string).length;
// Logs string length
console.log("String length:", stringLength);

// ===============================
// 9. ASYNC / AWAIT
// ===============================

// Async function returning a Promise<string>
async function fetchData(): Promise<string> {
  // Returns a new Promise that resolves with "Data fetched!" after 1 second
  return new Promise((resolve) => {
    setTimeout(() => resolve("Data fetched!"), 1000);
  });
}
// Call fetchData() and log result when resolved
fetchData().then(console.log);

// ===============================
// END OF FUNDAMENTALS
// ===============================
