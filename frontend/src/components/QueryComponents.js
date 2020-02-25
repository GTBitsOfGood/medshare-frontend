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
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;
const CategoryWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const useAutocomplete = () => {
  const { category } = CategoryContainer.useContainer();
  const { query, selectedFeatures, setFeatureResults } = FeaturesContainer.useContainer();
  const { selectedSubcats } = SubcategoriesContainer.useContainer();

  const debouncedQuery = useDebounce(query, 200); // debounce 200ms

  useEffect(() => {
    const filterFeatureIds = selectedFeatures.map(feature => feature._id).join(',');
    getAutocompleteResults(query, filterFeatureIds, category, selectedSubcats.join(','))
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
