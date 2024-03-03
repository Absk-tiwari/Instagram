import React, { useEffect }  from 'react';
import { Link } from "react-router-dom";
import pfp from '../../../../assets/icons/profile.png'
import Button from "../../../StateComponents/Button";
import {howLong} from  '../../../../helpers'
const PostHead = (props) => { 
  let post = props.post
  const refer = e => {
    let elem = e.target;
    elem.closest('.head').querySelector('.linkToProfile').click();
  }
  useEffect(()=>{},[])

  return (
    <div className='row d-flex'>
      <div className="d-flex head">
      <div className="col-2" onClick={refer}>
        <img className="pfpicture" src={post.profile??pfp} alt="?"/>
      </div>
      <div className="col-4 pt-2" >
        <Link className="text-decoration-none text-dark fw-bold linkToProfile" id="link" to={`/profile/${post.username}`}>
           {post.username}
        </Link>
        <small className="text-secondary mx-2">{howLong(new Date(post.created_at))}</small> <br/>
        <small className="mb-2">{post.location}</small>
      </div>
      <div className="col-5">
        <Button text={'Follow'} alt={'Following'} />
      </div>
      <i className="fa fa-ellipsis-h mx-4 dropup" data-bs-toggle="dropdown"/>
        <ul className="dropdown-menu" style={{position:'fixed'}}>
          <li>
            <Link className="dropdown-item px-4" to="#"> Report </Link>
          </li>
          <li>
            <Link className="dropdown-item px-4" to="#"> Block </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PostHead