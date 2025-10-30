// Fixed for ESM compatibility: GitHub CI failed to load PostCSS config under "type": "module"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
