/**
 * Frappe CRM Simulation Service
 * 
 * This service provides simulated data for testing the voice assistant
 * without requiring a real Frappe CRM connection.
 */

// Simulated CRM entities
const mockLeads = [
  {
    name: "LEAD-00001",
    lead_name: "John Smith",
    company_name: "Acme Corporation",
    status: "Open",
    email: "john.smith@acme.com",
    phone: "+1-555-123-4567",
    creation: "2023-10-15T14:30:00",
    source: "Website",
    notes: "Interested in our premium plan",
  },
  {
    name: "LEAD-00002",
    lead_name: "Sarah Johnson",
    company_name: "TechCorp Inc.",
    status: "Qualified",
    email: "sarah.j@techcorp.com",
    phone: "+1-555-987-6543",
    creation: "2023-11-02T10:15:00",
    source: "Referral",
    notes: "CFO looking for enterprise solution",
  },
  {
    name: "LEAD-00003",
    lead_name: "Michael Brown",
    company_name: "Global Logistics",
    status: "Open",
    email: "m.brown@globallogistics.com",
    phone: "+1-555-456-7890",
    creation: "2023-11-10T09:45:00",
    source: "Trade Show",
    notes: "Needs a solution by Q1 2024",
  },
  {
    name: "LEAD-00004",
    lead_name: "Emma Wilson",
    company_name: "Retail Masters",
    status: "Open",
    email: "emma@retailmasters.com",
    phone: "+1-555-234-5678",
    creation: "2023-12-05T16:20:00",
    source: "Website",
    notes: "Requested product demo",
  },
  {
    name: "LEAD-00005",
    lead_name: "David Lee",
    company_name: "Innovate Solutions",
    status: "Qualified",
    email: "david.lee@innovate.io",
    phone: "+1-555-876-5432",
    creation: "2023-12-15T13:10:00",
    source: "LinkedIn",
    notes: "Technical director seeking automation tools",
  }
];

const mockTasks = [
  {
    name: "TASK-00001",
    subject: "Follow up with John Smith",
    status: "Open",
    priority: "Medium",
    due_date: "2024-01-15",
    assigned_to: "sales@example.com",
    project: "Acme Corporation Deal",
    reference_type: "Lead",
    reference_name: "LEAD-00001"
  },
  {
    name: "TASK-00002",
    subject: "Send proposal to TechCorp",
    status: "Open",
    priority: "High",
    due_date: "2024-01-10",
    assigned_to: "sales@example.com",
    project: "TechCorp Expansion",
    reference_type: "Opportunity",
    reference_name: "OPTY-00002"
  },
  {
    name: "TASK-00003",
    subject: "Schedule demo with Global Logistics",
    status: "Completed",
    priority: "Medium",
    due_date: "2023-12-20",
    assigned_to: "support@example.com",
    project: "Global Logistics Implementation",
    reference_type: "Lead",
    reference_name: "LEAD-00003"
  },
  {
    name: "TASK-00004",
    subject: "Prepare contract for Retail Masters",
    status: "Open",
    priority: "High",
    due_date: "2024-01-20",
    assigned_to: "legal@example.com",
    project: "Retail Masters Deal",
    reference_type: "Opportunity",
    reference_name: "OPTY-00004"
  },
  {
    name: "TASK-00005",
    subject: "Quarterly review with Innovate Solutions",
    status: "Open",
    priority: "Low",
    due_date: "2024-01-30",
    assigned_to: "account@example.com",
    project: "Innovate Solutions Maintenance",
    reference_type: "Customer",
    reference_name: "CUST-00005"
  }
];

const mockOpportunities = [
  {
    name: "OPTY-00001",
    opportunity_from: "Lead",
    party_name: "LEAD-00001",
    customer_name: "Acme Corporation",
    opportunity_amount: 25000,
    status: "Open",
    expected_closing: "2024-02-15",
    probability: 70,
    currency: "USD",
    sales_stage: "Negotiation"
  },
  {
    name: "OPTY-00002",
    opportunity_from: "Lead",
    party_name: "LEAD-00002",
    customer_name: "TechCorp Inc.",
    opportunity_amount: 75000,
    status: "Open",
    expected_closing: "2024-03-10",
    probability: 60,
    currency: "USD",
    sales_stage: "Needs Analysis"
  },
  {
    name: "OPTY-00003",
    opportunity_from: "Lead",
    party_name: "LEAD-00003",
    customer_name: "Global Logistics",
    opportunity_amount: 42000,
    status: "Open",
    expected_closing: "2024-02-28",
    probability: 50,
    currency: "USD",
    sales_stage: "Qualification"
  },
  {
    name: "OPTY-00004",
    opportunity_from: "Lead",
    party_name: "LEAD-00004",
    customer_name: "Retail Masters",
    opportunity_amount: 30000,
    status: "Closed",
    expected_closing: "2023-12-30",
    probability: 100,
    currency: "USD",
    sales_stage: "Closed Won"
  },
  {
    name: "OPTY-00005",
    opportunity_from: "Lead",
    party_name: "LEAD-00005",
    customer_name: "Innovate Solutions",
    opportunity_amount: 18000,
    status: "Open",
    expected_closing: "2024-04-15",
    probability: 40,
    currency: "USD",
    sales_stage: "Proposition"
  }
];

