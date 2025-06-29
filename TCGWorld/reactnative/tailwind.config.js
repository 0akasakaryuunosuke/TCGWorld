/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        myGreen:"#98D98E",
        myGray:"#D3D3D3",
        myBlack:"#000005",
        myWhite:"#FEFEFE",
        myBackGround:"#F5F5F5",
      },
    }
  },
  plugins: [],
}