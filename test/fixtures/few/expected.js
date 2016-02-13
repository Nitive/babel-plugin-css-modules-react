var _styles = require('./styles.css');class Test extends React.Component {
  render() {
    return <div className={_styles['some-class'] + _styles['another-class']}>test</div>;
  }
}
