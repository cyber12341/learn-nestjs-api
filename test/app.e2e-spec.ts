// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')w
//       .expect(200)
//       .expect('Hello World!');
//   });
// });a
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('App e2e', () => {
  jest.setTimeout(3000000);
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe
      ({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    
    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(async () => { 
    await app.close();
  });
  it.todo('should pass');
  describe('Auth', () => {
    describe("Signup", () => {
      it('Should create a new user',() => {
        const dto: AuthDto = {
          email: "redphantom2010@gmail.com",
          password: "123456",
        }
        return pactum.spec().post('http://localhost:3333/auth/signup', ).withBody(dto).expectStatus(201);
      });
    });
    describe("Signin", () => {
      it.todo('Should sign in a user');
    });
  });

  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {  })
    describe('Get bookmarks', () => {  })
    describe('Get bookmark by id', () => {  })
    describe('Edit bookmark', () => {  })
    describe('Delete bookmark', () => {  })
  });
});