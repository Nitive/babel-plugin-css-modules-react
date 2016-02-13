@modulify('./styles.css')
class Test extends React.Component {
  render() {
    return <div styleName='local' className='global'>test</div>;
  }
}
