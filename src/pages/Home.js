import React from 'react'
import Signup from './Signup'
import Menu from '../components/menu';
import Navbar from '../components/navBar';

const Home = () => {
  return (
    
    <>
    <Navbar />
        <Menu />
    <section id="section_1" className="offwhite">
        <div className="header_text_box">
          <p>When We Work<br></br>Together<br></br>We <span className="grow">Grow</span><br></br>Together</p>
          </div>
      </section>
      <section id="section_2" className="green">
      <div class="top_triangle_divider">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M1200 0L0 0 598.97 114.72 1200 0z" class="shape-fill"></path>
    </svg>
</div>
            <div className="left_text_box">
              <h1>Networking<br></br><span className="accounting">Accounting</span><br></br>Scouting<br></br>
              <span className="push_right">All In The</span><br></br>
              <span className="push_further_right">Same <span className="underline">Place!</span></span></h1>
              </div>
              <div class="bottom_triangle_divider">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M1200 0L0 0 598.97 114.72 1200 0z" class="shape-fill"></path>
    </svg>
</div>
          </section>
          <section id="section_3" className="offwhite">
            <div className="bottom_text_box">
              <h1>The Future of<br></br>Financial Collaboration<br></br>Starts Here</h1>
              </div>

              
          </section>
            <Signup />
          </>
  )
}

export default Home