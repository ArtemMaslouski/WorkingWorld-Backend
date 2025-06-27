import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit {
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: string) {
    console.log(message)
  }

  handleConnection() {
    console.log('Подключились к чату')
  }

  handleDisconnect() {
    console.log('Отключились от чата')
  }

  afterInit(server: any) {
    console.log('Инициализация чата')
  }
}