/* globals Set */
import {dictionary} from '@data';
import {TILE_STATUS, TILE_COLOR} from '@constants';

const {MISS, EXACT, ALMOST} = TILE_STATUS;

export const isAlphabet = letter => /^[a-z]$/.test(letter.toLowerCase());

export function getWordleDictionary() {
  const wordleDictionarySet = new Set(dictionary);
  return {
    wordleDictionarySet,
    wordleDictionaryArray: dictionary,
  };
}

export const getRandomWord = arr => arr[Math.floor(Math.random() * arr.length)];

export function getLetterStatus(
  currentRow,
  currRowIndex,
  keyState,
  tileState,
  wordToBeGuessed,
) {
  const letterOccurrences = {};
  wordToBeGuessed.split("").forEach((letter) => {
    letterOccurrences[letter] = (letterOccurrences[letter] || 0) + 1;
  });

  const tempKeyState = JSON.parse(JSON.stringify(keyState));
  const tempTileState = tileState.map((row) => [...row]);

  tempTileState[currRowIndex] = currentRow.map((letter, i) => {
    if (!letter) return "";

    if (letter === wordToBeGuessed[i]) {
      tempKeyState[EXACT].push(letter);
      letterOccurrences[letter]--;
      return EXACT;
    }
    return null;
  });

  tempTileState[currRowIndex] = tempTileState[currRowIndex].map((state, i) => {
    if (state !== null) return state; // Skip already marked as EXACT
    const letter = currentRow[i];

    if (wordToBeGuessed.includes(letter) && letterOccurrences[letter] > 0) {
      tempKeyState[ALMOST].push(letter);
      letterOccurrences[letter]--;
      return ALMOST;
    }

    tempKeyState[MISS].push(letter);
    return MISS;
  });

  const isGameOver = tempTileState[currRowIndex].every(
    (_state) => _state === EXACT,
  );
  return {
    tileState: tempTileState,
    keyState: tempKeyState,
    isGameOver,
  };
}

export function getKeyBgClr(keyState, letter) {
  if (keyState[EXACT].includes(letter)) {
    return TILE_COLOR[EXACT];
  }

  if (keyState[ALMOST].includes(letter)) {
    return TILE_COLOR[ALMOST];
  }

  if (keyState[MISS].includes(letter)) {
    return TILE_COLOR[MISS];
  }
}
export function calculateFinalStats(tileState, guessDistribution) {
  return tileState.map((row, index) => {
    const isCorrectGuess = row.every(letterState => letterState === EXACT);
    if (isCorrectGuess) {
      return guessDistribution[index] + 1;
    }
    return guessDistribution[index];
  });
}
