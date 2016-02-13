require('hide-stack-frames-from')('babel-traverse', 'babel-core', 'babel-generator', 'babylon')
require('chai').should()
import fs from 'fs'
import path from 'path'
import { transformFileSync } from 'babel-core'


describe('Add return', () => {
  const fixturesDir = path.join(__dirname, 'fixtures')
  fs.readdirSync(fixturesDir).map(caseName => {
    if (caseName === '.DS_Store') return
    if (caseName.includes('[notest]')) return
    // if (!caseName.includes('dec')) return

    it(caseName, () => {
      const fixtureDir = path.join(fixturesDir, caseName)
      const actualPath = path.join(fixtureDir, 'actual.js')
      const actual = transformFileSync(actualPath).code

      const expected = fs.readFileSync(
        path.join(fixtureDir, 'expected.js')
      ).toString()

      actual.trim().should.be.equal(expected.trim())
    })
  })
})
