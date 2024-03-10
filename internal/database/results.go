package database

import "database/sql"

type Results struct {
	Error    error        `json:"error"`
	Headers  []string     `json:"headers"`
	Rows     []any        `json:"rows"`
	ColTypes []ColumnType `json:"col_types"`
}

type ColumnType struct {
	Name string `json:"name"`

	Nullable     bool   `json:"nullable"`
	Length       int64  `json:"length"`
	DatabaseType string `json:"database_type"`
	Precision    int64  `json:"precison"`
	Scale        int64  `json:"scale"`
	ScanType     string `json:"scan_type"`
}

func NewColumnType(ct *sql.ColumnType) ColumnType {
	t := ColumnType{
		Name:         ct.Name(),
		DatabaseType: ct.DatabaseTypeName(),
	}

	t.Nullable, _ = ct.Nullable()
	t.Length, _ = ct.Length()
	t.Precision, t.Scale, _ = ct.DecimalSize()
	t.ScanType = ct.ScanType().Name()

	return t
}

func ErrResult(err error) Results {
	return Results{Error: err}
}
