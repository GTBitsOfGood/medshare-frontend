import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSubcategoriesContainer = () => {
  const [selectedSubcats, setSelectedSubcats] = useState([]);
  const clearSubcats = () => {
    setSelectedSubcats([]);
  };
  const isSubcatSelected = subcatName => {
    return selectedSubcats.indexOf(subcatName) >= 0;
  };
  const removeSubcatByIdx = idxToRemove => {
    setSelectedSubcats(selectedSubcats.filter((item, idx) => idx !== idxToRemove));
  };
  const handleSubcatSelect = subcatName => {
    if (!isSubcatSelected(subcatName)) {
      setSelectedSubcats(selectedSubcats.concat(subcatName));
    } else {
      removeSubcatByIdx(selectedSubcats.indexOf(subcatName));
    }
  };

  return {
    selectedSubcats,
    isSubcatSelected,
    clearSubcats,
    handleSubcatSelect,
    removeSubcatByIdx
  };
};

const SubcategoriesContainer = createContainer(useSubcategoriesContainer);
export default SubcategoriesContainer;
