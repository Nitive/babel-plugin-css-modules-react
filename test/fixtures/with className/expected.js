var _styles = require('./styles.css');class Test extends React.Component {
  render() {
    return <div className={_styles['local'] + 'global'}>test</div>;
  }
}
