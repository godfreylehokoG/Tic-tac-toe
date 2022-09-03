function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const X = 'X';
const O = 'O';


const WINNING_PATTERNS = [
7, 56, 448, // .horizontal.
73, 146, 292, // .Vertical.
273, 84 // .Aross.
];

const Circle = () =>
React.createElement("svg", { className: "pawn circle", viewBox: "0 0 128 128" }, 
React.createElement("path", { d: "M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" }));



const Times = () =>
React.createElement("svg", { className: "pawn times", viewBox: "0 0 128 128" }, 
React.createElement("path", { d: "M16,16L112,112" }), 
React.createElement("path", { d: "M112,16L16,112" }));



class Line extends React.PureComponent {

  d() {
    const { pattern } = this.props;
    return {
      7: `M 0,5 H 100`,
      56: `M 0,50 H 100`,
      448: `M 0,95 H 100`,
      73: `M 5,0 V 100`,
      146: `M 50,0 V 100`,
      292: `M 95,0 V 100`,
      273: `M 0,0 L 100,100`,
      84: `M 100,0 L 0,100` }[
    pattern];
  }

  render() {
    const { show } = this.props;
    return (
      React.createElement("svg", { className: `line ${show ? 'visible' : ''}`, viewBox: "0 0 100 100" }, 
      React.createElement("path", { d: this.d() })));


  }}


const Cube = ({ value, onClick }) => 
React.createElement("div", { className: `cube ${value ? 'rotated' : ''}`, onClick: onClick, ref: ref => this.ref = ref },
['top', 'bottom', 'left', 'right', 'front', 'back'].map((face) => 
React.createElement("div", { className: face },
face === 'back' && value === O && React.createElement(Circle, null),
face === 'back' && value === X && React.createElement(Times, null))));





const Row = ({ children }) => React.createElement("div", { className: "row" }, children);

const Results = ({ winner, draw, onPlayAgain }) => 
React.createElement("div", { className: "results" }, 
React.createElement("div", { className: "message" }, 
React.createElement("div", { className: "symbol" },
winner === X && React.createElement(Times, null),
winner === O && React.createElement(Circle, null),
draw && React.createElement(React.Fragment, null, React.createElement(Times, null), React.createElement(Circle, null))), 

React.createElement("div", { className: "text" },
winner ? 'Wins!' : 'Draw!')), 


React.createElement("div", { className: "replay", onClick: onPlayAgain }, "Play Again"));



const Board = ({ board, onClick }) => 
React.createElement("div", { className: "board" },
board.map((row, i) => 
React.createElement(Row, null,
row.map((col, j) => 
React.createElement(Cube, { value: col, onClick: () => onClick(i, j) })))));






class Game extends React.PureComponent {

  constructor(props) {
    super(props);_defineProperty(this, "handleOnClick",
    (i, j) => {
      if (null === this.state.board[i][j]) {
        const { player, board, patterns } = this.state;
        const state = {
          board: [...board],
          player: player === X ? O : X,
          patterns: { ...patterns } };


        // (Set the value in the board)
        state.board[i][j] = player;

        // (bitwise)Add the value to the player pattern using bitwise OR
        state.patterns[player] = state.patterns[player] |= Math.pow(2, i * 3 + j);

        state.winner = this.checkForWin(state.patterns);

        this.setState(state);

        if (state.winner || this.isBoardFull(board)) {
          setTimeout(() => {
            this.setState({ rotated: true });
          }, 1500);
        }
      }
    });_defineProperty(this, "handleOnPlayAgain",

    () => {
      this.setState({ rotated: false });
      setTimeout(() => {
        this.setState(this.getInitialState());
      }, 1000);
    });this.state = this.getInitialState();}getInitialState() {return { player: X, patterns: { [X]: 0, [O]: 0 }, winner: null, rotated: false, board: [[null, null, null], [null, null, null], [null, null, null]] };}checkForWin(patterns) {// Loop through all possible winning sets
    for (let i = 0; i < WINNING_PATTERNS.length; i++) {// (bitwise)Use bitwise AND to determind if the player's score
      // Holds a winning pattern
      if ((WINNING_PATTERNS[i] & patterns[X]) === WINNING_PATTERNS[i]) return X;if ((WINNING_PATTERNS[i] & patterns[O]) === WINNING_PATTERNS[i]) return O;} // No winner
    return false;}isBoardFull(board) {return !this.state.board.some((row, i) => {return row.some((col, j) => null === col);});}getWinningPattern() {const { winner, patterns } = this.state;return WINNING_PATTERNS.find(pattern => (pattern & patterns[winner]) === pattern);
  }

  render() {
    const { board, winner, rotated } = this.state;
    return (
      React.createElement("div", { className: `game ${rotated ? 'rotated' : ''}` }, 
      React.createElement(Results, { winner: winner, draw: !winner && this.isBoardFull(board), onPlayAgain: this.handleOnPlayAgain }), 
      React.createElement(Line, { show: winner, pattern: this.getWinningPattern() }), 
      React.createElement(Board, { board: board, onClick: this.handleOnClick })));


  }}


ReactDOM.render( 
React.createElement(Game, null),
document.body);