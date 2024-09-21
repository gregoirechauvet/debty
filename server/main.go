package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"

	"debty/internal/changeset"
)

type Response struct {
	Message string `json:"message"`
}

type Handler struct {
	eventManager changeset.Service
}

func (h *Handler) handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	println("HTTP Method:", request.HTTPMethod)
	println("Resource Path:", request.Resource)

	response := Response{
		Message: "Bonjour depuis la Lambda Go!",
	}

	body, err := json.Marshal(response)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, err
	}

	if err := h.eventManager.InitGroup(ctx, "bobby"); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 501,
			Body: fmt.Sprintf("%v", err),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(body),
	}, nil
}

//func (h *Handler) postGroup(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
//
//}

func main() {
	tableName := os.Getenv("CHANGESET_TABLE_NAME")
	if tableName == "" {
		log.Fatal("CHANGESET_TABLE_NAME environment variable is not set")
	}

	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("Unable to load SDK config: %v", err)
	}

	dynamoClient := dynamodb.NewFromConfig(cfg)
	changesetDynamoDb := changeset.NewDynamoDb(dynamoClient, tableName)
	handler := Handler{changesetDynamoDb}

	lambda.Start(handler.handleRequest)
}