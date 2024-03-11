package main

type ConnectionType string

const (
	MySQL    ConnectionType = "MySQL"
	Postgres ConnectionType = "Postgres"
)

var ConnectionTypeEnum = []struct {
	Value  ConnectionType
	TSName string
}{
	{MySQL, "MySQL"},
	{Postgres, "Postgres"},
}