/**
 * Simulation Service Class
 */
export class SimulationService {
  
  /**
   * Get simulated leads with optional filtering
   */
  getLeads(filters: any[] = []) {
    // Simple filtering simulation
    let results = [...mockLeads];
    
    if (filters && filters.length > 0) {
      // Handle filter conditions (simplified)
      filters.forEach(filter => {
        if (Array.isArray(filter) && filter.length === 3) {
          const [field, operator, value] = filter;
          
          if (operator === '=') {
            results = results.filter(lead => lead[field] === value);
          } else if (operator === 'like') {
            results = results.filter(lead => String(lead[field]).toLowerCase().includes(String(value).toLowerCase()));
          } else if (operator === '>') {
            // Date comparison is simplified
            if (field === 'creation') {
              results = results.filter(lead => new Date(lead.creation) > new Date(value));
            }
          }
        }
      });
    }
    
    return {
      data: {
        results
      }
    };
  }
  
  /**
   * Get simulated tasks with optional filtering
   */
  getTasks(filters: any[] = []) {
    // Simple filtering simulation
    let results = [...mockTasks];
    
    if (filters && filters.length > 0) {
      // Handle filter conditions (simplified)
      filters.forEach(filter => {
        if (Array.isArray(filter) && filter.length === 3) {
          const [field, operator, value] = filter;
          
          if (operator === '=') {
            results = results.filter(task => task[field] === value);
          } else if (operator === 'like') {
            results = results.filter(task => String(task[field]).toLowerCase().includes(String(value).toLowerCase()));
          }
        }
      });
    }
    
    return {
      data: {
        results
      }
    };
  }
  
  /**
   * Get simulated opportunities with optional filtering
   */
  getOpportunities(filters: any[] = []) {
    // Simple filtering simulation
    let results = [...mockOpportunities];
    
    if (filters && filters.length > 0) {
      // Handle filter conditions (simplified)
      filters.forEach(filter => {
        if (Array.isArray(filter) && filter.length === 3) {
          const [field, operator, value] = filter;
          
          if (operator === '=') {
            results = results.filter(opp => opp[field] === value);
          } else if (operator === 'like') {
            results = results.filter(opp => String(opp[field]).toLowerCase().includes(String(value).toLowerCase()));
          }
        }
      });
    }
    
    return {
      data: {
        results
      }
    };
  }
  
  /**
   * Create a simulated entity
   */
  createEntity(doctype: string, data: any) {
    // Simulate creating an entity
    const timestamp = new Date().toISOString();
    
    if (doctype === 'Lead') {
      const newLead = {
        name: `LEAD-${String(mockLeads.length + 1).padStart(5, '0')}`,
        creation: timestamp,
        ...data
      };
      
      // Add to mock storage
      mockLeads.push(newLead);
      
      return {
        data: newLead
      };
    } else if (doctype === 'Task') {
      const newTask = {
        name: `TASK-${String(mockTasks.length + 1).padStart(5, '0')}`,
        creation: timestamp,
        ...data
      };
      
      // Add to mock storage
      mockTasks.push(newTask);
      
      return {
        data: newTask
      };
    } else if (doctype === 'Opportunity') {
      const newOpportunity = {
        name: `OPTY-${String(mockOpportunities.length + 1).padStart(5, '0')}`,
        creation: timestamp,
        ...data
      };
      
      // Add to mock storage
      mockOpportunities.push(newOpportunity);
      
      return {
        data: newOpportunity
      };
    }
    
    throw new Error(`Unsupported doctype: ${doctype}`);
  }
  
  /**
   * Validate connection credentials (always returns true for simulation)
   */
  validateCredentials() {
    return true;
  }
}

// Create and export singleton instance
export const simulationService = new SimulationService();