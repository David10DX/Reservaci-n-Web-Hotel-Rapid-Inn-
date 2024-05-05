package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type reservacion struct {
	FullName  string `json:"fullName"`
	Identidad string `json:"ID"`
	Correo    string `json:"correo"`
	Tel       string `json:"celular"`
	StartDate string `json:"startdate"` // Cambiado de start_date a startdate para que coincida con el frontend
	EndDate   string `json:"enddate"`   // Cambiado de end_date a enddate para que coincida con el frontend
	Adultos   int    `json:"adultos"`
	Ninos     int    `json:"ninos"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e := echo.New()
	e.Use(middleware.CORS())

	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017/BDR"))
	if err != nil {
		panic(err)
	}

	if err := client.Connect(context.Background()); err != nil {
		panic(err)
	}
	defer client.Disconnect(context.Background())

	e.POST("/reservacion", func(c echo.Context) error {
		u := new(reservacion)
		if err := c.Bind(u); err != nil {
			return err
		}
		coll := client.Database("BDR").Collection("reservacion")
		if _, err := coll.InsertOne(context.Background(), u); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, u)
	})

	e.GET("/reservacionHabilitada", func(c echo.Context) error {
		startdate := c.QueryParam("startdate")
		enddate := c.QueryParam("enddate")

		available, err := reservacionHabilitada(startdate, enddate, client)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error en el servidor"})
		}

		resp := map[string]bool{"disponible": available}
		return c.JSON(http.StatusOK, resp)
	})

	e.Logger.Fatal(e.Start(":" + port))
}

func reservacionHabilitada(startdate string, enddate string, client *mongo.Client) (bool, error) {
	fmt.Println("startdate:", startdate) // Imprimir la fecha de inicio
	fmt.Println("enddate:", enddate)

	coll := client.Database("BDR").Collection("reservacion")
	filter := bson.M{
		"$or": []bson.M{
			{"startdate": bson.M{"$lt": enddate}, "enddate": bson.M{"$gt": startdate}},
			{"startdate": bson.M{"$gte": startdate, "$lte": enddate}},
		},
	}

	count, err := coll.CountDocuments(context.Background(), filter)
	if err != nil {
		return false, err
	}

	return count == 0, nil
}
