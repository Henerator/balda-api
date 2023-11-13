import { Injectable } from '@nestjs/common';
import { FindRandomWordDto } from 'src/word/dto/find-random-word.dto';
import { FindWordDto } from 'src/word/dto/find-word.dto';
import { WordService } from 'src/word/word.service';
import { RoomDataService } from './data/room-data.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomMessageDto } from './dto/join-room-message.dto';
import { LetterDto } from './dto/letter.dto';
import { NewWordMessageDto } from './dto/new-word-message.dto';
import { PositionDto } from './dto/position.dto';
import { InvalidLetterException } from './exceptions/invalid-letter.exception';
import { InvalidWordSequenceException } from './exceptions/invalid-word-sequence.exception';
import { NoLetterInSequenceException } from './exceptions/no-letter-in-sequence.exception';
import { NotCurrentPlayerTurnException } from './exceptions/not-current-player-turn.exception';
import { PositionFilledException } from './exceptions/position-filled.exception';
import { PositionNotFoundException } from './exceptions/position-not-found.exception';
import { RoomFullException } from './exceptions/room-full.exception';
import { RoomNotFoundException } from './exceptions/room-not-found.exception';
import { UnfilledWordSequenceException } from './exceptions/unfilled-word-sequence.exception';
import { WordAlreadyUsedException } from './exceptions/word-already-used.exception';
import { WordNotFoundException } from './exceptions/word-not-found.exception';
import { LetterSequenceRule } from './models/letter-sequence-rule.enum';
import { Player } from './models/player.model';
import { RoomState } from './models/room-state.enum';
import { Room } from './models/room.model';
import { SequenceValidator } from './sequence-validators/sequence-validator.type';
import { sequenceValidatorsMap } from './sequence-validators/sequence-validators.map';

@Injectable()
export class RoomService {
  constructor(
    private readonly service: RoomDataService,
    private readonly wordService: WordService,
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    return this.service.create(dto);
  }

  async joinToRoom(dto: JoinRoomMessageDto): Promise<Room | null> {
    let room = await this.service.findById(dto.roomId);

    if (!room) {
      throw new RoomNotFoundException(dto.roomId);
    }

    const playerInRoom = room.players.find(
      (player) => player.name === dto.playerName,
    );

    if (playerInRoom) {
      return room;
    }

    if (room.players.length === room.capacity) {
      throw new RoomFullException();
    }

    room.players.push(this.createPlayer(dto.playerName));

    if (room.players.length === room.capacity) {
      room = await this.prepareRoomForGame(room);
    }

    return this.service.update(room);
  }

  async addNewWord(dto: NewWordMessageDto): Promise<Room | null> {
    let room = await this.service.findById(dto.roomId);

    if (!room) {
      throw new RoomNotFoundException(dto.roomId);
    }

    if (!this.isCurrentPlayer(room, dto.playerName)) {
      throw new NotCurrentPlayerTurnException();
    }

    if (!this.isValidLetter(dto.letter)) {
      throw new InvalidLetterException();
    }

    if (!this.isPositionInField(room, dto.letter.position)) {
      throw new PositionNotFoundException(dto.letter.position);
    }

    if (!this.isPositionEmpty(room, dto.letter.position)) {
      throw new PositionFilledException();
    }

    if (!this.isSequenceValid(room.letterSequenceRules, dto.word)) {
      throw new InvalidWordSequenceException();
    }

    if (!this.isPositionInSequence(dto.letter.position, dto.word)) {
      throw new NoLetterInSequenceException();
    }

    room = this.applyLetter(room, dto.letter);

    if (!this.isSequenceFilled(room, dto.word)) {
      throw new UnfilledWordSequenceException();
    }

    const word = this.getFilledWord(room, dto);

    if (this.isWordAlreadyUsed(room, word)) {
      throw new WordAlreadyUsedException();
    }

    if (!(await this.isWordInDictionary(word))) {
      throw new WordNotFoundException(word);
    }

    room = this.addCurrentPlayerWord(room, word);
    room = this.passMoveToNextPlayer(room);

    if (this.isMatrixFilled(room)) {
      room = this.endGame(room);
    }

    return this.service.update(room);
  }

  async deleteOlderThan(date: Date): Promise<mongodb.DeleteResult> {
    return this.service.deleteOlderThan(date);
  }

