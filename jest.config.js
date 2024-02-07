// const nextJest = require("next/jest");
// const createJestConfig = nextJest({
//   dir: "./",
// });
// const customJestConfig = {
//   moduleDirectories: ["node_modules", "<rootDir>/", "src"],
//   testEnvironment: "jest-environment-jsdom",
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/$1",
//   },
// };
// module.exports = createJestConfig(customJestConfig);

const nextJest = require("next/jest");
const { TextEncoder, TextDecoder } = require("util");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/", "src"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
Object.assign(customJestConfig, { TextDecoder, TextEncoder });
module.exports = createJestConfig(customJestConfig);
