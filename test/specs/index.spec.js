'use strict'

const vuedoc = require('../..')
const assert = require('assert')
const path = require('path')
const Parser = require('@vuedoc/parser/lib/parser')

const options = {
  filename: path.join(__dirname, '../fixtures/checkbox.vue')
}

let document = null

vuedoc.md(options)
  .then((_document) => (document = _document))
  .catch((err) => { throw err })

/* global describe it */

describe('options', () => {
  let document = null
  const _options = {}
  const ignore = ['name', 'description']

  Object.assign(_options, options)

  _options.features = Parser.SUPPORTED_FEATURES.filter((feature) => !ignore.includes(feature))

  vuedoc.md(_options)
    .then((_document) => (document = _document))
    .catch((err) => { throw err })

  it('should render without main title', () =>
    assert.equal(/# checkbox/.test(document), false))

  it('should render without description', () =>
    assert.equal(/A simple checkbox component/.test(document), false))
})

describe('component', () => {
  it('should have name as main title', () =>
    assert.ok(/# checkbox/.test(document)))

  it('should have author keyword', () =>
    assert.ok(/- \*\*author\*\* - Sébastien/.test(document)))

  it('should have license keyword', () =>
    assert.ok(/- \*\*license\*\* - MIT/.test(document)))

  it('should have main title with default level', () => {
    const _options = {}

    Object.assign(_options, options)

    vuedoc.md(_options)
      .then((document) => {
        assert.equal(/# checkbox/.test(document), true)
      })
      .catch((err) => { throw err })
  })

  it('should have main title with level 2 notation', () => {
    const _options = {}

    Object.assign(_options, options)

    _options.level = 2

    vuedoc.md(_options)
      .then((document) => {
        assert.equal(/## checkbox/.test(document), true)
      })
      .catch((err) => { throw err })
  })

  it('should have main title with level 7 to 6', () => {
    const _options = {}

    Object.assign(_options, options)

    _options.level = 7

    vuedoc.md(_options)
      .then((document) => {
        assert.equal(/###### checkbox/.test(document), true)
      })
      .catch((err) => { throw err })
  })

  it('should have a description', () =>
    assert.equal(/A simple checkbox component/.test(document), true))
})

describe('props', () => {
  it('should render props title', () =>
    assert.ok(/## props/.test(document)))

  it('should render props.model with a description', () => {
    assert.ok(/- .model. \*\*\*Array\*\*\* \(\*required\*\) .twoWay = true./.test(document))
    assert.ok(/The checkbox model/.test(document))
  })

  it('should render props.disabled with a description', () => {
    assert.ok(/- .disabled. \*\*\*Boolean\*\*\* \(\*optional\*\)/.test(document))
    assert.ok(/Initial checkbox state/.test(document))
  })

  it('should render props.checked with a description', () => {
    assert.ok(/- .enabled. \*\*\*Boolean\*\*\* \(\*optional\*\) .default: true../.test(document))
    assert.ok(/Initial checkbox value/.test(document))
  })
})

describe('data', () => {
  it('should render data title', () =>
    assert.ok(/## data/.test(document)))

  it('should render a data with its description and initial value', () => {
    assert.ok(/- `initialValue` The initial component value\. Used to detect changes and restore the initial value\.\s+\*initial value:\* `''`/.test(document))
  })

  it('should render a data without a description', () => {
    assert.ok(/- `currentValue`\s+\*initial value:\* `''`/.test(document))
  })
})

describe('computed', () => {
  it('should render computed properties title', () =>
    assert.ok(/## computed properties/.test(document)))

  it('should render a computed property with its description and dependencies', () => {
    assert.ok(/- `id` The component identifier. Generated using the `initialValue` data.\s+\*dependencies:\* `initialValue`/.test(document))
  })

  it('should render a computed property without a description', () => {
    assert.ok(/- `changed`\s+\*dependencies:\* `currentValue` `initialValue`/.test(document))
  })

  it('should render a computed property without a description and dependencies', () => {
    assert.ok(/- `withNoDependencies`/.test(document))
  })
})

describe('slots', () => {
  it('should render slots title', () =>
    assert.ok(/## slots/.test(document)))

  it('should render the default slot without a description', () => {
    assert.ok(/- .default./.test(document))
  })

  it('should render the nammed slot with a description', () => {
    assert.ok(/- .label. Use this slot to set the checkbox label/.test(document))
  })
})

describe('events', () => {
  it('should render events title', () =>
    assert.ok(/## events/.test(document)))

  it('should render an event with a description', () => {
    assert.ok(/- .loaded. Emitted when the component has been loaded/.test(document))
  })

  it('should render an event with a multiline description', () => {
    assert.ok(/- .enabled. Emitted the event .enabled. when loaded\s+Multilign/.test(document))
  })
})

describe('methods', () => {
  it('should render methods title', () =>
    assert.ok(/## methods/.test(document)))

  it('should render a method with a description', () => {
    assert.ok(/- .check\(\).\s+Check if the input is checked/.test(document))
  })

  it('should render a method without a description', () => {
    assert.ok(/- .prop\(\)./.test(document))
  })

  it('should render a method with a dynamic name', () => {
    assert.ok(/- .dynamic\(\).\s+Make component dynamic/.test(document))
  })

  it('should render a method with a recursive dynamic name', () => {
    assert.ok(/- .dynamic2\(\).\s+Enter to dynamic mode/.test(document))
  })

  it('should render a method with its params', () => {
    assert.ok(/- .enable\(value\).\s+Enable the checkbox/.test(document))
  })
})
