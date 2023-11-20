import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FindRandomWordDto } from 'src/word/dto/find-random-word.dto';
import { FindWordDto } from 'src/word/dto/find-word.dto';
import { WordService } from 'src/word/word.service';
import { RoomDataService } from './data/room-data.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomMessageDto } from './dto/join-room-message.dto';
import { NewWordMessageDto } from './dto/new-word-message.dto';
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
import { RoomHelper } from './helpers/room.helper';
import { SequenceHelper } from './helpers/sequence.helper';
import { Player } from './models/player.model';
import { RoomState } from './models/room-state.enum';
import { Room } from './models/room.model';

@Injectable()
export class RoomService {
  constructor(
    private readonly service: RoomDataService,
    private readonly wordService: WordService,
    private readonly roomHelper: RoomHelper,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    return this.service.create(dto);
  }

  async joinToRoom(dto: JoinRoomMessageDto): Promise<Room | null> {
    if (!Types.ObjectId.isValid(dto.roomId)) {
      throw new RoomNotFoundException(dto.roomId);
    }

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

    if (!this.roomHelper.isCurrentPlayer(room, dto.playerName)) {
      throw new NotCurrentPlayerTurnException();
    }

    if (!this.sequenceHelper.isValidLetter(dto.letter)) {
      throw new InvalidLetterException();
    }

    if (!this.sequenceHelper.isPositionInField(room, dto.letter.position)) {
      throw new PositionNotFoundException(dto.letter.position);
    }

    if (!this.sequenceHelper.isPositionEmpty(room, dto.letter.position)) {
      throw new PositionFilledException();
    }

    if (
      !this.sequenceHelper.isSequenceValid(room.letterSequenceRules, dto.word)
    ) {
      throw new InvalidWordSequenceException();
    }

    if (
      !this.sequenceHelper.isPositionInSequence(dto.letter.position, dto.word)
    ) {
      throw new NoLetterInSequenceException();
    }

    room = this.roomHelper.applyLetter(room, dto.letter);

    if (!this.sequenceHelper.isSequenceFilled(room, dto.word)) {
      throw new UnfilledWordSequenceException();
    }

    const word = this.roomHelper.getFilledWord(room, dto);

    if (this.roomHelper.isWordAlreadyUsed(room, word)) {
      throw new WordAlreadyUsedException();
    }

    if (!(await this.isWordInDictionary(word))) {
      throw new WordNotFoundException(word);
    }

    room = this.roomHelper.addCurrentPlayerWord(room, word);
    room = this.roomHelper.passMoveToNextPlayer(room);

    if (this.roomHelper.isMatrixFilled(room)) {
      room = this.roomHelper.endGame(room);
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

    room = this.roomHelper.applyStartWord(room, startWord);
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
}
