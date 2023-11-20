import { Injectable } from '@nestjs/common';
import { LetterDto } from '../dto/letter.dto';
import { NewWordMessageDto } from '../dto/new-word-message.dto';
import { RoomState } from '../models/room-state.enum';
import { Room } from '../models/room.model';

@Injectable()
export class RoomHelper {
  public isCurrentPlayer(room: Room, name: string): boolean {
    return room.currentPlayerName === name;
  }

  public isWordAlreadyUsed(room: Room, word: string): boolean {
    const usedWords = [
      ...room.players.map((player) => player.words).flat(),
      room.initialWord,
    ];
    return usedWords.some((usedWord) => usedWord === word);
  }

  public isMatrixFilled(room: Room): boolean {
    for (let row = 0; row < room.size; row++) {
      for (let col = 0; col < room.size; col++) {
        if (!room.matrix[row][col]) return false;
      }
    }

    return true;
  }

  public applyLetter(room: Room, letter: LetterDto): Room {
    room.matrix[letter.position.y][letter.position.x] = letter.char;
    return room;
  }

  public applyStartWord(room: Room, word: string): Room {
    const y = Math.floor((room.size - 1) / 2);
    word.split('').forEach((char, x) => (room.matrix[y][x] = char));
    room.initialWord = word;
    return room;
  }

  public getFilledWord(room: Room, dto: NewWordMessageDto): string {
    return dto.word
      .map((position) => room.matrix[position.y][position.x])
      .join('');
  }

  public addCurrentPlayerWord(room: Room, word: string): Room {
    const curentPlayerIndex = this.getCurrentPlayerIndex(room);
    room.players[curentPlayerIndex].words.push(word);
    room.players[curentPlayerIndex].score += word.length;
    return room;
  }

  public passMoveToNextPlayer(room: Room): Room {
    const curentPlayerIndex = this.getCurrentPlayerIndex(room);
    const nextPlayerIndex = (curentPlayerIndex + 1) % room.capacity;
    room.currentPlayerName = room.players[nextPlayerIndex].name;
    return room;
  }

  public endGame(room: Room): Room {
    room.state = RoomState.gameEnd;
    return room;
  }

  private getCurrentPlayerIndex(room: Room): number {
    return room.players.findIndex(
      (player) => player.name === room.currentPlayerName,
    );
  }
}
