package changeset

import "context"

type Service interface {
	InitGroup(context.Context, string) error
}