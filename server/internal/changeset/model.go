package changeset

type GroupCreation struct {
	GroupId       string `dynamodbav:"groupId"`
	EventDateTime int64  `dynamodbav:"eventDateTime"`
	Name          string `dynamodbav:"name"`
	CreatorId     string `dynamodbav:"creatorId"`
}
