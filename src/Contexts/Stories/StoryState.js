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
            content : '',
            username:'itachi'
        },
        {
            sno:2,
            cover:profile,
            content : '',
            username:'kiba'
        },
        {
            sno:3977,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:3432,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:3454,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:333,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:4,
            cover:obito,
            content : '',
            username:'obio'
        },
        {
            sno:5,
            cover:profile,
            content : '',
            username:'obio'
        },
        {
            sno:6,
            cover:obito,
            content : '',
            username:'obio'
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