@modulify('./styles.css')
class Test extends React.Component {
  render() {
    return <div styleName={cx('some-class')}>test</div>;
  }
}
