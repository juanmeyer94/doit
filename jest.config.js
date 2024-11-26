const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [ 
    'src/components/**/*.{js,jsx,ts,tsx}', 
    '!src/components/**/*.d.ts', 
    '!src/components/logo.tsx'
  ],
  collectCoverage:true,
  coverageDirectory: "/dev/null",
  coverageReporters: ["text"],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
}

module.exports = createJestConfig(customJestConfig)

