import axios from "axios";


const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";
export const TOKEN_STORAGE_ID = "modernmaestro-token";

class ModernMaestroApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ModernMaestroApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }


// In ModernMaestroApi.login
static async login(data) {
  try {
    let res = await this.request("auth/token", data, "post");
    localStorage.removeItem(TOKEN_STORAGE_ID); // Clear existing token
    localStorage.setItem(TOKEN_STORAGE_ID, res.token); // Store new token
    ModernMaestroApi.token = res.token; // Also set the token for immediate API use
    return res.token;
  } catch (error) {
    console.error("login failed", error);
    throw error;
  }
}

static async signup(data) {
  try {
    let res = await this.request("auth/register", data, "post");
    localStorage.removeItem(TOKEN_STORAGE_ID); // Clear existing token
    localStorage.setItem(TOKEN_STORAGE_ID, res.token); // Store new token
    ModernMaestroApi.token = res.token; // Also set the token for immediate API use
    return res.token;
  } catch (error) {
    console.error("signup failed", error);
    throw error;
  }
}


  // Composers
  static async getComposers() {
    let res = await this.request("composers");
    return res.composers;
  }

  static async getComposerById(id) {
    let res = await this.request(`composers/${id}`);
    return res.composer;
  }

  // Method to create a new composer
static async createComposer(data) {
  let res = await this.request("composers", data, "post");
  return res.composer; // Assuming your API returns the created composer object
}

// Method to update an existing composer
static async updateComposer(id, data) {
  let res = await this.request(`composers/${id}`, data, "patch");
  return res.composer; // Assuming your API returns the updated composer object
}




  // Compositions & Instruments

  static async getCompositions(filters = {}) {
    let res = await this.request("compositions", filters);
    return res.compositions;
  }

  static async getCompositionById(id) {
    let res = await this.request(`compositions/${id}`);
    return res.composition;
  }

  static async createComposition(compositionData) {
    try {
      let res = await this.request("compositions", compositionData, "post");
      return res;
    } catch (error) {
      console.error("Error creating composition:", error);
      throw error;
    }
  }

  static async updateComposition(id, data) {
    let res = await this.request(`compositions/${id}`, data, "patch");
    return res.composition;
  }

  static async deleteComposition(id) {
    let res = await this.request(`compositions/${id}`, {}, "delete");
    return res.deleted;
  }

  // Method to get compositions by composer ID
  static async getCompositionsByComposerId(composerId) {
    let res = await this.request(`composers/${composerId}/compositions`);
    return res.compositions;
  }

  static async getCompositionsWithComposers() {
    try {
      const res = await this.request("compositions/with-composers");
      return res.compositions; // Return compositions directly
    } catch (error) {
      console.error("Error fetching compositions with composers:", error);
      throw new Error("Failed to fetch compositions with composers");
    }
  }

  static async getInstruments() {
    try {
      let res = await this.request("compositions/instruments");
      // Check if res.instruments is an array, if not, handle the response accordingly
      if (!Array.isArray(res.instruments)) {
        throw new Error("Invalid response format: instruments is not an array");
      }
      return res.instruments;
    } catch (error) {
      console.error("Error fetching instruments from compositions:", error);
      throw new Error("Failed to fetch instruments");
    }
  }
  

  // Performances
  static async getPerformances(filters = {}) {
    let res = await this.request("performances", filters);
    return res.performances;
  }

  static async getPerformanceById(id) {
    let res = await this.request(`performances/${id}`);
    return res.performance;
  }

 // User Interactions methods

  /** Get all user interactions */
  static async getUserInteractions() {
    let res = await this.request("userInteractions");
    return res.userInteractions;
  }

  /** Get a single user interaction by ID */
  static async getUserInteraction(id) {
    let res = await this.request(`userInteractions/${id}`);
    return res.userInteraction;
  }

  /** Post a new user interaction */
  static async createUserInteraction(data) {
    let res = await this.request("userInteractions", data, "post");
    return res.newUserInteraction;
  }

  /** Update an existing user interaction */
  static async updateUserInteraction(id, data) {
    let res = await this.request(`userInteractions/${id}`, data, "patch");
    return res.userInteraction;
  }

  /** Delete a user interaction */
  static async deleteUserInteraction(id) {
    let res = await this.request(`userInteractions/${id}`, {}, "delete");
    return res.deleted;
  }

  // Users
  static async getUsers(filters = {}) {
    let res = await this.request("users", filters);
    return res.users;
  }

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async updateUser(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  static async deleteUser(username) {
    let res = await this.request(`users/${username}`, {}, "delete");
    return res.deleted;
  }


}

export default ModernMaestroApi;
