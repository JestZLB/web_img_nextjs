import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "morfonica-1": "#33AAFF",
        "morfonica-2": "#D1ECFF",
        "msr": "#6677CC",
        "toko": "#EE6666",
        "nnm": "#EE7744",
        "tsukushi": "#EE7788",
        "rui": "#669988"
      },
      textStrokeWidth: {
        1: '0.05rem',
        2: '0.1rem',
        3: '0.15rem',
        4: '0.2rem',
        // Add more if needed
      },
      width : {
        "1024" : '1024px',
        "1440" : '1440px',
        "9/10" : '90%',
        "1920" : '1920px',
        "750" : '750px'
      },
      height : {
        "1080" : '1080px',
        "9/10" : '90%',
      },
      padding : {
        "9/16" : '56.25%',
        '1/5' : '20%',
        '2/5' : '40%',
        '3/5' : '60%',
        '4/5' : '80%',
      },
      zIndex : {
        1 : '1'
      },
      keyframes: {
        customPing: {
          '75%, 100%': { transform: 'scale(1.1)', opacity: '0' },
        },
      },
      animation: {
        customPing: 'customPing 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      rotate : {
        "360" : "360deg"
      }
    },

  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        ".border-morfonica-1": {
          border: `1px solid ${theme('colors.morfonica-1')}`,
        },
        ".border-morfonica-2": {
          border: `1px solid ${theme('colors.morfonica-2')}`,
        },
        ".border-msr": {
          border: `1px solid ${theme('colors.msr')}`,
        },
        ".border-toko": {
          border: `1px solid ${theme('colors.toko')}`,
        },
        ".border-nnm": {
          border: `1px solid ${theme('colors.nnm')}`,
        },
        ".border-tsukushi": {
          border: `1px solid ${theme('colors.tsukushi')}`,
        },
        ".border-rui": {
          border: `1px solid ${theme('colors.rui')}`,
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    function({ addUtilities, theme }) {
      const colors = theme('colors');
      let newUtilities:any = {};
      // This will iterate over your color palette
      Object.keys(colors).forEach(key => {
        const color = colors[key];
        // This handles the case where the color is an object with shades
        if (typeof color === 'object' && color !== null) {
          Object.keys(color).forEach(shade => {
            const className = `.text-stroke-${key}-${shade}`;
            newUtilities[className] = {
              '-webkit-text-stroke-color': color[shade],
            };
          });
        } else {
          // This is when the color is a simple string
          const className = `.text-stroke-${key}`;
          newUtilities[className] = {
            '-webkit-text-stroke-color': color,
          };
        }
      });

      // This adds text stroke width utilities
      const strokeWidths = theme('textStrokeWidth');
      Object.keys(strokeWidths).forEach(key => {
        const className = `.text-stroke-${key}`;
        newUtilities[className] = {
          '-webkit-text-stroke-width': strokeWidths[key],
        };
      });

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
export default config;
