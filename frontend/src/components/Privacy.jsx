import React from 'react'
import ProfileNav from './ProfileNav';

import {Responsive} from "./Responsive"
const Privacy = () => {
  
  return (
    <>
   <ProfileNav/>
    <div className=' text-white text-2xl p-10   pl-[450px]' responsive={Responsive}>

      <div className='text-2xl' >
        <p>Plese read these privacy policy, carefully before using our app operated by us.</p>
      </div>
      <div className='text-4xl font-bold mb-6 text-red-500'> Privacy Policy</div>
      <div className='text-2xl'>
        There are many variantions of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont't look even slightly believable.
        If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
        All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
        The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
      </div>
    </div>
    </>
  )
}

export default Privacy
