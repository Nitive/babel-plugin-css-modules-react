import React from 'react'
import { render } from 'react-dom'
import styles from './styles.css'

const Button = ({ children }) => (
  <button styleName='button'>{ children }</button>
)

render(<Button>My Button</Button>, document.getElementById('root'))
