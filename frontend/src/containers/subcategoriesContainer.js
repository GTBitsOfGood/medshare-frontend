import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSubcategoriesContainer = () => {
  const [category, setCategory] = useState(null);
  return {
    category,
    setCategory
  };
};

const SubcategoriesContainer = createContainer(useSubcategoriesContainer);
export default SubcategoriesContainer;
