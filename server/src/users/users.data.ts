export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }
  
  export let users: User[] = [];