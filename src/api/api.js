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
    // Store just the token string
    localStorage.setItem(TOKEN_STORAGE_ID, res.token);
    // console.log(res); // To check the entire response structure
 
     console.log("res.token from api.js:", res.token); // To specifically check the token
    // console.log(localStorage.getItem(TOKEN_STORAGE_ID));

    ModernMaestroApi.token = res.token; // Also set the token for immediate API use
    // console.log(res.token);//THIS IS WORKING
    return res.token;
  } catch (error) {
    console.error("login failed", error);
    throw error;
  }
}

// In ModernMaestroApi.register
static async signup(data) {
  try {
    let res = await this.request("auth/register", data, "post");
    // Store just the token string
    localStorage.setItem(TOKEN_STORAGE_ID, res.token);
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

  // Compositions
  static async getCompositions(filters = {}) {
    let res = await this.request("compositions", filters);
    return res.compositions;
  }

  static async getCompositionById(id) {
    let res = await this.request(`compositions/${id}`);
    return res.composition;
  }

  static async createComposition(data) {
    let res = await this.request("compositions", data, "post");
    return res.composition;
  }

  static async updateComposition(id, data) {
    let res = await this.request(`compositions/${id}`, data, "patch");
    return res.composition;
  }

  static async deleteComposition(id) {
    let res = await this.request(`compositions/${id}`, {}, "delete");
    return res.deleted;
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
