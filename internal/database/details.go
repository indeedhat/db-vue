package database

type ConnectionType string

const (
	ConnTypeMySQL    ConnectionType = "MySQL"
	ConnTypePostgres ConnectionType = "Postgres"
)

var ConnectionTypeEnum = []struct {
	Value  ConnectionType
	TSName string
}{
	{ConnTypeMySQL, "MySQL"},
	{ConnTypePostgres, "Postgres"},
}

type ConnectionDetails struct {
	Type ConnectionType `json:"type"`
	Name string         `json:"name"`
	Host string         `json:"host"`
	Port int            `json:"port"`
	User string         `json:"user"`
	Pass string         `json:"pass"`
}
