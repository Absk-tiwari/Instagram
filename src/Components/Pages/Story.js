import React, { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import StoryContext from '../../Contexts/Stories/StoryContext';

const Story = () => {
    const all = useContext(StoryContext)
    let nextRef = useRef(null)
    let list = [];
    all.forEach(element => {
        let totalImages = all.length
        let width = 1155 / totalImages - 5; 
        list.push(<div className='progress-item' key={element.sno} style={{width: width+'px'}}></div>)
    });
    useEffect(()=>{
        document.getElementById('progres-bar').children[0].classList.add('seen');
        document.getElementById('contents').childNodes[0].setAttribute('id','list-active')
    })
 
    const change = e => {

        let ele = e.target 
        let list = document.getElementById('contents').children
        let progressList = document.getElementById('progres-bar').children
        let activeImg = document.getElementById('list-active');
        let activeImgIndex = Array.from(list).indexOf(activeImg);

        if(ele.getAttribute('data-type') === 'right' && activeImgIndex < list.length){
            if(list[activeImgIndex+1]!==undefined){
                // progressList[activeImgIndex].classList.remove('active')
                progressList[activeImgIndex+1].classList.add('seen')
                activeImg.removeAttribute('id');
                list[activeImgIndex+1].setAttribute('id','list-active')
            }
        } 
        if(activeImgIndex+1 >= list.length){
            document.querySelector('.exit').click()
        }
        
        if(ele.getAttribute('data-type') === 'left' && activeImgIndex !==0 ){
            if(list[activeImgIndex-1]!==undefined){
                progressList[activeImgIndex].classList.remove('seen')
                progressList[activeImgIndex-1].classList.add('active')
                activeImg.removeAttribute('id');
                list[activeImgIndex-1].setAttribute('id','list-active')
            }
        }
 
    }
    return ( 
     <div id='storyviewer' >
        <section id='progres-bar' className='d-flex' style={{position:"absolute"}}>
            {list}
        </section>
        <section id='contents'  style={{height:'500px'}} >
        {all.map(img => {
            return <li key={img.sno} id={img.sno} style={{zIndex:img.sno, position:'absolute', left:'23%', }}><img src={img.cover} style={{height:'100vh',width:'35vw'}}   alt="not?"/></li>
        })}
        </section>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="text-white  bi bi-arrow-left-circle" style={{position:'absolute',left:'20%',top:'45%',zIndex:'9999999', cursor:'pointer'}} viewBox="0 0 16 16" data-type='left' onClick={change}>
        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>

       <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-arrow-right-circle text-white" style={{position:'absolute',left:'68%',top:'45%',zIndex:'9999999', cursor:'pointer'}} viewBox="0 0 16 16" data-type='right' id='right' ref={nextRef} onClick={change}>
        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
        </svg>  
         
        <Link className='fs-2 exit' style={{position:'absolute', top:'3%', left:'80%'}} to={'/home'}><i className='btn btn-close' style={{ color:'white'}}></i></Link>
    </div>
      );
    } 
     
export default Story