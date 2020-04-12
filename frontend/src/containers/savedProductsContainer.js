import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

const LOCALSTORAGE_KEY = 'SAVED_PRODUCTS';

const useSavedProductsContainer = () => {
  const [savedProducts, setSavedProducts] = useState({});

  useEffect(() => {
    setSavedProducts(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {});
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(savedProducts));
  }, [savedProducts]);

  const isSaved = documentId => {
    return !!savedProducts[documentId];
  };

  const saveProduct = product => {
    setSavedProducts({
      ...savedProducts,
      [product._id]: product
    });
  };

  const removeSavedProduct = documentId => {
    const { [documentId]: omit, ...products } = savedProducts;
    setSavedProducts(products);
  };

  const toggleProductSave = product => {
    if (isSaved(product._id)) {
      removeSavedProduct(product._id);
    } else {
      saveProduct(product);
    }
  };

  return {
    savedProducts,
    isSaved,
    saveProduct,
    removeSavedProduct,
    toggleProductSave
  };
};

const SavedProductsContainer = createContainer(useSavedProductsContainer);

export default SavedProductsContainer;
