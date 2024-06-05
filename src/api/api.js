import axios from "axios";


const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";
export const TOKEN_STORAGE_ID = "modernmaestro-token";

class ModernMaestroApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
  
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_ID)}`, // Get the token from localStorage
    };
    const params = method === "get" ? data : {};
  
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }


//********************AUTH******************************* 

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

  // ***************COMPOSERS******************
  static async getComposers() {
    let res = await this.request("composers");
    return res.composers;
  }

  static async getComposerById(id) {
    try {
      let res = await this.request(`composers/${id}`);
      if (!res.composer) {
        console.error('Composer not found');
        return null; // Or however you wish to handle this case
      }
      return res.composer;
    } catch (error) {
      console.error('Error fetching composer by ID:', error);
      throw error; // Or return a default value/error message
    }
  }

  // Method to create a new composer
static async createComposer(data) {
  let res = await this.request("composers", data, "post");
  return res.composer; // Assuming your API returns the created composer object
}

// // Method to update an existing composer
// static async updateComposer (url, data) {
//     try {
//       const response = await axios.patch(url, data);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

// Assuming baseURL is provided as a parameter to the function
static async updateComposer (composerId, data) {
  try {
    const res = await this.request(`composers/${composerId}`, data, "patch");
    return res.composer;
  } catch (error) {
    throw error;
  }
};


static async fetchTracksByComposerName(composerName) {
  try {
    let res = await this.request(`composers/tracks/byComposer/${composerName}`);
    // Ensure res.tracks is always an array
    return Array.isArray(res.tracks) ? res.tracks : [];
  } catch (error) {
    console.error("Error fetching tracks by composer name:", error);
    return []; // Return an empty array on error
  }
}

  /**
   * Adds a single track for a specific composer to the database.
   * 
   * @param {Object} trackData - The data for the track to add.
   * @returns {Promise<Object>} The added track object from the response.
   */
  static async addTrackToComposer(trackData) {
    try {
      const url = `${this.baseUrl}/compositions`; // Assuming the endpoint for adding a track is '/compositions'
      const headers = {
        'Authorization': `Bearer ${this.token}`, // If authentication is required
        'Content-Type': 'application/json',
      };

      const response = await axios.post(url, JSON.stringify(trackData), { headers });
      return response.data;
    } catch (error) {
      console.error("Error in addTrackToComposer:", error.response || error);
      throw error; // Rethrow so it can be caught and handled by the calling function
    }
  }


  //************Compositions & Instruments******************************

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
  
  /**
     * Creates a new composition, including uploading an audio file.
     * @param {FormData} formData The composition data and the file to be uploaded.
     */
  static async createCompositionWithFile(formData) {
    const url = `${BASE_URL}/compositions`; // Adjust if your endpoint is different
    const headers = {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_ID)}`,
      // Don't set Content-Type for FormData; Axios will set it correctly for multipart/form-data.
    };

    try {
      // Note: Axios will automatically detect FormData and set the appropriate headers.
      const response = await axios.post(url, formData, { headers });
      return response.data;
    } catch (err) {
      console.error("API Error (createCompositionWithFile):", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async updateCompositionWithFile(compositionId, formData) {
    const url = `${BASE_URL}/compositions/${compositionId}`; // URL to target a specific composition
    const headers = {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_ID)}`,
      // Note: Don't set Content-Type for FormData; Axios will set it for multipart/form-data.
    };
  
    try {
      // Axios will automatically detect FormData and set the appropriate headers for multipart/form-data.
      const response = await axios.patch(url, formData, { headers });
      return response.data;
    } catch (err) {
      console.error("API Error (updateCompositionWithFile):", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // // ***************Performances************************
  // static async getPerformances(filters = {}) {
  //   let res = await this.request("performances", filters);
  //   return res.performances;
  // }

  // static async getPerformanceById(id) {
  //   let res = await this.request(`performances/${id}`);
  //   return res.performance;
  // }




 //************User Interactions methods*****************
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



  //*********************USERS***********************************
  static async getUsers(filters = {}) {
    let res = await this.request("users", filters);
    return res.users;
  }

  static async getCurrentUser() {
    let res = await this.request(`users/me`); // Assumes your API has a route returning current user info based on token
    return res.user;
  }

  static async getUserByUsername(username) {
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
  // Method to retrieve composer by user ID
  static async getComposerByUserId(userId) {
    try {
      let res = await this.request(`users/${userId}/composer`);
      return res.composer;
    } catch (error) {
      console.error("Error fetching composer by user ID:", error);
      throw error;
    }
  }

  static async updateUserType(userId, isComposer) {
    try {
      // Adjusting to send the required structure
      const res = await this.request(`users/${userId}/composer`, {
        isComposer,
        composerDetails: isComposer ? {} : null, // Sending empty details if composer, null if reverting to normal
      });
      return res.data;
    } catch (error) {
      console.error(`Failed to update user type: ${error.response ? error.response.data.error : error.message}`);
      throw error;
    }
  }

  // Method to create a composer for a user
  static async createComposerForUser(userId, data) {
    try {
      let res = await this.request(`users/${userId}/composer`, data, "post");
      return res.composer;
    } catch (error) {
      console.error("Error creating composer for user:", error);
      throw error;
    }
  }
  
  static async updateComposerForUser(userId, data) {
    console.log("updateComposerForUser received data:", data);
    // Prepare the data to be sent
    const payload = {
      isComposer: data.isComposer,
      composerDetails: data.isComposer ? data.composerDetails : {}, // Send composerDetails or an empty object if not a composer
    };
    
    try {
      // Note: Ensure BASE_URL is correct and points to your back-end server
      let res = await this.request(`users/${userId}/composer`, payload, "patch");
      return res.data; // Assuming the back end responds with the updated user data
    } catch (error) {
      console.error("Error updating composer for user:", error);
      throw error;
    }
}
}



export default ModernMaestroApi;
