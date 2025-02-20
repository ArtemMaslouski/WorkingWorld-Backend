import { 
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_CREATED,
    HTTP_STATUS_OK, 
    HTTP_STATUS_SERVER_ERROR
 } from '../../constants/http-status.constants';

 export const SwaggerResponses = {
    created: { status: HTTP_STATUS_CREATED, description: 'Выполнено успешно'},
    ok: { status: HTTP_STATUS_OK, description: 'Выполнено успешно'},
    badRequest: { status: HTTP_STATUS_BAD_REQUEST, description: 'Некорректные данные'},
    serverError: { status: HTTP_STATUS_SERVER_ERROR, description: 'Ошибка сервера'}
 }