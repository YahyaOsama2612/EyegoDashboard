

interface User {
    email: string;
    password: string;
  }
  
  const USERS_KEY = "users";
  
  export async function mockLogin(email: string, password: string) {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    return user ? { success: true } : { success: false };
  }
  
  export async function mockSignup(email: string, password: string) {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userExists = users.some((u) => u.email === email);
  
    if (userExists) return { success: false, message: "User already exists" };
  
    users.push({ email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  }
  