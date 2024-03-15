package adapter

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/indeedhat/db-vue/internal/database"
	_ "github.com/lib/pq"
)

const (
	PostgresRpcTruncate        = "Truncate Table"
	PostgresRpcTruncateCascade = "Truncate Table (Cascade)"
	PostgresRpcDrop            = "Drop Table"
)

type PostgresAdapter struct {
	db     *sql.DB
	dbName string
	ctx    context.Context
}

// NewPostgresAdapter sets up a new connection to the mysql database
func NewPostgresAdapter(ctx context.Context, details database.ConnectionDetails) (*PostgresAdapter, error) {
	db, err := sql.Open("postgres", fmt.Sprintf("host=%s port=%d user=%s password=%s sslmode=disable",
		details.Host,
		details.Port,
		details.User,
		details.Pass,
	))
	if err != nil {
		return nil, err
	}

	return &PostgresAdapter{db: db, ctx: ctx}, nil
}

// RunTableCommand implements database.Adapter.
func (a *PostgresAdapter) RunTableCommand(table, command string) error {
	switch command {
	case PostgresRpcTruncate:
		return a.exec(fmt.Sprintf("TRUNCATE `%s`", table))
	case PostgresRpcTruncateCascade:
		return a.exec(fmt.Sprintf("TRUNCATE CASCADE`%s`", table))
	case PostgresRpcDrop:
		return a.exec(fmt.Sprintf("DROP TABLE `%s`", table))
	}

	return fmt.Errorf("Invalid table command '%s'", command)
}

// TableCommands implements database.Adapter.
func (*PostgresAdapter) TableCommands() []string {
	return []string{
		PostgresRpcDrop,
		PostgresRpcTruncate,
		PostgresRpcTruncateCascade,
	}
}

// SetContext sets the context instance that will be used for all queries
func (a *PostgresAdapter) SetContext(ctx context.Context) {
	a.ctx = ctx
}

// Use selects the currently active database
func (a *PostgresAdapter) Use(dbName string) {
	a.dbName = dbName
}

// Query performs a multi row query
func (a *PostgresAdapter) Query(query string) database.Results {
	c, err := a.con()
	if err != nil {
		return database.ErrResult(err)
	}
	defer c.Close()

	rows, err := c.QueryContext(a.ctx, query)
	if err != nil {
		return database.ErrResult(err)
	}
	defer rows.Close()

	return scanRows(rows)
}

// ListTables gets a list of all tables available on the schema
func (a *PostgresAdapter) ListTables() ([]string, error) {
	c, err := a.con()
	if err != nil {
		return nil, err
	}
	defer c.Close()

	var tables []string
	res, err := c.QueryContext(a.ctx, "SHOW TABLES")

	if err != nil {
		return nil, err
	}

	for res.Next() {
		var table string
		res.Scan(&table)
		tables = append(tables, table)
	}

	return tables, nil
}

// ListSchemas gets a list of all schemas in the database the current user has access to
func (a *PostgresAdapter) ListSchemas() ([]string, error) {
	var schemas []string
	res, err := a.db.QueryContext(a.ctx, "SHOW SCHEMAS")

	if err != nil {
		return nil, err
	}

	for res.Next() {
		var schema string
		res.Scan(&schema)
		schemas = append(schemas, schema)
	}

	return schemas, nil
}

var _ database.Adapter = (*PostgresAdapter)(nil)

// con sets up a connection for running a single query
//
// This is here solely so we can add a use query before all the others without hitting issues with the
// connection pool.
// This could also be done with a transaction but that is heavier and currently not necessary
func (a *PostgresAdapter) con() (*sql.Conn, error) {
	c, err := a.db.Conn(a.ctx)
	if err != nil {
		return nil, err
	}

	if a.dbName != "" {
		if _, err := c.ExecContext(a.ctx, fmt.Sprintf("USE `%s`", a.dbName)); err != nil {
			return nil, err
		}
	}

	return c, nil
}

// exec executes a sql query that expects no results
func (a *PostgresAdapter) exec(query string) error {
	c, err := a.con()
	if err != nil {
		return err
	}
	defer c.Close()

	_, err = c.ExecContext(a.ctx, query)
	return err
}
