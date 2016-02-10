# Babel Plugin React CSS Modules
[![Circle CI](https://circleci.com/gh/Nitive/babel-plugin-react-css-modules.svg?style=svg)](https://circleci.com/gh/Nitive/babel-plugin-react-css-modules)
[![codecov.io](https://codecov.io/github/Nitive/babel-plugin-react-css-modules/coverage.svg?branch=master)](https://codecov.io/github/Nitive/babel-plugin-react-css-modules?branch=master)


## What's the Problem?
webpack css-loader itself has several disadvantages:

- You have to use camelCase CSS class names.
- Mixing CSS Modules and global CSS classes is cumbersome.
- Reference to an undefined CSS Module resolves to undefined without a warning.

### Babel Plugin React CSS Modules make all work for you

#### Use classes as usual
```
import styles from './styles.css'

class Button extends React.Component {
  render() {
    return <button styleName='button size-m'>{ this.props.children }</button>
  }
}
```
Which would be rendered to:
```
import styles from './styles.css'

class Button extends React.Component {
  render() {
    return <button className={ styles['button'] + styles['size-m'] }>{ this.props.children }</button>
  }
}
```

#### Easy use global CSS
```
import styles from './styles.css'

const Button = ({ children }) => (
  <button styleName='local' className='global'>{ children }</button>
)
```

#### Get warnings when you are mistaken
```
import styles from './styles.css'

const Button = ({ children }) => (
  <button styleName='erroneous-class'>{ children }</button> // Warning: Class .erroneous-class is not specified in your css file
)
```

### I have dinamicly calculated class names
It is OK, it would work.

### Requirements
You *must* keep your classes map inside `styles` variable

## Future plans
Load styles with decorator syntax

```
@modulize('./styles.css')
class Button extends React.Component {
  render() {
    return <button styleName='button'>{ this.props.children }</button>
  }
}
```
