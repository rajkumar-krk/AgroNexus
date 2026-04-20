// Real backend batch service
import { api } from '../lib/api';

// Create a new request helper specifically for batches directly to avoid cyclic dependencies
// or we can just use fetch directly here using the API_BASE
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || 'API request failed');
  }
  return res.json();
}

export const batchService = {
  // Get all batches
  async getAllBatches() {
    try {
      const response = await request('/batches');
      // Backend returns { success: true, count: N, data: [...] }
      // The frontend BatchContext expects an array of objects mapping 
      // id to _id
      return response.data.map(b => ({ ...b, id: b._id }));
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  },

  // Get batch by ID
  async getBatchById(id) {
    try {
      const response = await request(`/batches/${id}`);
      return { ...response.data, id: response.data._id };
    } catch (error) {
      console.error('Error fetching batch:', error);
      throw error;
    }
  },

  // Add new batch
  async addBatch(batchData) {
    try {
      // Get the current user from localStorage to set the owner
      const stored = localStorage.getItem('agronexus_user');
      let ownerId = null;
      if (stored) {
        ownerId = JSON.parse(stored)._id;
      }
      
      const payload = {
        ...batchData,
        owner: ownerId,
        // Calculate a random batchId if not provided
        batchId: `${batchData.cropName?.substring(0, 3).toUpperCase() || 'NEW'}-2024-${Math.floor(Math.random() * 900) + 100}`,
        harvestDate: new Date().toISOString()
      };

      const response = await request('/batches', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
      });
      return { ...response.data, id: response.data._id };
    } catch (error) {
      console.error('Error adding batch:', error);
      throw error;
    }
  },

  // Update batch
  async updateBatch(id, updates) {
    try {
      const response = await request(`/batches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return { ...response.data, id: response.data._id };
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  },

  // Delete batch
  async deleteBatch(id) {
    try {
      await request(`/batches/${id}`, { method: 'DELETE' });
      return id;
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  },

  // Get batch statistics
  async getBatchStats() {
    try {
      const response = await request('/batches/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Simulate real-time updates using long polling or interval
  startRealTimeUpdates(callback) {
    try {
      const interval = setInterval(async () => {
        try {
          // Poll the latest data for all batches
          const response = await request('/batches');
          if (response.success && response.data.length > 0) {
            // Pick a random batch that might have 'changed'
            const randomBatchIndex = Math.floor(Math.random() * response.data.length);
            const batch = response.data[randomBatchIndex];
            
            // Just return the fetched batch, but maybe it was updated by someone else!
            callback({ ...batch, id: batch._id });
          }
        } catch (error) {
          console.error('Error in real-time update polling:', error);
        }
      }, 10000); // Poll every 10 seconds instead of 5 for DB load
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error starting real-time updates:', error);
      return () => {};
    }
  }
}
