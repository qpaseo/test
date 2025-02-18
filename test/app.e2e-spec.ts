//테스트에 사용되는 에플리케이션은 main과 다른 에플리케이션임

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { title } from 'process';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // beforeEach : 테스트마다 새로운 에플리케이션 생성
    //beforeAll : 모든 테스트 실행시 하나의 에플리케이션 생성
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //테스트에서도 따로 설정 필요
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        if (!res.text.includes('Welcome to my Movie API')) {
          throw new Error('응답에 기대 메시지가 포함되어 있지 않습니다.');
        }
      });
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'Test', year: 2000, genres: ['test'] })
        .expect(201);
    });

    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'Test', year: 2000, genres: ['test'], other: 'then' })
        .expect(400);
    });

    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/9').expect(404);
    });
    it('PATCH', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'updated Test' })
        .expect(200);
    });
    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
