import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAutocompleteResults = (query, features, category, subcategories) =>
  client.get('/search/autocomplete', {
    params: {
      q: query,
      features,
      category,
      subcategories
    }
  });

export const getProductResults = (query, features, category, subcategories) =>
  client.get('/search', {
    params: {
      q: query,
      features,
      category,
      subcategories
    }
  });
