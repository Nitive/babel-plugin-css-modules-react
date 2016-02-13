var _styles = require('./styles.css');class Test extends React.Component {
  render() {
    return <div className={cx('some-class').split(' ').map(function (c) {
      return _styles[c];
    }).join(' ')}>test</div>;
  }
}
