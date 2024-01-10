import React from 'react';
import StoryContext from './StoryContext';
import itachi from '../../assets/icons/itachi.jpg';
import obito from '../../assets/icons/obito.jpg';
import profile from '../../assets/icons/profile.png';
import obio from '../../assets/icons/pfp.png';
//eslint-disable-next-line
import headers from '../../APIs/Headers';

const StoryState = (props) => {
    // eslint-disable-next-line
    const host = 'http://127.0.0.1:1901';
    const stories = [
        {
            sno:12,
            cover:itachi,
            content : '',
            username:'itachi'
        },
        {
            sno:11,
            cover:profile,
            content : '',
            username:'kiba'
        },
        {
            sno:10,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:9,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:8,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:7,
            cover:obio,
            content : '',
            username:'obio'
        },
        {
            sno:6,
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
            sno:4,
            cover:obito,
            content : '',
            username:'obio'
        },
       
    ]

    const getStories = async() => {
      try{
        // const res = await fetch(`${host}/api/stories`, {
        //     method:'GET',
        //     headers : headers()
        // });
        // const stories = await res.json();
        //return stories??[];
      }catch (er){
        console.log(er)
      }
    }
  return (
     <>
        <StoryContext.Provider value={{ stories, getStories }}>
            {props.children}
        </StoryContext.Provider>
     </>
  )
}

export default StoryState