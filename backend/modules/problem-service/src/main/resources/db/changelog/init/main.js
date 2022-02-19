{
  "databaseChangeLog": [
    {
      "changeSet": {
        "id": "init",
        "author": "maksim_palashevskiy",
        "changes": [
          {
            "createTable": {
              "tableName": "problem",
              "columns": [
                {
                  "column": {
                    "name": "id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "primaryKey": true
                    }
                  }
                },
                {
                  "column": {
                    "name": "author_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "name",
                    "type": "varchar(255)",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "text",
                    "type": "text",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "examples",
                    "type": "jsonb",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "in_library",
                    "type": "boolean",
                    "defaultValueBoolean": false,
                    "constraints": {
                      "nullable": false
                    }
                  }
                }
              ]
            }
          },
          {
            "createTable": {
              "tableName": "tag",
              "columns": [
                {
                  "column": {
                    "name": "id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "primaryKey": true
                    }
                  }
                },
                {
                  "column": {
                    "name": "name",
                    "type": "varchar(255)",
                    "constraints": {
                      "nullable": false,
                      "unique": true
                    }
                  }
                }
              ]
            }
          },
          {
            "createTable": {
              "tableName": "problem_tag",
              "columns": [
                {
                  "column": {
                    "name": "problem_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "foreignKeyName": "fg_problem_id",
                      "referencedTableName": "problem",
                      "referencedColumnNames": "id"
                    }
                  }
                },
                {
                  "column": {
                    "name": "tag_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "foreignKeyName": "fg_tag_id",
                      "referencedTableName": "tag",
                      "referencedColumnNames": "id"
                    }
                  }
                }
              ]
            }
          },
          {
            "createTable": {
              "tableName": "work",
              "columns": [
                {
                  "column": {
                    "name": "id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "primaryKey": true
                    }
                  }
                },
                {
                  "column": {
                    "name": "author_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "name",
                    "type": "varchar(255)",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "start",
                    "type": "timestamp",
                    "constraints": {
                      "nullable": true
                    }
                  }
                },
                {
                  "column": {
                    "name": "end",
                    "type": "timestamp",
                    "constraints": {
                      "nullable": true
                    }
                  }
                },
                {
                  "column": {
                    "name": "type",
                    "type": "varchar(64)",
                    "constraints": {
                      "nullable": false
                    }
                  }
                }
              ]
            }
          },
          {
            "createTable": {
              "tableName": "work_problem",
              "columns": [
                {
                  "column": {
                    "name": "work_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "foreignKeyName": "fg_work_id",
                      "referencedTableName": "work",
                      "referencedColumnNames": "id"
                    }
                  }
                },
                {
                  "column": {
                    "name": "problem_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "foreignKeyName": "fg_problem_id",
                      "referencedTableName": "problem",
                      "referencedColumnNames": "id"
                    }
                  }
                }
              ]
            }
          },
          {
            "createTable": {
              "tableName": "test_case",
              "columns": [
                {
                  "column": {
                    "name": "id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "primaryKey": true
                    }
                  }
                },
                {
                  "column": {
                    "name": "problem_id",
                    "type": "bigint",
                    "constraints": {
                      "nullable": false,
                      "foreignKeyName": "fg_problem_id",
                      "referencedTableName": "problem",
                      "referencedColumnNames": "id"
                    }
                  }
                },
                {
                  "column": {
                    "name": "input",
                    "type": "text",
                    "constraints": {
                      "nullable": false
                    }
                  }
                },
                {
                  "column": {
                    "name": "outputs",
                    "type": "text[]",
                    "constraints": {
                      "nullable": false
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}





