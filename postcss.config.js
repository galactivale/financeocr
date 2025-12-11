// Next.js 15 has built-in autoprefixer support
// Only include autoprefixer if explicitly needed
module.exports = {
  plugins: {
    tailwindcss: {},
    // Autoprefixer is optional - Next.js handles vendor prefixes automatically
    // Uncomment if you need explicit autoprefixer control
    // autoprefixer: {},
  },
}
