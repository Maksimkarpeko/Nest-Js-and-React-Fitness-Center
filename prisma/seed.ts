import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  GlobalStatus,
  HallStatus,
  VisitingStatus,
  UserRole,
} from '../src/generated/prisma/index.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Очистка базы данных...');

  await prisma.visiting.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.review.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.userGroup.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.group.deleteMany();
  await prisma.workout_type.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.tariff.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Создание тестовых данных...');

  await prisma.user.create({
    data: {
      firstName: 'Алексей',
      secondName: 'Админов',
      email: 'admin@fitclub.by',
      login: 'admin',
      password: '$2a$10$hashedpassword1',
      phone: '+375291234567',
      birthDate: new Date('1990-01-01'),
      gender: 'male',
      role: UserRole.ADMIN,
      status: GlobalStatus.ACTIVE,
    },
  });

  const trainerUser1 = await prisma.user.create({
    data: {
      firstName: 'Иван',
      secondName: 'Тренеров',
      email: 'trainer1@fitclub.by',
      login: 'trainer1',
      password: '$2a$10$hashedpassword2',
      phone: '+375299876543',
      birthDate: new Date('1988-05-15'),
      gender: 'male',
      role: UserRole.TRAINER,
      status: GlobalStatus.ACTIVE,
    },
  });

  const client1 = await prisma.user.create({
    data: {
      firstName: 'Мария',
      secondName: 'Иванова',
      email: 'maria@mail.ru',
      login: 'masha95',
      password: '$2a$10$hashedpassword3',
      phone: '+375336549870',
      birthDate: new Date('1995-08-20'),
      gender: 'female',
      role: UserRole.USER,
      status: GlobalStatus.ACTIVE,
    },
  });

  const trainerProfile1 = await prisma.trainerProfile.create({
    data: {
      userId: trainerUser1.userId,
      specialization: 'Силовой тренинг, Кроссфит',
      experienceYears: 5.5,
      countWorkday: 5,
      status: GlobalStatus.ACTIVE,
    },
  });

  const hallGroup = await prisma.hall.create({
    data: {
      name: 'Зал №2 (Групповой)',
      hallType: 'Аэробика / Йога',
      status: HallStatus.ACTIVE,
    },
  });

  const workoutTypeCrossFit = await prisma.workout_type.create({
    data: {
      name: 'Кроссфит группа',
      description: 'Высокоинтенсивная групповая функциональная тренировка',
    },
  });

  const groupPro = await prisma.group.create({
    data: {
      name: 'Продвинутая группа Кроссфит',
      description: 'Группа для спортсменов со стажем от 1 года',
    },
  });

  await prisma.userGroup.create({
    data: {
      userId: client1.userId,
      groupId: groupPro.groupId,
    },
  });

  const tariffStandard = await prisma.tariff.create({
    data: {
      name: 'Стандарт 12 занятий',
      price: 150.0, // В BYN
    },
  });

  await prisma.subscription.create({
    data: {
      tariffId: tariffStandard.tariffId,
      userId: client1.userId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      countVisit: 12,
      status: GlobalStatus.ACTIVE,
    },
  });

  const workout1 = await prisma.workout.create({
    data: {
      trainerId: trainerProfile1.trainerProfileId,
      hallId: hallGroup.hallId,
      workoutTypeId: workoutTypeCrossFit.workoutTypeId,
      groupId: groupPro.groupId,
      maxCountPerson: 10,
      durationTime: 60,
      isGroup: true,
      status: GlobalStatus.ACTIVE,
    },
  });

  await prisma.schedule.create({
    data: {
      workoutId: workout1.workoutId,
      startTime: new Date('2026-09-01T10:00:00Z'),
      endTime: new Date('2026-09-01T11:00:00Z'),
      type: 'Групповая',
      repetitionRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
    },
  });

  await prisma.visiting.create({
    data: {
      workoutId: workout1.workoutId,
      userId: client1.userId,
      date: new Date('2026-09-01T10:00:00Z'),
      status: VisitingStatus.VISITED,
    },
  });

  await prisma.review.create({
    data: {
      userId: client1.userId,
      text: 'Отличный зал в Минске и очень грамотный тренер Иван!',
      rating: 5.0,
    },
  });

  console.log('Сидинг успешно завершен!');
}

main()
  .catch((e) => {
    console.error('Ошибка сидинга:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
