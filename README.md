## JS Project Proposal: Advanced Battleship

### Background

Advanced Battleship is based on the original Battleship and its variation **Battleship: Advanced Mission**.

1) This game will be played just like the original Battleship, but each ship has its own distinct weapon it can use.
2) Each ship has a finite number of times its weapon can be deployed, but the player may always choose to launch a single space attack, even after all ships have used up their weapons.
3) Players will have the ability to utilize reconnaissance(with limitations) on their opponents.

There are many features the original Battleship: Advanced Mission. The final game will include many of those features and more outlines in the **Functionality & MVP** section as well as the **Bonus Features** section.

### Functionality & MVP  

In Advanced Battleship, users will be able to:

- [ ] Play against AI
- [ ] Begin, forfeit, and reset the game
- [ ] Set initial configuration of fleet on board
- [ ] Execute commands which will deploy weapons at opponent's fleet

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A production README

### Wireframes

This app will consist of a single screen with game board, game controls, and the Pause/About modal.  Game controls will include Weapon Options, Fire, Begin, Forfeit, and Reset buttons as well as a difficulty option in the Pause/About modal.

![wireframes](https://github.com/chasem91/AdvancedBattleship/blob/master/advanced_battleship.jpg)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jQuery` for overall structure and game logic
- Webpack to bundle and serve up the various scripts

In addition to the webpack entry file, there will be three scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the necessary `HTML` elements and rendering them to the DOM.

`game.js`: this script will handle the logic behind the scenes.

`ship.js`: this will be the superclass for various other ships.

`[child-ship].js`: each of these will have its own weapon inventory, position and 'active' status.

`cell.js`: this lightweight script will house the constructor and update functions for the `Cell` objects. Each cell will be in any of these states: "empty", "ship", "hit" and "miss."

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running. Create `webpack.config.js` as well as `package.json`.  Write a basic entry file.

- Get a green bundle with `webpack`

**Day 2**: First, build out the `Cell` object to connect to the `Board` object.  Then, use `board.js` to create and render at least the square grid. Goals for the day:

- Complete the `Board.js` object
- Complete the `cell.js` module (constructor, update functions)

**Day 3**: Create the logic backend.  Build out modular functions for handling keyboard input.  Incorporate the logic into the `Board.js` rendering.  Goals for the day:

- Have a functional grid on the frontend that correctly handles iterations from one generation of the game to the next
- Create controls for game difficulty, begin, forfeit, and pause


**Day 4**: Style the frontend, making it polished and professional.  Goals for the day:

- Have a styled display, nice looking controls and title

### Bonus features

- [ ] Add options for different rule sets
- [ ] Add ability to play another human online
