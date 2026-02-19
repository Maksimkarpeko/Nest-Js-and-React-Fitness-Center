-- CreateTable
CREATE TABLE "Group" (
    "group_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "Hall" (
    "hall_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hall_type" TEXT NOT NULL,
    "status" "HallStatus" NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("hall_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "user_user_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "schedule_id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "repetition_rule" TEXT NOT NULL,
    "workout_id" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "subscription_id" SERIAL NOT NULL,
    "start_data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_data" TIMESTAMP(3) NOT NULL,
    "count_visit" INTEGER NOT NULL,
    "status" "GlobalStatus" NOT NULL,
    "tariff_id" INTEGER NOT NULL,
    "user_user_id" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateTable
CREATE TABLE "Tariff" (
    "tariff_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Tariff_pkey" PRIMARY KEY ("tariff_id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "trainer_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience_years" DOUBLE PRECISION NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "count_work_day" INTEGER NOT NULL,
    "status" "GlobalStatus" NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("trainer_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "GlobalStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visiting" (
    "visiting_id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "VisitingStatus" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "workout_id" INTEGER NOT NULL,

    CONSTRAINT "Visiting_pkey" PRIMARY KEY ("visiting_id")
);

-- CreateTable
CREATE TABLE "workout" (
    "workout_id" SERIAL NOT NULL,
    "max_count_person" INTEGER NOT NULL,
    "duration_time" INTEGER NOT NULL,
    "is_group" BOOLEAN NOT NULL,
    "status" "GlobalStatus" NOT NULL,
    "group_id" INTEGER,
    "workout_type_id" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "trainer_id" INTEGER NOT NULL,

    CONSTRAINT "workout_pkey" PRIMARY KEY ("workout_id")
);

-- CreateTable
CREATE TABLE "Workout_type" (
    "workout_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Workout_type_pkey" PRIMARY KEY ("workout_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_phone_key" ON "Trainer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_email_key" ON "Trainer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_user_id_fkey" FOREIGN KEY ("user_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("workout_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "Tariff"("tariff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_user_id_fkey" FOREIGN KEY ("user_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visiting" ADD CONSTRAINT "Visiting_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("workout_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visiting" ADD CONSTRAINT "Visiting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "Trainer"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "Hall"("hall_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_workout_type_id_fkey" FOREIGN KEY ("workout_type_id") REFERENCES "Workout_type"("workout_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;
