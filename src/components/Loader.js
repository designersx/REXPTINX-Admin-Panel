import React from 'react'
import styles from '../css/Loader.module.css'

const Loader = ({ size = 60 }) => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.cardBody}>
        <svg
          className={styles.svg}
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="loader_215">
            <g className={styles.loaderCircle2}>
              <circle cx="30" cy="30" r="30" fill="white" />
              <circle cx="30" cy="30" r="29" fill="#002155" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60ZM35 6C35 8.76142 32.7614 11 30 11C27.2386 11 25 8.76142 25 6C25 3.23858 27.2386 1 30 1C32.7614 1 35 3.23858 35 6ZM35 54C35 56.7614 32.7614 59 30 59C27.2386 59 25 56.7614 25 54C25 51.2386 27.2386 49 30 49C32.7614 49 35 51.2386 35 54Z"
                fill="white"
              />
            </g>
            <g className={styles.loaderCircle1}>
              <circle cx="30" cy="30" r="30" fill="transparent" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 30C1 46.0163 13.9837 59 30 59C32.7614 59 35 56.7614 35 54C35 51.2386 32.7614 49 30 49C19.5066 49 11 40.4934 11 30C11 19.5066 19.5066 11 30 11C32.7614 11 35 8.76142 35 6C35 3.23858 32.7614 1 30 1C13.9837 1 1 13.9837 1 30Z"
                fill="#002155"
              />
            </g>
            <g className={styles.loaderCircle2}>
              <circle cx="30" cy="30" r="30" fill="transparent" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30 60V59C27.2386 59 25 56.7614 25 54C25 51.2386 27.2386 49 30 49V11C27.2386 11 25 8.76142 25 6C25 3.23858 27.2386 1 30 1V0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
                fill="white"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default Loader
