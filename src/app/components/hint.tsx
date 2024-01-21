import { Component } from "react";

interface HintProps {
  name: string;
  game: any;
}

class Hint extends Component<HintProps> {
  componentDidMount() {
    this.cleanFields();
  }
  cleanFields = () => {
        console.log(this.props.game)
        delete this.props.game.id;
        delete this.props.game.name;
        delete this.props.game.slug;
    };
  getRandomField = () => {};
  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
      </div>
    );
  }
}
export default Hint
