ALTER TABLE "seeds" ALTER COLUMN "origen" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "seeds" ALTER COLUMN "lote" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "seeds" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "seeds" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "seeds" ADD COLUMN "closed_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_lote" ON "seeds" USING btree ("lote") WHERE "seeds"."is_active" = true;