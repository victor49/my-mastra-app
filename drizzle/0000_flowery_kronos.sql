CREATE TABLE "seeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"peso_kg" integer NOT NULL,
	"origen" text NOT NULL,
	"lote" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
