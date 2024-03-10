package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app, err := NewApp()
	if err != nil {
		log.Fatal(err)
	}

	// Create application with options
	err = wails.Run(&options.App{
		Title:            "DB Vue",
		Width:            1024,
		Height:           768,
		WindowStartState: options.Normal,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 255},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			app.adapter,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
