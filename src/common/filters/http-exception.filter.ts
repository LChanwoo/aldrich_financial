import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost,) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const error = exception.getResponse();
      // logger.error(`[${request.ip}] ${request.method} ${request.url} ${status} ${JSON.stringify(error)}`);
      if(status===401||status===403){
        response.redirect('/login')
      }
      response.status(status).json({
        statusCode: status,
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    }
  }