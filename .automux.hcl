# github.com/indeedhat/automux
session = "db-vue"

window "Editor" {
    exec = "vim"
    focus = true
}

window "Shell" {
    exec = "docker-compose up"

    split {
        exec = "sleep 5; wails dev"
    }
}
