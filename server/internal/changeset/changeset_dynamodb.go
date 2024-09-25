package changeset

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

type DynamoDb struct {
	client    *dynamodb.Client
	tableName string
}

func NewDynamoDb(client *dynamodb.Client, tableName string) *DynamoDb {
	return &DynamoDb{
		client:    client,
		tableName: tableName,
	}
}

func (db *DynamoDb) InitGroup(ctx context.Context, name string) error {
	groupCreation := GroupCreation{
		BaseOperation: BaseOperation{
			GroupId:       uuid.New().String(),
			EventDateTime: db.GetEventDateTime(),
			Operation:     string(groupCreation),
		},
		Name: name,
	}
	item, err := attributevalue.MarshalMap(groupCreation)
	if err != nil {
		return fmt.Errorf("cannot marshal group creation: %w", err)
	}

	params := dynamodb.PutItemInput{
		TableName: aws.String(db.tableName),
		Item:      item,
	}

	_, err = db.client.PutItem(ctx, &params)
	if err != nil {
		return fmt.Errorf("cannot put item in DynamoDB: %w", err)
	}

	return nil
}

func (db *DynamoDb) GetEventDateTime() int64 {
	return time.Now().UnixMicro()
}
