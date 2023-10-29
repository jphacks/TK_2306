import React from 'react';
import banner_styles from './Banner.module.css';

function Banner() {
  return (
    <div className={banner_styles.banner}>
      <img src="banner_calender.svg" alt="Banner Image" />
      <h1>Junan Shift</h1>
      <img src="banner_calender.svg" alt="Banner Image" />
    </div>
  );
}

export default Banner;