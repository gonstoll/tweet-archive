CREATE TABLE `tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`color` text NOT NULL,
	`user_id` text(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tweet` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text,
	`url` text(2083) NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tweet_tag` (
	`tweet_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`tweet_id`) REFERENCES `tweet`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
