import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { ok: true, service: 'CREOVA API', version: '1.0.0', time: new Date().toISOString() };
  }
}