  private createPlayer(name: string): Player {
    const player = new Player();
    player.name = name;
    player.score = 0;
    player.words = [];
    return player;
  }

  private async prepareRoomForGame(room: Room): Promise<Room> {
    const startWord = await this.getRandomWord(room.size);

    room = this.applyStartWord(room, startWord);
    room.state = RoomState.game;
    room.currentPlayerName = room.players[0].name;

    return room;
  }

  private async getRandomWord(length: number): Promise<string> {
    const findRandomWordDto = new FindRandomWordDto(length);
    const word = await this.wordService.findRandom(findRandomWordDto);
    return word.value;
  }

  private async isWordInDictionary(word: string): Promise<boolean> {
    const findWordDto = new FindWordDto(word);
    return Boolean(await this.wordService.find(findWordDto));
  }

  private isCurrentPlayer(room: Room, name: string): boolean {
    return room.currentPlayerName === name;
  }

  private isValidLetter(letter: LetterDto): boolean {
    return letter.char.length === 1;
  }

  private isPositionInField(room: Room, position: PositionDto): boolean {
    const fieldSize = room.matrix.length;

    return (
      position.x >= 0 &&
      position.x < fieldSize &&
      position.y >= 0 &&
      position.y < fieldSize
    );
  }

  private isPositionEmpty(room: Room, position: PositionDto): boolean {
    return !room.matrix[position.y][position.x];
  }

  private isSequenceValid(
    roomRules: LetterSequenceRule[],
    positions: PositionDto[],
  ): boolean {
    const validators = this.getSequenceValidators(roomRules);

    for (let i = 1; i < positions.length; i++) {
      const previous = positions[i - 1];
      const current = positions[i];

      const isCurrentValid = validators.some((validator) =>
        validator(previous, current),
      );

      if (!isCurrentValid) return false;
    }

    return true;
  }

  private isPositionInSequence(
    position: PositionDto,
    positions: PositionDto[],
  ): boolean {
    return positions.some(
      (searchPosition) =>
        searchPosition.x === position.x && searchPosition.y === position.y,
    );
  }

  private isSequenceFilled(room: Room, positions: PositionDto[]): boolean {
    return positions.every((position) => !this.isPositionEmpty(room, position));
  }

  private isWordAlreadyUsed(room: Room, word: string): boolean {
    const usedWords = [
      ...room.players.map((player) => player.words).flat(),
      room.initialWord,
    ];
    return usedWords.some((usedWord) => usedWord === word);
  }

  private isMatrixFilled(room: Room): boolean {
    for (let row = 0; row < room.size; row++) {
      for (let col = 0; col < room.size; col++) {
        if (!room.matrix[row][col]) return false;
      }
    }

    return true;
  }

  private applyLetter(room: Room, letter: LetterDto): Room {
    room.matrix[letter.position.y][letter.position.x] = letter.char;
    return room;
  }

  private applyStartWord(room: Room, word: string): Room {
    const y = Math.floor((room.size - 1) / 2);
    word.split('').forEach((char, x) => (room.matrix[y][x] = char));
    room.initialWord = word;
    return room;
  }

  private getFilledWord(room: Room, dto: NewWordMessageDto): string {
    return dto.word
      .map((position) => room.matrix[position.y][position.x])
      .join('');
  }

  private getSequenceValidators(
    roomRules: LetterSequenceRule[],
  ): SequenceValidator[] {
    return [
      LetterSequenceRule.horizontal,
      LetterSequenceRule.vertical,
      ...roomRules,
    ].map((rule) => sequenceValidatorsMap[rule]);
  }

  private addCurrentPlayerWord(room: Room, word: string): Room {
    const curentPlayerIndex = this.getCurrentPlayerIndex(room);
    room.players[curentPlayerIndex].words.push(word);
    room.players[curentPlayerIndex].score += word.length;
    return room;
  }

  private passMoveToNextPlayer(room: Room): Room {
    const curentPlayerIndex = this.getCurrentPlayerIndex(room);
    const nextPlayerIndex = (curentPlayerIndex + 1) % room.capacity;
    room.currentPlayerName = room.players[nextPlayerIndex].name;
    return room;
  }

  private getCurrentPlayerIndex(room: Room): number {
    return room.players.findIndex(
      (player) => player.name === room.currentPlayerName,
    );
  }

  private endGame(room: Room): Room {
    room.state = RoomState.gameEnd;
    return room;
  }
}
