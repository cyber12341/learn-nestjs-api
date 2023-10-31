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
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => { 
    await app.close();
  });
  const dto: AuthDto = {
    email: "redphantom2010@gmail.com",
    password: "123456",
  }
  describe('Auth', () => {
    describe("Signup", () => {
      it('Should fail if email empty',() => {
        return pactum.spec().post('/auth/signup', ).withBody({password: dto.password}).expectStatus(400).inspect();
      });

      it('Should fail if password empty',() => {
        return pactum.spec().post('/auth/signup', ).withBody({email: dto.email}).expectStatus(400).inspect();
      });

      it('Should fail if no body',() => {
        return pactum.spec().post('/auth/signup', ).expectStatus(400).inspect();
      });

      it('Should create a new user',() => {
        return pactum.spec().post('/auth/signup', ).withBody(dto).expectStatus(201).inspect();
      });
    });
    describe("Signin", () => {
      it('Should fail if email empty',() => {
        return pactum.spec().post('/auth/signin', ).withBody({password: dto.password}).expectStatus(400).inspect();
      });

      it('Should fail if password empty',() => {
        return pactum.spec().post('/auth/signin', ).withBody({email: dto.email}).expectStatus(400).inspect();
      });

      it('Should fail if no body',() => {
        return pactum.spec().post('/auth/signin', ).expectStatus(400).inspect();
      });

      it('Should signin a user',() => {
        return pactum.spec().post('/auth/signin', ).withBody(dto).expectStatus(200).inspect();
      });
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