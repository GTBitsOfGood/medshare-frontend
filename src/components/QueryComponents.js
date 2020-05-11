import React, { useEffect } from 'react';
import styled from 'styled-components';
import CategorySelect from './selects/CategorySelect';
import CategoryContainer from '../containers/categoryContainer';
import SubcategorySelect from './selects/SubcategorySelect';
import FeatureSelect from './selects/FeatureSelect';
import FeaturesContainer from '../containers/featuresContainer';
import SubcategoriesContainer from '../containers/subcategoriesContainer';
import { getAutocompleteResults } from '../httpApi';
import { useDebounce } from '../utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;
const CategoryWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
  margin-bottom: 0.7rem;
`;

const useAutocomplete = () => {
  const { category } = CategoryContainer.useContainer();
  const { query, selectedFeatures, setFeatureResults } = FeaturesContainer.useContainer();
  const { selectedSubcats } = SubcategoriesContainer.useContainer();

  const debouncedQuery = useDebounce(query, 200); // debounce 200ms

  useEffect(() => {
    const filterFeatureIds = selectedFeatures.map(feature => feature._id);
    getAutocompleteResults(query, filterFeatureIds, category, selectedSubcats)
      .then(results => {
        const filteredFeatures = results.data;
        console.log(filteredFeatures);
        setFeatureResults(filteredFeatures);
      })
      .catch(err => {
        console.log(err);
      });
  }, [debouncedQuery, selectedFeatures]); // eslint-disable-line
};

const QueryComponents = () => {
  const { category, setCategory } = CategoryContainer.useContainer();
  const {
    query,
    setQuery,
    selectedFeatures,
    featureResults,
    isFeatureSelected,
    removeFeature,
    clearFeatures,
    handleFeatureSelect
  } = FeaturesContainer.useContainer();
  const {
    selectedSubcats,
    isSubcatSelected,
    clearSubcats,
    handleSubcatSelect,
    removeSubcatByIdx
  } = SubcategoriesContainer.useContainer();

  useAutocomplete();

  return (
    <Wrapper>
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
      <FeatureSelect
        query={query}
        onQueryChange={setQuery}
        selectedFeatures={selectedFeatures}
        featureResults={featureResults}
        onRemove={removeFeature}
        onClear={clearFeatures}
        onSelect={handleFeatureSelect}
        checkIsFeatureSelected={isFeatureSelected}
      />
    </Wrapper>
  );
};

export default QueryComponents;
