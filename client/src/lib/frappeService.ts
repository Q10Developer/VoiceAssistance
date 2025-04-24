import axios from 'axios';
import { FrappeCredentials } from '@/types';
import { apiRequest } from './queryClient';

export class FrappeService {
  private credentials: FrappeCredentials;

  constructor(credentials: FrappeCredentials) {
    this.credentials = credentials;
  }

  // Update credentials
  updateCredentials(credentials: FrappeCredentials) {
    this.credentials = credentials;
  }

  // Validate Frappe CRM credentials
  async validateCredentials(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.credentials.apiUrl}/method/frappe.auth.get_logged_user`, {
        headers: {
          'Authorization': `token ${this.credentials.apiKey}:${this.credentials.apiSecret}`
        }
      });
      
      return response.status === 200 && !!response.data;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }

  // Get data from Frappe CRM
  async fetchData(doctype: string, filters: any[] = [], fields: string[] = ["*"], limit: number = 20): Promise<any> {
    try {
      const response = await apiRequest("POST", "/api/frappe/query", {
        apiUrl: this.credentials.apiUrl,
        apiKey: this.credentials.apiKey,
        apiSecret: this.credentials.apiSecret,
        doctype,
        filters,
        fields,
        limit
      });
      
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  // Execute a method in Frappe CRM
  async executeMethod(method: string, args: any = {}): Promise<any> {
    try {
      const response = await apiRequest("POST", "/api/frappe/execute", {
        apiUrl: this.credentials.apiUrl,
        apiKey: this.credentials.apiKey,
        apiSecret: this.credentials.apiSecret,
        method,
        args
      });
      
      return response.json();
    } catch (error) {
      console.error('Execute error:', error);
      throw error;
    }
  }

  // Get leads
  async getLeads(filters: any[] = []): Promise<any> {
    return this.fetchData("Lead", filters);
  }

  // Get opportunities
  async getOpportunities(filters: any[] = []): Promise<any> {
    return this.fetchData("Opportunity", filters);
  }

  // Get tasks
  async getTasks(filters: any[] = []): Promise<any> {
    return this.fetchData("Task", filters);
  }

  // Create a new entity in Frappe CRM
  async createEntity(doctype: string, data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.credentials.apiUrl}/api/resource/${doctype}`,
        data,
        {
          headers: {
            'Authorization': `token ${this.credentials.apiKey}:${this.credentials.apiSecret}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Create entity error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const frappeService = new FrappeService({
  apiUrl: '',
  apiKey: '',
  apiSecret: ''
});
