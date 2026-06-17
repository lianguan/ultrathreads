package repository

import (
	"context"

	"ultrathreads/internal/domain"
	"gorm.io/gorm"
)

type LessonContentRepo struct {
	db *gorm.DB
}

func NewLessonContentRepo(db *gorm.DB) *LessonContentRepo {
	return &LessonContentRepo{db: db}
}

func (r *LessonContentRepo) GetByLessons(ctx context.Context, lessonIDs []uint) ([]domain.LessonContent, error) {
	var contents []domain.LessonContent
	err := r.db.WithContext(ctx).
		Where("lesson_id IN ?", lessonIDs).
		Find(&contents).Error
	return contents, err
}

func (r *LessonContentRepo) GetByLesson(ctx context.Context, lessonID uint) (domain.LessonContent, error) {
	var content domain.LessonContent
	err := r.db.WithContext(ctx).
		Where("lesson_id = ?", lessonID).
		First(&content).Error
	return content, err
}

func (r *LessonContentRepo) Update(ctx context.Context, schoolID, lessonID uint, content string) error {
	var lc domain.LessonContent
	err := r.db.WithContext(ctx).
		Where("lesson_id = ? AND school_id = ?", lessonID, schoolID).
		First(&lc).Error

	if err == gorm.ErrRecordNotFound {
		// Create new
		lc = domain.LessonContent{
			LessonID: lessonID,
			SchoolID: schoolID,
			Content:  content,
		}
		return r.db.WithContext(ctx).Create(&lc).Error
	} else if err != nil {
		return err
	}

	// Update existing
	lc.Content = content
	return r.db.WithContext(ctx).Save(&lc).Error
}

func (r *LessonContentRepo) DeleteContent(ctx context.Context, schoolID uint, lessonIDs []uint) error {
	return r.db.WithContext(ctx).
		Where("school_id = ? AND lesson_id IN ?", schoolID, lessonIDs).
		Delete(&domain.LessonContent{}).Error
}
