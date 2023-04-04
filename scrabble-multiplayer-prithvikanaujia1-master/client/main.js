import {Game} from './game.js';
import {Rack} from './rack.js';
import * as utils from "./scrabbleUtils.js";

window.addEventListener("load", async function() {
    const response = await fetch("https://raw.githubusercontent.com/web-programming-org/web-programming/master/homeworks/dictionary.json"); // dictionary.json");
    if (!response.ok) {
        console.log(response.error);
        return;
    }
    // We make dictionary a global.
    window.dictionary = await response.json();

    const game = new Game();
    const boardElement = document.getElementById('board')
    game.render(boardElement);
    let turn = true;
    const rack1 = new Rack();
    const rack2 = new Rack();
    rack1.takeFromBag(7, game);
    rack1.render(document.getElementById("rack1"));
    rack2.takeFromBag(7, game);
    rack2.render(document.getElementById("rack2"));
    let rack = turn?rack1:rack2;
    // let rackID = turn? this.document.getElementById("rack1")
    console.log(rack.getAvailableTiles());
    document.getElementById('turn').innerText = turn? "It is " + document.getElementById('p1').value + "'s turn!" : "It is " + document.getElementById('p2').value + "'s turn"
    document.getElementById('play').addEventListener('click', () => {
        const word = document.getElementById('word').value;
        const x = parseInt(document.getElementById('x').value);
        const y = parseInt(document.getElementById('y').value);
        const direction = document.getElementById('direction').value === 'horizontal';

        if (!utils.canConstructWord(rack.getAvailableTiles(), word) || !dictionary.includes(word)) {
            alert(`The word ${word} cannot be constructed.`);
	    console.log(utils.canConstructWord(rack.getAvailableTiles(), word));
	    console.log(dictionary.includes(word));
	    console.log("---");
        } else {
            if (game.playAt(utils.constructWord(rack.getAvailableTiles(), word).join(''), {x, y}, direction) !== -1) {
                game.render(boardElement);
                const used = utils.constructWord(rack.getAvailableTiles(), word);
                used.forEach(tile => rack.removeTile(tile));
                rack.takeFromBag(used.length, game);
                turn?rack.render(document.getElementById("rack1")):rack.render(document.getElementById("rack2"));
                turn = !turn;
                document.getElementById('turn').innerText = turn? "It is " + document.getElementById('p1').value + "'s turn!" : "It is " + document.getElementById('p2').value + "'s turn";
                rack = turn?rack1:rack2;
            }
        }
    });
    
    document.getElementById('reset').addEventListener('click', () => {
        game.reset();
        game.render(boardElement);
    });

    document.getElementById('help').addEventListener('click', () => {
        const possibilities = utils.bestPossibleWords(rack.getAvailableTiles());
        const hint = possibilities[Math.floor(Math.random() * possibilities.length)];
        document.getElementById("hint").innerText = hint;
    });
});
