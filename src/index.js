import template from 'babel-template'
import * as t from 'babel-types'

const splitClassesGenerator = (() => {
  if (process.env.NODE_ENV === 'production') {
    return template(`SOURCE.split(' ').map(c => STYLES[c]).join(' ')`)
  }
  return template(`(function () {
    var CLASSES = SOURCE.split(' ')
    CLASSES.forEach(function (className) {
      if (Object.keys(STYLES).indexOf(className) === -1) {
        console.warn('Class ' + className + ' is not specified in your css file')
      }
    })
    return CLASSES.map(c => STYLES[c]).join(' ')
  })()`)
})()


const getExpressionFromClass = className => {
  return t.memberExpression(
    t.identifier('styles'),
    t.stringLiteral(className),
    true
  )
}

const getExpressionsFromClassList = classList => {
  const classes = classList.split(' ').filter(c => c) // filter ''
  return classes.slice(1).reduce((exp, cl) => {
    return t.binaryExpression(
      '+',
      exp,
      getExpressionFromClass(cl)
    )
  }, getExpressionFromClass(classes[0]))
}


const getValue = path => {
  if (path.node.value.type === 'StringLiteral') {
    return getExpressionsFromClassList(path.node.value.value)
  }
  const ast = splitClassesGenerator({
    SOURCE: path.node.value.expression,
    CLASSES: path.scope.generateUidIdentifier('classes'),
    STYLES: t.identifier('styles'),
  })
  return ast.expression
}

const JSXAttributeVisitor = path => {
  path.traverse({ JSXAttribute: JSXAttributeVisitor })
  if (path.node.name.name !== 'styleName') return
  path.node.name.name = 'className'

  path.node.value = t.jSXExpressionContainer(
    getValue(path)
  )
}

export default function () {
  return {
    visitor: {
      JSXAttribute: JSXAttributeVisitor,
    },
  }
}
