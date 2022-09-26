CREATE TABLE if not exists public.myuser (
	id varchar(36) NOT NULL,
	username varchar NULL,
	"password" varchar NULL,
	last_updated timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT user_pk PRIMARY KEY (id)
);

CREATE INDEX if not exists user_username_idx ON public.myuser USING btree (username);