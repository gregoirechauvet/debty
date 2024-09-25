package changeset

type Operation string

const (
	groupCreation Operation = "groupCreation"
)

type BaseOperation struct {
	GroupId       string `dynamodbav:"groupId"`
	EventDateTime int64  `dynamodbav:"eventDateTime"`
	Operation     string `dynamodbav:"operation"`
}

type GroupCreation struct {
	BaseOperation
	Name      string `dynamodbav:"name"`
	CreatorId string `dynamodbav:"creatorId"`
}

type Op[T any] struct {
	GroupId       string `dynamodbav:"groupId"`
	EventDateTime int64  `dynamodbav:"eventDateTime"`
	Operation     string `dynamodbav:"operation"`
	Content       T      `dynamodbav:"content"`
}
