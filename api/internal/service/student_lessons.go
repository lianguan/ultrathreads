package service

import (
	"context"

	"ultrathreads/internal/repository"
)

type StudentLessonsService struct {
	repo repository.StudentLessons
}

func NewStudentLessonsService(repo repository.StudentLessons) *StudentLessonsService {
	return &StudentLessonsService{
		repo: repo,
	}
}

func (s *StudentLessonsService) AddFinished(ctx context.Context, studentID, lessonID uint) error {
	return s.repo.AddFinished(ctx, studentID, lessonID)
}

func (s *StudentLessonsService) SetLastOpened(ctx context.Context, studentID, lessonID uint) error {
	return s.repo.SetLastOpened(ctx, studentID, lessonID)
}
