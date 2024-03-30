import styles from "./styles.module.scss"
import {range} from "lodash";

type GameDefinition = {[key: string]: number};

function isValidStageSequence(stages: string[]) {
  const numStages = stages.length;
  return !stages.some((stage, idx) => stage === stages[(idx + 1) % numStages] || stage === stages[(idx + 2) % numStages]);
}

function findStageSequence(gameDefinition: GameDefinition) {
  // TODO: Implement.
  const games = Object.keys(gameDefinition);
  return [games[0], games[1], games[2], games[3], games[0], games[1], games[2], games[4], games[0], games[1], games[2]];
}

const Matchmaker = () => {

  const numTeams = 22;
  const numPairings = numTeams / 2;

  const redTeams = range(numPairings).map(i => `${i + 1}`);
  const blueTeams = range(numPairings).map(i => `${i + 1}`);

  const gameDefinition = {
    'Gemsch': 3,
    'Meierä': 3,
    'Arschlöchlä': 3,
    'Töggelä': 1,
    'PingPong': 1
  };
  const stages = findStageSequence(gameDefinition);
  console.log(isValidStageSequence(stages));

  const rounds = range(numPairings);

  return (
    <table>
      <tr>
        <th>Runde</th>
        {stages.map(stage => <th>{stage}</th>)}
      </tr>
      {rounds.map((round, idx) => {return (
        <tr>
          <td>{round + 1}</td>
          {stages.map((_, stage, ) => <td><span className={styles.redTeam}>{redTeams[(round + stage) % numPairings]}</span> <span className={styles.blueTeam}>{blueTeams[(round + stage + 1) % numPairings]}</span></td>)}
        </tr>
      )})}
    </table>
  );
}

/*
TODO:
- Blue team selection in <td> is not yet correct. Should progress by 2 stages each round, as opposed to 1 stage for red teams.
- Find an algorithm that produces a stages permutation that fulfills isValidCombination, given some input {G: 3, M: 3, A: 3, T: 1, P: 1}.
 */

export default Matchmaker;
