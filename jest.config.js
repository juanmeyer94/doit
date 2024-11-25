const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [ // Acá elegis donde queres que tome los test, en este caso components
    'src/components/**/*.{js,jsx,ts,tsx}', // Solo incluir archivos dentro de la carpeta `components`
    '!src/components/**/*.d.ts', // Excluir archivos de definición de TypeScript+
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

