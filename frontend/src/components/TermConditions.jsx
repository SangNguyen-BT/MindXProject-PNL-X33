import React from 'react'
import ProfileNav from './ProfileNav';

const TermConditions = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
};
  return (
    <>
    <ProfileNav/>
    <div className=' text-white text-2xl p-10   pl-[450px]' responsive={responsive}>
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
