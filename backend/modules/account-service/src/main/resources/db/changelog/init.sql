CREATE TABLE groups
(
    id             bigserial   NOT NULL,
    name           varchar(64) NOT NULL,
    admission_year int         NOT NULL,

    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_groups_name ON groups (name);

CREATE TABLE users
(
    id         bigserial    NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name  varchar(255) NOT NULL,
    email      varchar(255) NOT NULL,
    role       varchar(64)  NOT NULL,
    password   varchar(64)  NOT NULL,
    group_id   bigint,

    FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_users_email ON users (email);
