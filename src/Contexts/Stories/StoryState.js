import React from 'react';
import StoryContext from './StoryContext';
import itachi from '../../assets/icons/itachi.jpg';
import obito from '../../assets/icons/obito.jpg';
import profile from '../../assets/icons/profile.png';
import obio from '../../assets/icons/pfp.png';

const StoryState = (props) => {
    const stories = [
        {
            sno:1,
            cover:itachi,
            content : ''
        },
        {
            sno:2,
            cover:profile,
            content : ''
        },
        {
            sno:3977,
            cover:obio,
            content : ''
        },
        {
            sno:3432,
            cover:obio,
            content : ''
        },
        {
            sno:3454,
            cover:obio,
            content : ''
        },
        {
            sno:333,
            cover:obio,
            content : ''
        },
        {
            sno:4,
            cover:obito,
            content : ''
        },
        {
            sno:5,
            cover:profile,
            content : ''
        },
        {
            sno:6,
            cover:obito,
            content : ''
        },
       
    ]
  return (
     <>
        <StoryContext.Provider value={stories}>
            {props.children}
        </StoryContext.Provider>
     </>
  )
}

export default StoryState