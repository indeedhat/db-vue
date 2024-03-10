package main

import (
	"context"
	"log"

	"github.com/davecgh/go-spew/spew"
	"github.com/indeedhat/db-vue/internal/database/adapter"
)

func main() {
	conn, err := adapter.NewMySQLAdapter(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	conn.Use("my_database")

	// rows, err := conn.QueryRaw("select * from users")
	rows := conn.Query("select * from  users")
	if err != nil {
		log.Fatal(err)
	}

	// res := scanRows(rows)
	// r, err := sqlinternals.Inspect(rows)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// for rows.Next() {

	// }

	spew.Dump(rows)
}
