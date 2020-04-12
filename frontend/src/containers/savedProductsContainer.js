import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSavedProductsContainer = () => {
  const [savedProducts, setSavedProducts] = useState({});

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
    setSavedProducts({
      ...savedProducts,
      [documentId]: undefined
    });
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
