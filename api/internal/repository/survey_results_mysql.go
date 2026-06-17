package repository

import (
	"context"

	"ultrathreads/internal/domain"
	"gorm.io/gorm"
)

type SurveyResultsRepo struct {
	db *gorm.DB
}

func NewSurveyResultsRepo(db *gorm.DB) *SurveyResultsRepo {
	return &SurveyResultsRepo{db: db}
}

func (r *SurveyResultsRepo) Save(ctx context.Context, results domain.SurveyResult) error {
	return r.db.WithContext(ctx).Create(&results).Error
}

func (r *SurveyResultsRepo) GetAllByModule(ctx context.Context, moduleID uint, pagination *domain.PaginationQuery) ([]domain.SurveyResult, int64, error) {
	var results []domain.SurveyResult
	var count int64

	db := r.db.WithContext(ctx).Model(&domain.SurveyResult{}).Where("module_id = ?", moduleID)

	if err := db.Count(&count).Error; err != nil {
		return nil, 0, err
	}

	if pagination != nil {
		if pagination.Limit > 0 {
			db = db.Limit(int(pagination.Limit))
		}
		if pagination.Skip > 0 {
			db = db.Offset(int(pagination.Skip))
		}
	}

	err := db.Order("submitted_at DESC").Find(&results).Error
	return results, count, err
}

func (r *SurveyResultsRepo) GetByStudent(ctx context.Context, moduleID, studentID uint) (domain.SurveyResult, error) {
	var result domain.SurveyResult
	err := r.db.WithContext(ctx).
		Where("module_id = ? AND student_id = ?", moduleID, studentID).
		First(&result).Error
	return result, err
}
