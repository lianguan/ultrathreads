package repository

import (
	"context"
	"errors"
	"time"

	"ultrathreads/internal/domain"
	"gorm.io/gorm"
)

type AdminsRepo struct {
	db *gorm.DB
}

func NewAdminsRepo(db *gorm.DB) *AdminsRepo {
	return &AdminsRepo{db: db}
}

func (r *AdminsRepo) GetByCredentials(ctx context.Context, schoolID uint, email, password string) (domain.Admin, error) {
	var admin domain.Admin
	err := r.db.WithContext(ctx).
		Where("school_id = ? AND email = ? AND password = ?", schoolID, email, password).
		First(&admin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Admin{}, domain.ErrUserNotFound
		}
		return domain.Admin{}, err
	}
	return admin, nil
}

func (r *AdminsRepo) GetByRefreshToken(ctx context.Context, schoolID uint, refreshToken string) (domain.Admin, error) {
	var admin domain.Admin
	err := r.db.WithContext(ctx).
		Where("school_id = ? AND session_refresh_token = ? AND session_expires_at > ?", schoolID, refreshToken, time.Now()).
		First(&admin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Admin{}, domain.ErrUserNotFound
		}
		return domain.Admin{}, err
	}
	return admin, nil
}

func (r *AdminsRepo) SetSession(ctx context.Context, id uint, session domain.Session) error {
	return r.db.WithContext(ctx).
		Model(&domain.Admin{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"session_refresh_token": session.RefreshToken,
			"session_expires_at":    session.ExpiresAt,
		}).Error
}

func (r *AdminsRepo) GetById(ctx context.Context, id uint) (domain.Admin, error) {
	var admin domain.Admin
	err := r.db.WithContext(ctx).First(&admin, id).Error
	return admin, err
}
