# DB Vue

an incredibly simplistic tool to run queries agains relational databases.

> This is not a full database management utility, it lets you run queries and view results.


## Progress
- [x] list schemas
- [x] list databases
- [x] run queries
- [x] view results
- [x] truncate table
    - [x] add confimation prompt
- [x] drop table
    - [x] add confimation prompt

- [x] table tabs
- [x] schema tab sets
- [x] persist store

- [x] accept connection details
- [x] save connections
- [x] edit/delete connections
- [ ] close connection
    - possible could instead allow for multiple connections to be open at a time

- [ ] add new rows
- [x] view row as json
- [ ] edit rows
- [ ] drop rows

- [x] mysql
- [x] postgresql
- [ ] sqlite

- [ ] intelisense on query input 
    - need to look into if ace provides a way to do this

## Known issues
- [ ] there is no feedback when running a query that does not have results (such as create table)
