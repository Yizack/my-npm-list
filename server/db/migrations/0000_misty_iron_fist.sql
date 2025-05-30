CREATE TABLE `lists` (
	`id` integer PRIMARY KEY NOT NULL,
	`gh_id` integer NOT NULL,
	`package_id` integer NOT NULL,
	`versions` text NOT NULL,
	`count` integer NOT NULL,
	FOREIGN KEY (`gh_id`) REFERENCES `users`(`gh_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gh_id_package_id_unique_index` ON `lists` (`gh_id`,`package_id`);--> statement-breakpoint
CREATE INDEX `gh_count_index` ON `lists` (`gh_id`,"count" desc);--> statement-breakpoint
CREATE INDEX `package_id_index` ON `lists` (`package_id`);--> statement-breakpoint
CREATE TABLE `packages` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`added` integer NOT NULL,
	`last_fetch` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `package_name_index` ON `packages` (`name`);--> statement-breakpoint
CREATE TABLE `users` (
	`gh_id` integer PRIMARY KEY NOT NULL,
	`gh_user` text NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`website` text,
	`country` text,
	`joined` integer,
	`list_updated` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gh_user_index` ON `users` (`gh_user`);