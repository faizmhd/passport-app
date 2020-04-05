import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';
import classNames from 'classnames';
import { Text } from 'react-native'

class Square extends React.Component {
  render() {
    let btnClass = null;
    btnClass = this.props.winner ? classNames('square', 'winner_class') : classNames('square');
    return (
      <button winner={this.props.winner}
        className={btnClass}
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
class Board extends React.Component {
  createPlateau() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3 * i + j));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
    }
    return rows;
  }
  renderSquare(i) {
    return <Square key={i} winner={this.props.winner_location[i]} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {

    return (
      <div>
        {this.createPlateau()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        winner_location: Array(9).fill(false),
        clic: [],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  highlightSquare(winner) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const winner_location = current.winner_location;
    for (let i = 0; i < winner.length; i++) {
      winner_location[winner[i]] = true;
    }
  }
  handleClick(i) {
    // Use of slice() to don't modify the initial squares value but update it by copy of the first one
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner_location = current.winner_location.slice();
    const clic = current.clic.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    clic.push(i);
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    winner_location[i] = false;
    this.setState({
      history: history.concat([{
        squares: squares,
        winner_location: winner_location,
        clic: clic,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  // This function aims to have the location of the clic with row/column from the array position of the clic
  convertClicToLocation(clic_position) {
    let location = [];
    location.push(Math.trunc(clic_position / 3) + 1);
    location.push(clic_position % 3 + 1);
    return location;
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let styles = {
      step: {
        fontWeight: "bold",
      }
    }

    const moves = history.map((step, move) => {
      const clic_location = this.convertClicToLocation(current.clic[move - 1]);
      if (move === 0) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><Text>Revenir au début de la partie</Text></button>
          </li>
        );
      }
      else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><Text>Revenir au tour n°<Text style={styles.step}>{move}</Text> à la ligne {clic_location[0]} / colonne {clic_location[1]}</Text></button>
          </li>
        );
      }

    });
    let status;
    if (winner) {
      status = (this.state.xIsNext ? 'O' : 'X') + ' a gagné';
      this.highlightSquare(winner);
    }
    else {
      if (this.state.stepNumber === 9) {
        status = "Match nul";
      }
      else {
        status = "Prochain joueur : " + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board winner_location={current.winner_location} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

// ========================================

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

export default Game;