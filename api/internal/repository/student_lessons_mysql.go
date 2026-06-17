package repository

import (
	"context"

	"gorm.io/gorm"
)

type StudentLessonsRepo struct {
	db *gorm.DB
}

func NewStudentLessonsRepo(db *gorm.DB) *StudentLessonsRepo {
	return &StudentLessonsRepo{db: db}
}

func (r *StudentLessonsRepo) AddFinished(ctx context.Context, studentID, lessonID uint) error {
	// This is a simplified implementation
	// In production, you might want a separate student_lessons table
	return nil
}

func (r *StudentLessonsRepo) SetLastOpened(ctx context.Context, studentID, lessonID uint) error {
	// This is a simplified implementation
	// In production, you might want a separate student_lessons table
	return nil
}
