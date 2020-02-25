import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useCategoryContainer = () => {
  const [category, setCategory] = useState(null);
  return {
    category,
    setCategory
  };
};

const CategoryContainer = createContainer(useCategoryContainer);
export default CategoryContainer;
