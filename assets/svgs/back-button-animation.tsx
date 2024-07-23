import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { IconProps } from ".";

export const BackButtonAnimated: React.FC<IconProps> = ({ className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.set(ref.current, {
      transformOrigin: "50% 50%",
      rotate: 0,
    }).to(ref.current, {
      rotation: "360",
      duration: 4,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <svg
      className={className}
      width="60"
      height="55"
      viewBox="0 0 60 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_18097_83545)">
        <g filter="url(#filter0_f_18097_83545)">
          <path
            d="M41.2898 36.4962C49.3017 27.7883 49.2053 25.4458 40.5051 17.4268C31.805 9.40781 23.6301 4.12662 15.6182 12.8345C7.60626 21.5424 8.16422 35.1023 16.8644 43.1213C25.5646 51.1403 33.2779 45.2041 41.2898 36.4962Z"
            fill="url(#paint0_linear_18097_83545)"
          />
        </g>
        <g filter="url(#filter1_f_18097_83545)">
          <path
            d="M10.2468 18.6725C2.2349 27.3804 2.3313 29.7229 11.0315 37.7419C19.7317 45.7609 27.9066 51.0421 35.9185 42.3342C43.9304 33.6263 43.3724 20.0664 34.6722 12.0474C25.972 4.02844 18.2587 9.96456 10.2468 18.6725Z"
            fill="url(#paint1_linear_18097_83545)"
          />
        </g>
        <g ref={ref}>
          <g filter="url(#filter2_f_18097_83545)">
            <path
              d="M48.7364 42.3389C57.0289 33.3259 55.8125 19.9855 46.8075 11.6855C37.8025 3.38556 24.419 3.26914 16.1264 12.2821C7.8338 21.2951 8.41131 35.33 17.4163 43.63C26.4213 51.9299 40.4438 51.3519 48.7364 42.3389Z"
              fill="white"
            />
          </g>

          <g
            style={{ mixBlendMode: "color-dodge" }}
            filter="url(#filter3_f_18097_83545)"
          >
            <path
              d="M48.3482 37.8831C57.7676 27.6455 57.6543 24.8914 47.4257 15.4637C37.1971 6.03593 27.586 -0.173034 18.1667 10.0646C8.74726 20.3023 9.40324 36.2443 19.6318 45.672C29.8604 55.0998 38.9288 48.1208 48.3482 37.8831Z"
              fill="#93B9FF"
            />
          </g>
        </g>
        <ellipse
          cx="20.759"
          cy="20.7605"
          rx="20.759"
          ry="20.7605"
          transform="matrix(1 -1.38685e-08 -0.000883839 -1 11.6919 48.0717)"
          fill="#141416"
        />
        <path
          d="M35.9492 27.5142L28.4416 27.5142"
          stroke="white"
          strokeWidth="0.97026"
          strokeLinecap="round"
        />
        <path
          d="M30.9438 30.3321L28.4413 27.5142L30.9438 24.6964"
          stroke="white"
          strokeWidth="0.97026"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_18097_83545"
          x="5.52058"
          y="3.90785"
          width="46.0838"
          height="47.4305"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2.21774"
            result="effect1_foregroundBlur_18097_83545"
          />
        </filter>
        <filter
          id="filter1_f_18097_83545"
          x="-0.0678"
          y="3.83033"
          width="46.0838"
          height="47.4305"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2.21774"
            result="effect1_foregroundBlur_18097_83545"
          />
        </filter>
        <filter
          id="filter2_f_18097_83545"
          x="5.83015"
          y="1.05476"
          width="52.9173"
          height="52.8764"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2.21774"
            result="effect1_foregroundBlur_18097_83545"
          />
        </filter>
        <filter
          id="filter3_f_18097_83545"
          x="5.5958"
          y="-1.12948"
          width="55.5784"
          height="57.1614"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2.95698"
            result="effect1_foregroundBlur_18097_83545"
          />
        </filter>
        <linearGradient
          id="paint0_linear_18097_83545"
          x1="1.11133"
          y1="28.6016"
          x2="27.8845"
          y2="52.1714"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#70A2FF" />
          <stop offset="0.21875" stopColor="#72F6D1" />
          <stop offset="0.479167" stopColor="#21BF7F" />
          <stop offset="0.723958" stopColor="#FFD505" />
          <stop offset="1" stopColor="#F76E64" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_18097_83545"
          x1="11.8007"
          y1="14.7087"
          x2="38.356"
          y2="42.2041"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1363FF" />
          <stop offset="0.277514" stopColor="#35FFC6" />
          <stop offset="0.523452" stopColor="#57F243" />
          <stop offset="0.731141" stopColor="#FFD637" />
          <stop offset="0.911458" stopColor="#FF4A3D" />
        </linearGradient>
        <clipPath id="clip0_18097_83545">
          <rect width="60" height="55" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
