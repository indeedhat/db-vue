package main

import (
	"context"
	"fmt"

	"github.com/indeedhat/db-vue/internal/database"
	"github.com/indeedhat/db-vue/internal/database/adapter"
)

// App struct
type App struct {
	ctx     context.Context
	adapter database.Adapter
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		ctx:     context.Background(),
		adapter: nil,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	if a.adapter != nil {
		a.adapter.SetContext(ctx)
	}
}

func (a *App) Connect(details database.ConnectionDetails) error {
	var (
		err   error
		adapt database.Adapter
	)

	switch details.Type {
	case database.ConnTypeMySQL:
		adapt, err = adapter.NewMySQLAdapter(a.ctx, details)
		if err == nil {
			a.adapter = adapt
		}
	case database.ConnTypePostgres:
		adapt, err = adapter.NewPostgresAdapter(a.ctx, details)
		if err == nil {
			a.adapter = adapt
		}
	default:
		err = fmt.Errorf("Invalid database type: %s", details.Type)
	}

	return err
}

// DropTable implements database.App.
func (a *App) DropTable(table string) error {
	return a.adapter.DropTable(table)
}

// ListSchemas implements database.App.
func (a *App) ListSchemas() ([]string, error) {
	return a.adapter.ListSchemas()
}

// ListTables implements database.App.
func (a *App) ListTables() ([]string, error) {
	return a.adapter.ListTables()
}

// Query implements database.App.
func (a *App) Query(sql string) database.Results {
	return a.adapter.Query(sql)
}

// SetContext implements database.App.
func (a *App) SetContext(ctx context.Context) {
	if a.adapter != nil {
		a.adapter.SetContext(ctx)
	}
}

// TruncateTable implements database.App.
func (a *App) TruncateTable(table string) error {
	return a.adapter.TruncateTable(table)
}

// Use implements database.App.
func (a *App) Use(dbName string) {
	a.adapter.Use(dbName)
}

var _ database.Adapter = (*App)(nil)
