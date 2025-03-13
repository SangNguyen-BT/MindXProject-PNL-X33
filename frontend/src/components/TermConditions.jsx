import React from 'react'
import ProfileNav from './ProfileNav';
import {Responsive} from "./Responsive"
const TermConditions = () => {
  
  return (
    <>
    <ProfileNav/>
    <div className=' text-white text-2xl p-10   pl-[450px]' responsive={Responsive}>
      <div className='text-2xl' >
        <p>Please read these term of service, 
            carefully before using our app operated by us .
        </p>
      </div>
      <div className='text-4xl font-bold mb-6 text-red-500'> Conditions of Uses</div>
      <div className='text-2xl'>
        It is a long established fact that a reader will be distracted by the readable content 
        of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
        packages and web page editors now use Lorem Ipsum as their default model text,
        and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
        Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
      </div>
    </div>
    </>
  )
}

export default TermConditions
