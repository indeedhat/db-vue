package database

import (
	"context"
)

type Adapter interface {
	SetContext(ctx context.Context)
	Use(dbName string)
	ListSchemas() ([]string, error)
	ListTables() ([]string, error)
	Query(sql string) Results
	TruncateTable(table string) error
	DropTable(table string) error
}
