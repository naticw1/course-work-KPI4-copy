import "./Dropdown.css";

import React, { useEffect, useState } from "react";
import onClickOutside from "react-onclickoutside";

function Dropdown({
  title,
  items,
  multiSelect = false,
  className,
  onGenreSelect,
}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  // Dropdown.handleClickOutside = () => setOpen(false);

  function handleOnClick(item) {
    console.log(`Item selected: ${item.value}`);
    if (!selection.some((current) => current.id === item.id)) {
      if (!multiSelect) {
        setSelection([item]);
        if (onGenreSelect) {
          onGenreSelect(item.value); // Call the onGenreSelect with the selected genre
        }
      } else if (multiSelect) {
        const newSelection = [...selection, item];
        setSelection(newSelection);
        // setSelection([...selection, item]);
        if (onGenreSelect) {
          onGenreSelect(newSelection.map((i) => i.value)); // Map the selection to an array of values
        }
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (current) => current.id !== item.id
      );
      setSelection([...selectionAfterRemoval]);

      if (onGenreSelect) {
        onGenreSelect([...selectionAfterRemoval].map((i) => i.value)); // Update the parent with the new selection
      }
    }
  }

  function isItemInSelection(item) {
    if (selection.some((current) => current.id === item.id)) {
      return true;
    }
    return false;
  }

  return (
    <div className="dd-wrapper">
      <div
        tabIndex={0}
        // className="dd-header"
        className={`dd-header ${className}`}
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div className="dd-header__title">
          <p className="dd-header__title--bold">{title}</p>
        </div>
        {/* <div className="dd-header__action">
          <p>{open ? "Close" : "Open"}</p>
        </div> */}
      </div>
      {open && (
        // <ul className="dd-list">
        //   {items.map((item) => (
        //     <li className="dd-list-item" key={item.id}>
        //       <button type="button" onClick={() => handleOnClick(item)}>
        //         {isItemInSelection(item) && (
        //           <span className="icon">
        //             <i className="fa-solid fa-check"></i>
        //           </span>
        //         )}
        //         <span>{item.value}</span>
        //       </button>
        //     </li>
        //   ))}
        // </ul>
        <ul className="dd-list">
          {items.map((item) => (
            <li className="dd-list-item" key={item.id}>
              <button type="button" onClick={() => handleOnClick(item)}>
                {isItemInSelection(item) && (
                  <span className="icon">
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
                <span>{item.value}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function isItemInSelection(item, selection) {
  return selection.some((current) => current.id === item.id);
}

export default Dropdown;
