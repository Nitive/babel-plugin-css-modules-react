const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'

export default function ({ types: t, template }) {
  const conventClassNames = `.map(function(c) { return STYLES[c] }).join(' ')`

  const splitClassesGenerator = (() => {
    if (isProduction) {
      return template(`SOURCE.split(' ')${conventClassNames}`)
    }
    return template(`(function () {
      var CLASSES = SOURCE.split(' ')
      CLASSES.forEach(function (className) {
        if (Object.keys(STYLES).indexOf(className) === -1) {
          console.warn('Class .' + className + ' is not specified in your css file')
        }
      })
      return CLASSES${conventClassNames}
    })()`)
  })()

  const getExpressionsFromClassList = (classList, stylesIdentifier) => {
    const getExpressionFromClass = className => {
      return t.memberExpression(
        stylesIdentifier,
        t.stringLiteral(className),
        true
      )
    }

    const reduceBinaryExression = (exp, className) => {
      return t.binaryExpression(
        '+',
        exp,
        getExpressionFromClass(className)
      )
    }

    const emptyStringsFilter = str => str !== ''

    const classes = classList.split(' ').filter(emptyStringsFilter)
    return classes.slice(1).reduce(
      reduceBinaryExression,
      getExpressionFromClass(classes[0])
    )
  }


  const getValue = (path, stylesIdentifier) => {
    if (isProduction && path.node.value.type === 'StringLiteral') {
      return getExpressionsFromClassList(path.node.value.value, stylesIdentifier)
    }
    const ast = splitClassesGenerator({
      SOURCE: path.node.value.expression || path.node.value,
      CLASSES: path.scope.generateUidIdentifier('classes'),
      STYLES: stylesIdentifier,
    })
    return ast.expression
  }

  const getClassesWithGlobal = (classesCompositionExpression, globalClasses) => {
    if (!globalClasses) return classesCompositionExpression
    return t.binaryExpression(
      '+',
      classesCompositionExpression,
      t.stringLiteral(globalClasses)
    )
  }

  const findClassNameAttribute = attrNode => attrNode.name.name === 'className'

  // also delete className attribute
  const getClassNameIfExist = tagNode => {
    const classNameNodeIndex = tagNode.attributes.findIndex(findClassNameAttribute)
    const classNameNode = tagNode.attributes[classNameNodeIndex]
    if (classNameNode) {
      tagNode.attributes.splice(classNameNodeIndex, 1)
      return classNameNode.value.value
    }
    return null
  }

  const JSXAttributeVisitor = function (path) {
    const stylesIdentifier = this.stylesIdentifier
    path.traverse({ JSXAttribute: JSXAttributeVisitor }, { stylesIdentifier })
    if (path.node.name.name !== 'styleName') return
    const className = getClassNameIfExist(path.parent)
    path.node.name.name = 'className'

    path.node.value = t.jSXExpressionContainer(
      getClassesWithGlobal(getValue(path, stylesIdentifier), className)
    )
  }

  const requireStylesTemplate = template(`
    var STYLES = require(PATH_TO_FILE);
  `)

  const decoratorVisitor = path => {
    if (path.node.expression.callee.name !== 'modulify') return
    const pathToCSSFile = path.node.expression.arguments[0].value
    const stylesIdentifier = path.scope.generateUidIdentifier('styles')
    path.parentPath.traverse({
      JSXAttribute: JSXAttributeVisitor,
    }, { stylesIdentifier })
    path.replaceWith(requireStylesTemplate({
      STYLES: stylesIdentifier,
      PATH_TO_FILE: t.stringLiteral(pathToCSSFile),
    }))
  }

  return {
    visitor: {
      Decorator: decoratorVisitor,
    },
  }
}
