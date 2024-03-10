package adapter

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/indeedhat/db-vue/internal/database"
)

type MySQLAdapter struct {
	db     *sql.DB
	dbName string
	ctx    context.Context
}

// DropTable implements database.Adapter.
func (a *MySQLAdapter) DropTable(table string) error {
	c, err := a.con()
	if err != nil {
		return err
	}
	defer c.Close()

	_, err = c.ExecContext(a.ctx, fmt.Sprintf("DROP `%s`", table))
	return err
}

// TruncateTable implements database.Adapter.
func (a *MySQLAdapter) TruncateTable(table string) error {
	c, err := a.con()
	if err != nil {
		return err
	}
	defer c.Close()

	_, err = c.ExecContext(a.ctx, fmt.Sprintf("TRUNCATE `%s`", table))
	return err
}

// NewMySQLAdapter sets up a new connection to the mysql database
func NewMySQLAdapter(ctx context.Context) (*MySQLAdapter, error) {
	db, err := sql.Open("mysql", "user:password@/my_database")
	if err != nil {
		return nil, err
	}

	return &MySQLAdapter{db: db, ctx: ctx}, nil
}

// SetContext sets the context instance that will be used for all queries
func (a *MySQLAdapter) SetContext(ctx context.Context) {
	a.ctx = ctx
}

// Use selects the currently active database
func (a *MySQLAdapter) Use(dbName string) {
	a.dbName = dbName
}

// Query performs a multi row query
func (a *MySQLAdapter) Query(query string) database.Results {
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
func (a *MySQLAdapter) ListTables() ([]string, error) {
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
func (a *MySQLAdapter) ListSchemas() ([]string, error) {
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

var _ database.Adapter = (*MySQLAdapter)(nil)

// con sets up a connection for running a single query
//
// This is here solely so we can add a use query before all the others without hitting issues with the
// connection pool.
// This could also be done with a transaction but that is heavier and currently not necessary
func (a *MySQLAdapter) con() (*sql.Conn, error) {
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