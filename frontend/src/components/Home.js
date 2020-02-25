import React from 'react';

import { Button, MenuItem } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";

const subcategories = ['Gloves', 'Sterile', 'Isolation']; //inbetween <> there should be the type of the subcategories
const renderTag = (subcategory) => subcategory;

const ItemRenderer = (subcategory, {handleClick}) => {
  return <MenuItem key={subcategory} onClick ={handleClick} text={subcategory} />;
};



class Home extends React.Component {
  render() {
    return (
      <>
        <h1>Home</h1>
        <MultiSelect
          items = {subcategories}
          itemRenderer = {ItemRenderer}
          onItemSelect = {this.handleClick}
          tagRenderer = {renderTag}
        >
          <Button text={subcategories} rightIcon="double-caret-vertical" />
        </MultiSelect>
      </>
    );
  }
}

export default Home;

