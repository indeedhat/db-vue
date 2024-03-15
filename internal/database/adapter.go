package database

import (
	"context"
)

type Adapter interface {
	SetContext(ctx context.Context)
	// Use database
	Use(dbName string)
	// ListSchemas available on the connection
	ListSchemas() ([]string, error)
	// ListTables available on the active schema
	ListTables() ([]string, error)
	// Query performs a query on the active schema
	Query(sql string) Results
	// TableCommands provides a list of rpc commands that can be ran on the table
	TableCommands() []string
	// RunTableCommand runs an rpc command on the table
	RunTableCommand(table, command string) error
}
