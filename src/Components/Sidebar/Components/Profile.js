import React from 'react';
import obito from '../../../assets/icons/pfp.png';
import {Link }from 'react-router-dom'

const Profile = () => {
  return (
    <div className='container Profile' style={{}}>
      <div className='col-md-12 info-container'>
        <div className='col-md-4'>
          <div className='container'>
            <img src={obito} alt='not yet?' />
          </div>
        </div>
        <div className='col-md-8'>
          <div className='row'>
            <div className='col-md-6'>
              <h4>te.sting8398</h4>
            </div>
            <div className='col-md-6'>
              <button className=' text-dark editprofile'><strong>Edit Profile</strong></button>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-3'><strong>2</strong> posts</div>
            <div className='col-sm-4'><strong>173</strong> followers</div>
            <div className='col-sm-4'><strong>99</strong> following</div>
          </div>
          <div className='row'>
            <div className='col-sm-12'><strong>Deployment</strong></div>
          </div>
          <div className='row'>
            <div className='col-sm-12'><small>The future belongs to those who believe in the beauty of their dreams</small></div>
          </div>
        </div>
      </div>
        <div className="container mt-3">
          <h2>Toggleable Tabs</h2>
          <br/> 
          <ul className="nav nav-tabs align-items-center justify-content-center text-center">
            <li className="nav-item">
              <Link className="nav-link active" data-toggle="tab" to="#home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" data-toggle="tab" to="#menu1">Menu 1</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" data-toggle="tab" to="#menu2">Menu 2</Link>
            </li>
          </ul> 
      
          <div className="tab-content">
            <div id="home" className="container tab-pane active"><br/>
              <h3>HOME</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magnLink aliqua.</p>
            </div>
            <div id="menu1" className="container tab-pane fade"><br/>
              <h3>Menu 1</h3>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div id="menu2" className="container tab-pane fade"><br/>
              <h3>Menu 2</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            </div>
          </div>
        </div> 
       </div> 
  )
}

export default Profile