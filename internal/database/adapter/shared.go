package adapter

import (
	"database/sql"
	"reflect"

	"github.com/indeedhat/db-vue/internal/database"
)

func buildRowSlice(types []*sql.ColumnType) []reflect.Value {
	var row []reflect.Value

	for _, t := range types {
		row = append(row, reflect.New(t.ScanType()))
	}

	return row
}

// scanRows builds up a database.Results entry from the provided *sql.Rows one
func scanRows(res *sql.Rows) database.Results {
	cols, err := res.Columns()
	if err != nil {
		return database.ErrResult(err)
	}

	types, err := res.ColumnTypes()
	if err != nil {
		return database.ErrResult(err)
	}

	r := database.Results{
		Headers: cols,
	}

	for _, ct := range types {
		r.ColTypes = append(r.ColTypes, database.NewColumnType(ct))
	}

	for res.Next() {
		tmpRow := buildRowSlice(types)

		var pointers []any
		for i := range tmpRow {
			pointers = append(pointers, tmpRow[i].Interface())
		}

		err = res.Scan(pointers...)
		if err != nil {
			return database.ErrResult(err)
		}

		var row []any
		for i := range tmpRow {
			row = append(row, tmpRow[i].Elem().Interface())
		}

		r.Rows = append(r.Rows, row)
	}

	return r
}
