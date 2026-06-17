package repository

import (
	"context"
	"errors"

	"ultrathreads/internal/domain"
	"gorm.io/gorm"
)

type PromocodesRepo struct {
	db *gorm.DB
}

func NewPromocodeRepo(db *gorm.DB) *PromocodesRepo {
	return &PromocodesRepo{db: db}
}

func (r *PromocodesRepo) Create(ctx context.Context, promocode domain.PromoCode) (uint, error) {
	err := r.db.WithContext(ctx).Create(&promocode).Error
	return promocode.ID, err
}

func (r *PromocodesRepo) Update(ctx context.Context, inp domain.UpdatePromoCodeInput) error {
	updates := map[string]interface{}{}

	if inp.Code != "" {
		updates["code"] = inp.Code
	}
	if inp.DiscountPercentage != 0 {
		updates["discount_percentage"] = inp.DiscountPercentage
	}
	if !inp.ExpiresAt.IsZero() {
		updates["expires_at"] = inp.ExpiresAt
	}
	if inp.OfferIDs != nil {
		updates["offer_ids"] = inp.OfferIDs
	}

	return r.db.WithContext(ctx).
		Model(&domain.PromoCode{}).
		Where("id = ? AND school_id = ?", inp.ID, inp.SchoolID).
		Updates(updates).Error
}

func (r *PromocodesRepo) Delete(ctx context.Context, schoolID, id uint) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND school_id = ?", id, schoolID).
		Delete(&domain.PromoCode{}).Error
}

func (r *PromocodesRepo) GetByCode(ctx context.Context, schoolID uint, code string) (domain.PromoCode, error) {
	var promocode domain.PromoCode
	err := r.db.WithContext(ctx).
		Where("school_id = ? AND code = ?", schoolID, code).
		First(&promocode).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.PromoCode{}, domain.ErrPromoNotFound
		}
		return domain.PromoCode{}, err
	}
	return promocode, nil
}

func (r *PromocodesRepo) GetByID(ctx context.Context, schoolID, id uint) (domain.PromoCode, error) {
	var promocode domain.PromoCode
	err := r.db.WithContext(ctx).
		Where("id = ? AND school_id = ?", id, schoolID).
		First(&promocode).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.PromoCode{}, domain.ErrPromoNotFound
		}
		return domain.PromoCode{}, err
	}
	return promocode, nil
}

func (r *PromocodesRepo) GetBySchool(ctx context.Context, schoolID uint) ([]domain.PromoCode, error) {
	var promocodes []domain.PromoCode
	err := r.db.WithContext(ctx).
		Where("school_id = ?", schoolID).
		Find(&promocodes).Error
	return promocodes, err
}
