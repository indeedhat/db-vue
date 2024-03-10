package main

import (
	"context"
	"database/sql"
	"log"

	"github.com/davecgh/go-spew/spew"
	_ "github.com/go-sql-driver/mysql"
	// "gorm.io/driver/mysql"
	// "gorm.io/gorm"
)

func main() {
	// doGorm()
	doNative()
}

func doNative() {
	dsn := "user:password@/my_database" //?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	con, err := db.Conn(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	con.ExecContext(context.Background(), "USE `my_database`")

	rows, err := con.QueryContext(context.Background(), "describe users")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	res := scanRows(rows)

	spew.Dump(res)
}

// func doGorm() {
// 	dsn := "user:password@tcp(127.0.0.1:3306)/my_database?charset=utf8mb4&parseTime=True&loc=Local"
// 	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	results := make(map[string]any)

// 	tx := db.Raw("describe users").Scan(&results)
// 	if tx.Error != nil {
// 		log.Fatal(tx.Error)
// 	}
// 	spew.Dump(results)
// }

func scanRows(rows *sql.Rows) [][]any {
	var out [][]any

	cols, err := rows.Columns()
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		row := make([]any, len(cols))
		var refs []any

		for i := range row {
			refs = append(refs, &row[i])
		}

		rows.Scan(refs...)
		out = append(out, row)
	}

	return out
}
