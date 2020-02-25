import React from 'react';
import styled from 'styled-components';
import CategorySelect from './selects/CategorySelect';
import CategoryContainer from '../containers/categoryContainer';
import SubcategorySelect from './selects/SubcategorySelect';
import FeatureSelect from './selects/FeatureSelect';
import FeaturesContainer from '../containers/featuresContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;
const CategoryWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const QueryComponents = () => {
  const { category, setCategory } = CategoryContainer.useContainer();
  const { selectedFeatures, featureResults } = FeaturesContainer.useContainer();
  const {
    selectedSubcats,
    isSubcatSelected,
    clearSubcats,
    handleSubcatSelect,
    removeSubcatByIdx
  } = SubcategoriesContainer.useContainer();

  return (
    <Wrapper>
      <FeatureSelect selectedFeatures={selectedFeatures} featureResults={featureResults} />
      <CategoryWrapper>
        <CategorySelect category={category} onSelect={setCategory} />
        <SubcategorySelect
          selectedItems={selectedSubcats}
          checkIsSelected={isSubcatSelected}
          onClear={clearSubcats}
          onSelect={handleSubcatSelect}
          onRemoveByIdx={removeSubcatByIdx}
        />
      </CategoryWrapper>
    </Wrapper>
  );
};

export default QueryComponents;
