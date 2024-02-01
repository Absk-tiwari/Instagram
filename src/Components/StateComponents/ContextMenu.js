import React from 'react';

const ContextMenu = ({ isVisible, x, y, items, c }) => {
  const height = items? (100/items.length).toFixed(0)+'%':0
  return isVisible ? (
    <div className={`${c??''}`}
      id='contextMenu' 
      style={{ 
        top: y,
        left: x,
        width:c??'200px'
      }}
    >
      {items.map((item, index) => (
        <div style={{height}} className={`cLI ${item.class??''}`} key={index} onClick={() => item.onClick()}>
          {item.label}
        </div>
      ))}
    </div>
  ) : null;
};

export default ContextMenu;
