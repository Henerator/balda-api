import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomMessageDto } from './dto/join-room-message.dto';
import { NewWordMessageDto } from './dto/new-word-message.dto';
import { RoomMessage } from './dto/room-message.enum';
import { RoomException } from './exceptions/room.exception';
import { UnknownRoomException } from './exceptions/unknown-room.exception';
import { Room } from './models/room.model';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: 'http://localhost:4200', // TODO: add environment path for client
  },
})
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server = new Server();

  private logger = new Logger('RoomGateway');

  constructor(private readonly service: RoomService) {}

  @SubscribeMessage(RoomMessage.join)
  async handleJoinMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: JoinRoomMessageDto,
  ): Promise<void> {
    this.logger.log('Join message from client: ', message);

    let room: Room;
    try {
      room = await this.service.joinToRoom(message);
    } catch (error) {
      const roomError = this.validateError(error);
      socket.emit(RoomMessage.error, roomError);
      return;
    }

    const roomId = String(room._id);
    socket.join(roomId);
    this.server.to(roomId).emit(RoomMessage.room, room);
  }

  @SubscribeMessage(RoomMessage.newWord)
  async handleNewWordMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: NewWordMessageDto,
  ): Promise<void> {
    this.logger.log('New word message from client: ', message);

    let room: Room;
    try {
      room = await this.service.addNewWord(message);
    } catch (error: unknown) {
      const roomError = this.validateError(error);
      socket.emit(RoomMessage.error, roomError);
      return;
    }

    const roomId = String(room._id);
    this.server.to(roomId).emit(RoomMessage.room, room);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log('Disconnected', socket.id);
  }

  private validateError(error: unknown): RoomException {
    return error instanceof RoomException ? error : new UnknownRoomException();
  }
}
