package repository

import (
	"context"
	"errors"
	"time"

	"ultrathreads/internal/domain"

	"gorm.io/gorm"
)

type UsersRepo struct {
	db *gorm.DB
}

func NewUsersRepo(db *gorm.DB) *UsersRepo {
	return &UsersRepo{db: db}
}

func (r *UsersRepo) Create(ctx context.Context, user domain.User) error {
	res := r.db.WithContext(ctx).Create(&user)
	if res.Error != nil {
		return res.Error
	}
	return nil
}

func (r *UsersRepo) GetByCredentials(ctx context.Context, email, password string) (domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).Where("email = ? AND password = ?", email, password).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.User{}, domain.ErrUserNotFound
		}
		return domain.User{}, err
	}
	return user, nil
}

func (r *UsersRepo) GetByRefreshToken(ctx context.Context, refreshToken string) (domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).
		Where("session_refresh_token = ? AND session_expires_at > ?", refreshToken, time.Now()).
		First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.User{}, domain.ErrUserNotFound
		}
		return domain.User{}, err
	}
	return user, nil
}

func (r *UsersRepo) Verify(ctx context.Context, userID uint, code string) error {
	res := r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ? AND verification_code = ?", userID, code).
		Updates(map[string]interface{}{
			"verification_verified": true,
			"verification_code":     "",
		})
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return domain.ErrVerificationCodeInvalid
	}
	return nil
}

func (r *UsersRepo) SetSession(ctx context.Context, userID uint, session domain.Session) error {
	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Updates(map[string]interface{}{
			"session_refresh_token": session.RefreshToken,
			"session_expires_at":    session.ExpiresAt,
			"last_visit_at":         time.Now(),
		}).Error
}

func (r *UsersRepo) AttachSchool(ctx context.Context, userID, schoolID uint) error {
	var user domain.User
	if err := r.db.WithContext(ctx).First(&user, userID).Error; err != nil {
		return err
	}

	schools := user.Schools
	schools = append(schools, schoolID)

	return r.db.WithContext(ctx).
		Model(&domain.User{}).
		Where("id = ?", userID).
		Update("schools", schools).Error
}
