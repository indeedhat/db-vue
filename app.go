package main

import (
	"context"
	"math/rand"

	"github.com/indeedhat/db-vue/internal/database"
	"github.com/indeedhat/db-vue/internal/database/adapter"
)

// App struct
type App struct {
	ctx     context.Context
	adapter database.Adapter
}

// NewApp creates a new App application struct
func NewApp() (*App, error) {
	var (
		db  database.Adapter
		err error
	)
	if rand.Intn(2) == 1 {
		db, err = adapter.NewMySQLAdapter(context.Background())
	} else {
		db, err = adapter.NewPostgresAdapter(context.Background())
	}

	if err != nil {
		return nil, err
	}

	return &App{adapter: &Adapter{db}}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.adapter.SetContext(ctx)
}
