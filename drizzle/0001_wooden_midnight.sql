CREATE TABLE IF NOT EXISTS "subscriptions" (
	"user_id" text PRIMARY KEY NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"status" text DEFAULT 'inactive' NOT NULL,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "groups_user_idx" ON "groups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "practice_items_session_idx" ON "practice_items" USING btree ("practice_session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "practice_items_vocab_idx" ON "practice_items" USING btree ("vocabulary_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "practice_sessions_user_date_idx" ON "practice_sessions" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "practice_sessions_user_date_group_uidx" ON "practice_sessions" USING btree ("user_id","date","group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_stats_user_idx" ON "user_stats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vocab_user_idx" ON "vocabulary_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vocab_groups_group_idx" ON "vocabulary_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vocab_groups_vocab_idx" ON "vocabulary_groups" USING btree ("vocabulary_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "review_stats_vocab_idx" ON "vocabulary_review_stats" USING btree ("vocabulary_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "review_stats_next_review_idx" ON "vocabulary_review_stats" USING btree ("next_review_at");
