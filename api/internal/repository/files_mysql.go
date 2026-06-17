package repository

import (
	"context"

	"ultrathreads/internal/domain"
	"gorm.io/gorm"
)

type FilesRepo struct {
	db *gorm.DB
}

func NewFilesRepo(db *gorm.DB) *FilesRepo {
	return &FilesRepo{db: db}
}

func (r *FilesRepo) Create(ctx context.Context, file domain.File) (uint, error) {
	err := r.db.WithContext(ctx).Create(&file).Error
	return file.ID, err
}

func (r *FilesRepo) UpdateStatus(ctx context.Context, fileName string, status domain.FileStatus) error {
	return r.db.WithContext(ctx).
		Model(&domain.File{}).
		Where("name = ?", fileName).
		Update("status", status).Error
}

func (r *FilesRepo) GetForUploading(ctx context.Context) (domain.File, error) {
	var file domain.File
	err := r.db.WithContext(ctx).
		Where("status = ?", domain.UploadedByClient).
		First(&file).Error
	if err != nil {
		return domain.File{}, err
	}

	// Update status to StorageUploadInProgress
	file.Status = domain.StorageUploadInProgress
	if err := r.db.WithContext(ctx).Save(&file).Error; err != nil {
		return domain.File{}, err
	}

	return file, nil
}

func (r *FilesRepo) UpdateStatusAndSetURL(ctx context.Context, id uint, url string) error {
	return r.db.WithContext(ctx).
		Model(&domain.File{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"url":    url,
			"status": domain.UploadedToStorage,
		}).Error
}

func (r *FilesRepo) GetByID(ctx context.Context, id, schoolID uint) (domain.File, error) {
	var file domain.File
	err := r.db.WithContext(ctx).
		Where("id = ? AND school_id = ?", id, schoolID).
		First(&file).Error
	return file, err
}
