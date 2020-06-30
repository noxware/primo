// @ts-check

const func = require('../lib/util/function');

/**
 * Type imports
 * 
 * @typedef {import('./objects/GameState')} GameState
 */

/**
 * 
 * @param {GameState} gs 
 */
async function game(gs) {
  gs.state = 'playing';

  gs.send('The game is going to start! Close your eyes! (Not really).');

  while (gs.state != 'end') {
    /* Turns */

    const gen = gs.players.inTurnOrder();

    for (const p of gen) {
      //const action = func.unsureCall(p.onTurn);
      gs.currentPlayer = p;
      const action = p.onTurn ? await p.onTurn() : undefined;
      console.log(action);
      if (action) gs.actions.add(action);
      console.log('x');
    }

    gs.currentPlayer = undefined;

    gs.actions.runAll(true);

    /* Dead messages */

    const killMessages = gs.kills.map(p => `${p.displayName} died.`);

    for (const msg of killMessages) {
      gs.send(msg);
    }
    
    /* Standard win condition */

    let mafiaTeam = 0;
    let villageTeam = 0;

    for (const p of gs.players) {
      if (p.alive) {
        if (p.role.team === 'mafia')
          mafiaTeam++;
        else if (p.role.team === 'village')
          villageTeam++;
      }
    }

    if (mafiaTeam === 0) {
      gs.send('The village team won.');
      gs.reset();
      return;
    } else if (villageTeam === 0) {
      gs.send('The mafia team won.');
      gs.reset();
      return;
    }

    gs.kills.reset();

    /* Votation phase (improvised) */

    gs.send([
      `Open all your eyes!`,
      `You can start voting now with 'uwu vote <playerMention>'`,
      `Talk together and think carefully before voting.`
    ]);

    gs.votePhase = true;
    await new Promise((resolve) => {gs.voteResolve = resolve});
    if (gs.votePhaseAgain)
      await new Promise((resolve) => {gs.voteResolve = resolve});
    gs.votePhase = false;

    if(gs.state = 'ready') return;
    

    /** @type [string | null, number] */
    let mostVoted = [null, 0];
    /** @type [string | null, number] */
    let secondMostVoted = [null, 0];

    for (const [id, votes] of gs.votes) {
      if(mostVoted[1] <= votes) { // <= is important
        secondMostVoted = mostVoted;
        mostVoted = [id, votes];
      }
    }

    // players / 2?
    if (mostVoted[1] <= gs.players.size / 2) {
      gs.send('The votation ended with not enough votes to kill someone. You must have more than the half of players to kill someone.');
    } else {
      if (mostVoted[1] === secondMostVoted[1]) {
        gs.send('The votation ended in a draw. Nobody died.')
      } else {
        const died = gs.players.get(mostVoted[0]).kill();

        if (died) {
          const team = gs.players.get(mostVoted[0]).role.team;

          if (team === 'mafia')
            mafiaTeam--;
          else if (team === 'village')
            villageTeam--;

          gs.send(`${gs.players.get(mostVoted[0]).displayName} has been killed by the village.`);
        }
        else
          gs.send(`${gs.players.get(mostVoted[0]).displayName} should die but the player is inmortal.`);
      }
    }

    // Win condition (again)
    if (mafiaTeam === 0) {
      gs.send('The village team won.');
      gs.reset();
      return;
    } else if (villageTeam === 0) {
      gs.send('The mafia team won.');
      gs.reset();
      return;
    }

    gs.send('The next phase is going to start! Close your eyes! (seriosuly not really).');
  }
}

module.exports = game