class Test extends React.Component {
  render() {
    return <div className={cx('some-class another-class').split(' ').map(c => styles[c]).join(' ')}>test</div>;
  }
}
