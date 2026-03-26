CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_customers_name" ON "customers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_customers_created_by" ON "customers" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_customers_is_active" ON "customers" USING btree ("is_active");