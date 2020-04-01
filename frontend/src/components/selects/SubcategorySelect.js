import React from 'react';
import { Button, MenuItem, Menu } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const MultiSelectWrapper = styled.div`
  flex-basis: 100px;
  flex-grow: 1;
`;

const subcategories = [
  'BioHazard/Sharps',
  'Bio-Medical Equipment',
  'Needles',
  'Medical Apparel (Disposable)',
  'Personal Hygiene',
  'X-Ray',
  'Surgical',
  'General Supplies',
  'Wound Care',
  'Surgical Instruments',
  'Neuro',
  'Plastics',
  'Dressings',
  'Laboratory',
  'Respiratory',
  'Anesthesia',
  'Astomy',
  'Office',
  'Gastrointestinal',
  'Incontinence (Disposable)',
  'Positioners',
  'Urinary',
  'General Medical',
  'Biopsy',
  'Biomedical Accessories',
  'Unsorted',
  'Drainage/Irrigation',
  'IV/Irrigation Fluids',
  'Orthopedic',
  'Monitoring',
  'Medical Apparel (Reusable)',
  'Feeding',
  'Staplers',
  'Pediatric/Infant',
  'Sutures',
  'Masks',
  'Ophthalmology',
  'Electrodes',
  'Dialysis',
  'Cardiovascular',
  'Nursing Aids',
  'Medical Books & Journals',
  'Incontinence (Reusable)',
  'Medications',
  'Dental',
  'Ear, Nose &Throat',
  'Physical Therapy/Rehabilitation',
  'Drapes/Linens',
  'Intravenous',
  'Cleaning Supplies',
  'Surgical Packs & Trays',
  'Skin Prep',
  'Obstetric/Gynecology(OB/GYN)',
  'Gloves',
  'Accessories',
  'Furnishings Hospital/Clinic',
  'Sterilization Supplies',
  'Diabetic',
  'Aspiration Containers',
  'Examination',
  'Thoracic',
  'Suction',
  'Patient Transport',
  'Endoscopic/Laparoscopic',
  'Syringes'
];
const renderTag = subcategory => subcategory;

const itemPredicate = (query, name) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = name.toLowerCase();
  return normalizedName.indexOf(normalizedQuery) >= 0;
};

const itemListRenderer = ({ renderItem, items, itemsParentRef }) => {
  return (
    <Menu large ulRef={itemsParentRef}>
      {items.map(renderItem)}
    </Menu>
  );
};
itemListRenderer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemsParentRef: PropTypes.element.isRequired,
  renderItem: PropTypes.func.isRequired
};

const SubcategorySelect = ({ selectedItems, onRemoveByIdx, onSelect, onClear, checkIsSelected }) => {
  const renderItems = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        key={item}
        icon={checkIsSelected(item) ? 'tick' : 'blank'}
        onClick={handleClick}
        text={item}
        active={modifiers.active}
      />
    );
  };

  const clearButton = selectedItems.length > 0 ? <Button minimal icon="cross" onClick={onClear} /> : undefined;
  const handleRemove = (_, idx) => {
    onRemoveByIdx(idx);
  };

  return (
    <MultiSelectWrapper>
      <MultiSelect
        fill
        resetOnSelect
        popoverProps={{ minimal: true }}
        items={subcategories}
        itemListRenderer={itemListRenderer}
        itemRenderer={renderItems}
        itemPredicate={itemPredicate}
        onItemSelect={onSelect}
        noResults={<MenuItem disabled text="No results." />}
        tagRenderer={renderTag}
        tagInputProps={{
          rightElement: clearButton,
          onRemove: handleRemove,
          large: true,
          tagProps: { style: { backgroundColor: '#D6A636' } }
        }}
        selectedItems={selectedItems}
        placeholder="Subcategories.."
      />
    </MultiSelectWrapper>
  );
};
SubcategorySelect.propTypes = {
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClear: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemoveByIdx: PropTypes.func.isRequired,
  checkIsSelected: PropTypes.func.isRequired
};

export default SubcategorySelect;
