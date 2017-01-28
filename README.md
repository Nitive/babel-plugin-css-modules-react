# Babel Plugin CSS Modules React

[![Greenkeeper badge](https://badges.greenkeeper.io/Nitive/babel-plugin-css-modules-react.svg)](https://greenkeeper.io/)
[![Circle CI](https://circleci.com/gh/Nitive/babel-plugin-css-modules-react.svg?style=svg)](https://circleci.com/gh/Nitive/babel-plugin-css-modules-react)
[![codecov.io](https://codecov.io/github/Nitive/babel-plugin-css-modules-react/coverage.svg?branch=master)](https://codecov.io/github/Nitive/babel-plugin-css-modules-react?branch=master)


## What's the Problem?
webpack css-loader itself has several disadvantages:

- You have to use camelCase CSS class names.
- Mixing CSS Modules and global CSS classes is cumbersome.
- Reference to an undefined CSS Module resolves to undefined without a warning.

### Babel Plugin React CSS Modules make all work for you

#### Use classes as usual
```javascript
import styles from './styles.css'

class Button extends React.Component {
  render() {
    return <button styleName='button size-m'>{ this.props.children }</button>
  }
}
```
Will be converted into:
```javascript
import styles from './styles.css'

class Button extends React.Component {
  render() {
    return <button className={ styles['button'] + styles['size-m'] }>{ this.props.children }</button>
  }
}
```

#### Easy use global CSS
```javascript
import styles from './styles.css'

const Button = ({ children }) => (
  <button styleName='local' className='global'>{ children }</button>
)
```

#### Get warnings when you are mistaken
```javascript
import styles from './styles.css'

const Button = ({ children }) => (
  <button styleName='erroneous-class'>{ children }</button> // Warning: Class .erroneous-class is not specified in your css file
)
```

### Requirements
You *must* keep your classes map inside `styles` variable

## Future plans
Load styles with decorator syntax

```javascript
@modulize('./styles.css')
class Button extends React.Component {
  render() {
    return <button styleName='button'>{ this.props.children }</button>
  }
}
```
