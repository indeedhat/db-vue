package main

// This is required for the front end, its annoying but there you go

import (
	"context"
	"github.com/indeedhat/db-vue/internal/database"
)

type Adapter struct {
	adapter database.Adapter
}

// DropTable implements database.Adapter.
func (a *Adapter) DropTable(table string) error {
	return a.adapter.DropTable(table)
}

// ListSchemas implements database.Adapter.
func (a *Adapter) ListSchemas() ([]string, error) {
	return a.adapter.ListSchemas()
}

// ListTables implements database.Adapter.
func (a *Adapter) ListTables() ([]string, error) {
	return a.adapter.ListTables()
}

// Query implements database.Adapter.
func (a *Adapter) Query(sql string) database.Results {
	return a.adapter.Query(sql)
}

// SetContext implements database.Adapter.
func (a *Adapter) SetContext(ctx context.Context) {
	a.adapter.SetContext(ctx)
}

// TruncateTable implements database.Adapter.
func (a *Adapter) TruncateTable(table string) error {
	return a.adapter.TruncateTable(table)
}

// Use implements database.Adapter.
func (a *Adapter) Use(dbName string) {
	a.adapter.Use(dbName)
}

var _ database.Adapter = (*Adapter)(nil)
