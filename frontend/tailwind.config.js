/** @type {import('tailwindcss').Config} */
// const withMT = require("@material-tailwind/html/utils/withMT");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      backgroundImage: {
        banner: "url(/banner.jpg)",
      },
    },
  },
  plugins: [],
};
// export default withMT({
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
    
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         banner: "url(/banner.jpg)",
//       },
//     },
//   },
//   plugins: [],
// });
