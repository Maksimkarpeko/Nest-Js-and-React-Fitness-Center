-- CreateEnum
CREATE TYPE "GlobalStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "HallStatus" AS ENUM ('ACTIVE', 'BUSY');

-- CreateEnum
CREATE TYPE "VisitingStatus" AS ENUM ('VISITED', 'NOT_VISITED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TRAINER', 'USER');

-- CreateTable
CREATE TABLE "group" (
    "group_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "hall" (
    "hall_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hall_type" TEXT NOT NULL,
    "status" "HallStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "hall_pkey" PRIMARY KEY ("hall_id")
);

-- CreateTable
CREATE TABLE "review" (
    "review_id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "schedule_id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "repetition_rule" TEXT NOT NULL,
    "workout_id" INTEGER NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "subscription_id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "count_visit" INTEGER NOT NULL,
    "status" "GlobalStatus" NOT NULL DEFAULT 'ACTIVE',
    "tariff_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateTable
CREATE TABLE "tariff" (
    "tariff_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "tariff_pkey" PRIMARY KEY ("tariff_id")
);

-- CreateTable
CREATE TABLE "trainer_profile" (
    "trainer_profile_id" SERIAL NOT NULL,
    "specialization" TEXT,
    "experience_years" DOUBLE PRECISION,
    "count_work_day" INTEGER,
    "status" "GlobalStatus" DEFAULT 'ACTIVE',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "trainer_profile_pkey" PRIMARY KEY ("trainer_profile_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "GlobalStatus" DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_group" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "user_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visiting" (
    "visiting_id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "VisitingStatus" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "workout_id" INTEGER NOT NULL,

    CONSTRAINT "visiting_pkey" PRIMARY KEY ("visiting_id")
);

-- CreateTable
CREATE TABLE "workout" (
    "workout_id" SERIAL NOT NULL,
    "max_count_person" INTEGER NOT NULL,
    "duration_time" INTEGER NOT NULL,
    "is_group" BOOLEAN NOT NULL,
    "status" "GlobalStatus" NOT NULL DEFAULT 'ACTIVE',
    "group_id" INTEGER,
    "workout_type_id" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "trainer_id" INTEGER NOT NULL,

    CONSTRAINT "workout_pkey" PRIMARY KEY ("workout_id")
);

-- CreateTable
CREATE TABLE "workout_type" (
    "workout_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "workout_type_pkey" PRIMARY KEY ("workout_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainer_profile_user_id_key" ON "trainer_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "user_group_user_id_group_id_key" ON "user_group"("user_id", "group_id");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("workout_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "tariff"("tariff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_profile" ADD CONSTRAINT "trainer_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group" ADD CONSTRAINT "user_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group" ADD CONSTRAINT "user_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visiting" ADD CONSTRAINT "visiting_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("workout_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visiting" ADD CONSTRAINT "visiting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profile"("trainer_profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "hall"("hall_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_workout_type_id_fkey" FOREIGN KEY ("workout_type_id") REFERENCES "workout_type"("workout_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;
