// lib/auth.ts
import { HARDCODED_USERS } from './config';

export const authenticateUser = (email: string, password: string) => {
  if (email === HARDCODED_USERS.organization.email && 
      password === HARDCODED_USERS.organization.password) {
    return HARDCODED_USERS.organization;
  }
  
  if (email === HARDCODED_USERS.employee.email && 
      password === HARDCODED_USERS.employee.password) {
    return HARDCODED_USERS.employee;
  }
  
  return null;
};
