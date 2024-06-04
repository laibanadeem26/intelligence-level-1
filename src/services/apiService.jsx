import axios from 'axios';
import { baseURL } from '../shared/utils/constants';

const axiosInstance = axios.create({
  baseURL,
});

const APIService = {
  async get(resource) {
    try {
      const response = await axiosInstance.get(resource);
      return response.data;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async post(resource, payload) {
    try {
      const response = await axiosInstance.post(resource, payload);
      return response.data;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async put(resource, payload) {
    try {
      const response = await axiosInstance.put(resource, payload);
      return response.data;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async patch(resource, payload) {
    try {
      const response = await axiosInstance.patch(resource, payload);
      return response.data;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
  async delete(resource, payload) {
    try {
      const response = await axiosInstance.delete(resource, payload);
      return response.data;
    } catch (error) {
      throw new Error(`ApiService ${error}`);
    }
  },
};

export default APIService;
