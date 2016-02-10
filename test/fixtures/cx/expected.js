class Test extends React.Component {
  render() {
    return <div className={cx('some-class').split(' ').map(function (c) {
      return styles[c];
    }).join(' ')}>test</div>;
  }
}
