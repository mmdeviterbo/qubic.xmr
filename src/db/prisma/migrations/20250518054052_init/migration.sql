-- CreateTable
CREATE TABLE "MiningStats" (
    "id" SERIAL NOT NULL,
    "highest_pool_hashrate" INTEGER NOT NULL,

    CONSTRAINT "MiningStats_pkey" PRIMARY KEY ("id")
);
