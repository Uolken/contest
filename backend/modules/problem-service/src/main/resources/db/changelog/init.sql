CREATE TABLE work
(
    id        bigserial    NOT NULL,
    name      varchar(255) NOT NULL,
    type      varchar(64)  NOT NULL,
    start     timestamp,
    "end"     timestamp,
    author_id bigint,

    PRIMARY KEY (id)
);

CREATE TABLE tag
(
    id   bigserial    NOT NULL,
    name varchar(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE problem
(
    id         bigserial    NOT NULL,
    name       varchar(255) NOT NULL,
    text       text         NOT NULL,
    author_id  bigint       NOT NULL,
    examples   jsonb        NOT NULL,
    in_library bool         NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE problem_tag
(
    problem_id bigint NOT NULL,
    tag_id     bigint NOT NULL,

    FOREIGN KEY (problem_id) REFERENCES problem (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
);

CREATE TABLE work_problem
(
    work_id    bigint NOT NULL,
    problem_id bigint NOT NULL,

    FOREIGN KEY (work_id) REFERENCES work (id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problem (id) ON DELETE CASCADE
);

CREATE TABLE test_case
(
    id         bigserial NOT NULL,
    problem_id bigint    NOT NULL,
    input      text      NOT NULL,
    outputs    text[]    NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (problem_id) REFERENCES problem (id) ON DELETE CASCADE
);

CREATE TABLE work_group_assignment
(
    work_id  bigint NOT NULL,
    group_id bigint NOT NULL,
    type      varchar(64)  NOT NULL,
    start     timestamp,
    "end"     timestamp,

    FOREIGN KEY (work_id) REFERENCES work (id) ON DELETE CASCADE
)
