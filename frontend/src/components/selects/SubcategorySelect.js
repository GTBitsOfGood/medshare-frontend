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
  'Accessories',
  'Anesthesia',
  'Aspiration Containers',
  'Astomy',
  'Bio-Medical Equipment',
  'BioHazard/Sharps',
  'Biomedical Accessories',
  'Biopsy',
  'Cardiovascular',
  'Cleaning Supplies',
  'Dental',
  'Diabetic',
  'Dialysis',
  'Drainage/Irrigation',
  'Drapes/Linens',
  'Dressings',
  'Ear, Nose &Throat',
  'Electrodes',
  'Endoscopic/Laparoscopic',
  'Examination',
  'Feeding',
  'Furnishings Hospital/Clinic',
  'Gastrointestinal',
  'General Medical',
  'General Supplies',
  'Gloves',
  'IV/Irrigation Fluids',
  'Incontinence (Disposable)',
  'Incontinence (Reusable)',
  'Intravenous',
  'Laboratory',
  'Masks',
  'Medical Apparel (Disposable)',
  'Medical Apparel (Reusable)',
  'Medical Books & Journals',
  'Medications',
  'Monitoring',
  'Needles',
  'Neuro',
  'Nursing Aids',
  'Obstetric/Gynecology(OB/GYN)',
  'Office',
  'Ophthalmology',
  'Orthopedic',
  'Patient Transport',
  'Pediatric/Infant',
  'Personal Hygiene',
  'Physical Therapy/Rehabilitation',
  'Plastics',
  'Positioners',
  'Respiratory',
  'Skin Prep',
  'Staplers',
  'Sterilization Supplies',
  'Suction',
  'Surgical',
  'Surgical Instruments',
  'Surgical Packs & Trays',
  'Sutures',
  'Syringes',
  'Thoracic',
  'Unsorted',
  'Urinary',
  'Wound Care',
  'X-Ray'
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
